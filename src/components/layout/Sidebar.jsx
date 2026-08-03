import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  CheckSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/meetings', icon: Calendar, label: 'Meetings' },
  { to: '/meetings/new', icon: PlusCircle, label: 'New Meeting' },
  { to: '/action-tracker', icon: CheckSquare, label: 'Action Tracker' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const content = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">MeetAI</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Transcript & Actions</p>
          </div>
        )}
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200
              ${isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:block border-t border-slate-200 p-3 dark:border-slate-700">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-900
          ${collapsed ? 'w-[68px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        {content}
      </aside>
    </>
  );
}
