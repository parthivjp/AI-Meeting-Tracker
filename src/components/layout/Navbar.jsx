import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../context/MeetingContext';

export default function Navbar({ title, onMenuClick }) {
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const { meetings } = useMeetings();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchResults = search.trim()
    ? meetings.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.type.toLowerCase().includes(search.toLowerCase()) ||
          m.participants.some((p) => p.toLowerCase().includes(search.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">{title}</h1>

      <div className="relative ml-auto max-w-md flex-1 hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search meetings, types, participants..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
        />
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            {searchResults.map((m) => (
              <button
                key={m.id}
                onClick={() => { navigate(`/meetings/${m.id}`); setSearch(''); }}
                className="flex w-full flex-col px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white">{m.title}</span>
                <span className="text-xs text-slate-500">{m.type} · {m.date}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              {user?.avatar || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.name}
            </span>
            <ChevronDown className="hidden md:block h-4 w-4 text-slate-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800 animate-fade-in">
              <div className="border-b border-slate-200 px-4 py-2 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700">
                <User className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
