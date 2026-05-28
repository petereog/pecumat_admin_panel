import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Dashboard' },
  { path: '/products', icon: ShoppingBagIcon, label: 'Products' },
  { path: '/orders', icon: ClipboardDocumentListIcon, label: 'Orders' },
  { path: '/categories', icon: TagIcon, label: 'Categories' },
  { path: '/users', icon: UsersIcon, label: 'Users' },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 16px', fontSize: 20, fontWeight: 'bold', borderBottom: '1px solid #334155' }}>
          🛒 Admin Panel
        </div>
        <nav style={{ flex: 1, padding: 16 }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                textDecoration: 'none', color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#3b82f6' : 'transparent',
              })}
            >
              <Icon style={{ width: 20, height: 20 }} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: 16, borderTop: '1px solid #334155' }}>
          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>{admin?.username}</div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            <ArrowRightOnRectangleIcon style={{ width: 20, height: 20 }} />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: '#f1f5f9', overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}