import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const StatCard = ({ title, value, color }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>{title}</p>
    <p style={{ fontSize: 32, fontWeight: 'bold', color: '#1e293b' }}>{value}</p>
  </div>
);

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(res => res.data.stats),
  });

  if (isLoading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 24 }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        <StatCard title="Total Users" value={data?.totalUsers} color="#3b82f6" />
        <StatCard title="Total Products" value={data?.totalProducts} color="#10b981" />
        <StatCard title="Total Orders" value={data?.totalOrders} color="#f59e0b" />
        <StatCard title="Total Revenue" value={`$${data?.totalRevenue?.toFixed(2)}`} color="#8b5cf6" />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 }}>Recent Orders</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 14 }}>Order ID</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 14 }}>Customer</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 14 }}>Total</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 14 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.recentOrders?.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: 13, color: '#64748b' }}>#{order._id.slice(-6)}</td>
                <td style={{ padding: '12px', fontSize: 14 }}>{order.user?.username}</td>
                <td style={{ padding: '12px', fontSize: 14 }}>${order.totalPrice}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
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
  );
}