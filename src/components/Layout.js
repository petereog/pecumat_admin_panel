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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">🛒 Ecommerce Admin</div>
        <nav className="nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>{admin?.username}</div>
          <button onClick={handleLogout} className="logout-btn">
            <ArrowRightOnRectangleIcon /> Logout
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="search-input">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
              <input placeholder="Search products, orders, users..." style={{border:'none',outline:'none',width:240,fontSize:14}} />
            </div>
          </div>

          <div className="profile-pill">
            <div style={{textAlign:'right',marginRight:8}}>
              <div style={{fontSize:12,color:'var(--muted)'}}>Signed in as</div>
              <div style={{fontWeight:700}}>{admin?.username}</div>
            </div>
            <div className="avatar">{admin?.username?.[0]?.toUpperCase() || 'A'}</div>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          <div className="container">
            <div className="card" style={{ padding: 0 }}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}