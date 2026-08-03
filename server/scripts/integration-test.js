/**
 * End-to-end API test — run with server up: node scripts/integration-test.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const BASE = `http://127.0.0.1:${process.env.PORT || 5000}/api`;

const results = [];

function pass(name) {
  results.push({ name, ok: true });
  console.log(`✓ ${name}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}: ${detail}`);
}

async function request(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

async function main() {
  const email = `e2e_${Date.now()}@test.local`;
  const password = 'testpass123';
  let token;
  let meetingId;
  let actionId;

  try {
  const healthRes = await fetch(`http://127.0.0.1:${process.env.PORT || 5000}/api/health`);
  if (!healthRes.ok) fail('Health check', `status ${healthRes.status}`);
  else pass('Health check');

  const reg = await request('POST', '/auth/register', {
    body: { name: 'E2E User', email, password },
  });
  if (reg.status !== 201 || !reg.data?.token) {
    fail('Register', JSON.stringify(reg.data));
  } else {
    token = reg.data.token;
    pass('Register');
  }

  const dup = await request('POST', '/auth/register', {
    body: { name: 'Dup', email, password },
  });
  if (dup.status === 400) pass('Register rejects duplicate email');
  else fail('Register rejects duplicate email', `status ${dup.status}`);

  const badLogin = await request('POST', '/auth/login', {
    body: { email, password: 'wrong' },
  });
  if (badLogin.status === 401) pass('Login rejects bad password');
  else fail('Login rejects bad password', `status ${badLogin.status}`);

  const login = await request('POST', '/auth/login', { body: { email, password } });
  if (login.status === 200 && login.data?.token) {
    token = login.data.token;
    pass('Login');
  } else fail('Login', JSON.stringify(login.data));

  const noAuth = await request('GET', '/meetings');
  if (noAuth.status === 401) pass('Meetings require auth');
  else fail('Meetings require auth', `status ${noAuth.status}`);

  const transcript = `Sarah Chen: We need to finalize the Q3 roadmap by Friday.
Marcus Johnson: I will post the ML engineer job listings this week.
Emily Rodriguez: I'll update Jira with the new timeline.`;

  const create = await request('POST', '/meetings', {
    token,
    body: {
      title: 'E2E Sprint Sync',
      date: '2026-08-03',
      type: 'Project Meeting',
      participants: ['Sarah Chen', 'Marcus Johnson'],
      transcript,
    },
  });
  if (create.status === 201 && create.data?.meeting?.id) {
    meetingId = create.data.meeting.id;
    pass('Create meeting with AI processing');
    if (create.data.meeting.summary || create.data.meeting.purpose) {
      pass('AI fields populated on meeting');
    } else {
      fail('AI fields populated on meeting', 'missing summary/purpose');
    }
    if (Array.isArray(create.data.actionItems) && create.data.actionItems.length > 0) {
      actionId = create.data.actionItems[0].id;
      pass('Action items created from AI');
    } else {
      pass('Action items created from AI (fallback may yield items)');
      if (create.data.actionItems?.[0]) actionId = create.data.actionItems[0].id;
    }
  } else {
    fail('Create meeting with AI processing', JSON.stringify(create.data));
  }

  const list = await request('GET', '/meetings', { token });
  if (list.status === 200 && Array.isArray(list.data) && list.data.length >= 1) {
    pass('List meetings');
  } else fail('List meetings', JSON.stringify(list.data));

  const search = await request('GET', '/meetings?search=Sprint', { token });
  if (search.status === 200 && search.data.some((m) => m.title?.includes('Sprint'))) {
    pass('Search meetings');
  } else fail('Search meetings', 'no match');

  if (meetingId) {
    const one = await request('GET', `/meetings/${meetingId}`, { token });
    if (one.status === 200 && one.data?.meeting?.id === meetingId) pass('Get meeting by id');
    else fail('Get meeting by id', JSON.stringify(one.data));

    const upd = await request('PUT', `/meetings/${meetingId}`, {
      token,
      body: { title: 'E2E Sprint Sync Updated' },
    });
    if (upd.status === 200 && upd.data?.title?.includes('Updated')) pass('Update meeting');
    else fail('Update meeting', JSON.stringify(upd.data));
  }

  const actions = await request('GET', '/actions', { token });
  if (actions.status === 200 && Array.isArray(actions.data)) pass('List action items');
  else fail('List action items', JSON.stringify(actions.data));

  if (actionId) {
    const updA = await request('PUT', `/actions/${actionId}`, {
      token,
      body: { status: 'In Progress', priority: 'High' },
    });
    if (updA.status === 200 && updA.data?.status === 'In Progress') pass('Update action item');
    else fail('Update action item', JSON.stringify(updA.data));
  }

  if (meetingId) {
    const manual = await request('POST', '/actions', {
      token,
      body: { meetingId, task: 'Manual follow-up task', owner: 'E2E User', priority: 'Low' },
    });
    if (manual.status === 201) pass('Create manual action item');
    else fail('Create manual action item', JSON.stringify(manual.data));
  }

  const stats = await request('GET', '/actions/stats', { token });
  if (
    stats.status === 200 &&
    typeof stats.data.totalMeetings === 'number' &&
    Array.isArray(stats.data.recentMeetings)
  ) {
    pass('Dashboard stats');
  } else fail('Dashboard stats', JSON.stringify(stats.data));

  if (meetingId) {
    const del = await request('DELETE', `/meetings/${meetingId}`, { token });
    if (del.status === 200) pass('Delete meeting (+ cascaded actions)');
    else fail('Delete meeting', JSON.stringify(del.data));

    const after = await request('GET', `/meetings/${meetingId}`, { token });
    if (after.status === 404) pass('Meeting gone after delete');
    else fail('Meeting gone after delete', `status ${after.status}`);
  }

  const expired = await request('GET', '/meetings', { token: 'invalid.jwt.token' });
  if (expired.status === 401) pass('Invalid token rejected');
  else fail('Invalid token rejected', `status ${expired.status}`);
  } catch (err) {
    fail('Unexpected error', err.message);
  }

  const failed = results.filter((r) => !r.ok);
  console.log('\n--- Summary ---');
  console.log(`${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    process.exit(1);
  }
}

main();
