import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Dashboard' },
  { path: '/products', icon: ShoppingBagIcon, label: 'Products' },
  { path: '/orders', icon: ClipboardDocumentListIcon, label: 'Orders' },
  { path: '/categories', icon: TagIcon, label: 'Categories' },
  { path: '/users', icon: UsersIcon, label: 'Users' },
];

export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-950">
      <aside className="hidden xl:flex w-72 flex-col bg-slate-950 text-slate-100">
        <div className="px-8 py-8 border-b border-white/10">
          <div className="text-2xl font-semibold tracking-tight">Pecumat</div>
          <p className="mt-2 text-sm text-slate-400">E-commerce admin panel</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-slate-200/10 text-white shadow-[0_8px_30px_rgba(15,23,42,0.15)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-6 pb-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-base font-bold text-white">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
              <p className="mt-1 font-semibold">{admin?.username || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-white/10"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm xl:hidden">
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-slate-950 px-6 py-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold tracking-tight text-white">Pecumat</div>
                <p className="text-sm text-slate-400">Admin panel</p>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="rounded-full bg-slate-900/80 p-2 text-slate-200 transition hover:bg-slate-900">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 space-y-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-slate-200/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
              <p className="mt-2 font-semibold text-white">{admin?.username || 'Admin'}</p>
              <button
                onClick={handleLogout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-screen">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-6 py-5 xl:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50 xl:hidden"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome back, {admin?.username || 'Admin'}</h1>
            </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="relative block w-full sm:w-[360px]">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  placeholder="Search orders, products, users"
                  type="search"
                />
              </label>
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-base font-bold text-white">
                  {admin?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
                  <p className="font-semibold text-slate-950">{admin?.username || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1240px] px-6 py-8 xl:px-8">
          <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
