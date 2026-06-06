import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Stack,
  Divider,
  InputBase,
} from '@mui/material';
import {
  DashboardCustomizeOutlined,
  Inventory2Outlined,
  ReceiptLongOutlined,
  CategoryOutlined,
  GroupOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@mui/icons-material';

const drawerWidth = 280;
const navItems = [
  { path: '/', icon: DashboardCustomizeOutlined, label: 'Dashboard' },
  { path: '/products', icon: Inventory2Outlined, label: 'Products' },
  { path: '/orders', icon: ReceiptLongOutlined, label: 'Orders' },
  { path: '/categories', icon: CategoryOutlined, label: 'Categories' },
  { path: '/users', icon: GroupOutlined, label: 'Users' },
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
          <div className="search-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
            <input placeholder="Search products, orders, users..." />
          </div>

          <div className="profile-pill">
            <div style={{ textAlign: 'right', marginRight: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Signed in as</div>
              <div style={{ fontWeight: 700 }}>{admin?.username}</div>
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