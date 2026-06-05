import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const StatCard = ({ title, value, color }) => (
  <div className="card" style={{ borderLeft: `4px solid ${color}`, padding: 20 }}>
    <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>{title}</p>
    <p style={{ fontSize: 28, fontWeight: 800, color: '#0f1724' }}>{value}</p>
  </div>
);

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(res => res.data.stats),
  });

  if (isLoading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 20 }}>
        <StatCard title="Total Users" value={data?.totalUsers} color="#3b82f6" />
        <StatCard title="Total Products" value={data?.totalProducts} color="#10b981" />
        <StatCard title="Total Orders" value={data?.totalOrders} color="#f59e0b" />
        <StatCard title="Total Revenue" value={data?.totalRevenue ? `$${data.totalRevenue.toFixed(2)}` : '-'} color="#8b5cf6" />
      </div>

      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1724', marginBottom: 12 }}>Recent Orders</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(15,23,36,0.06)' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--muted)', fontSize: 13 }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--muted)', fontSize: 13 }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--muted)', fontSize: 13 }}>Total</th>
                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--muted)', fontSize: 13 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid rgba(15,23,36,0.04)' }}>
                  <td style={{ padding: '12px', fontSize: 13, color: 'var(--muted)' }}>#{order._id.slice(-6)}</td>
                  <td style={{ padding: '12px', fontSize: 14 }}>{order.user?.username}</td>
                  <td style={{ padding: '12px', fontSize: 14 }}>${order.totalPrice}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                      background: order.orderStatus === 'delivered' ? '#d1fae5' : order.orderStatus === 'processing' ? '#fef3c7' : '#fee2e2',
                      color: order.orderStatus === 'delivered' ? '#065f46' : order.orderStatus === 'processing' ? '#92400e' : '#991b1b',
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}