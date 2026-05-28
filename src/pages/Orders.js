import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  processing: { bg: '#fef3c7', color: '#92400e' },
  shipped: { bg: '#dbeafe', color: '#1e40af' },
  delivered: { bg: '#d1fae5', color: '#065f46' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

export default function Orders() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then(res => res.data.orders),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, orderStatus }) => api.put(`/orders/${id}/status`, { orderStatus }),
    onSuccess: () => { queryClient.invalidateQueries(['orders']); toast.success('Order updated'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  if (isLoading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 24 }}>Orders</h1>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: 14 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>#{order._id.slice(-6)}</td>
                <td style={{ padding: '12px 16px' }}>{order.user?.username}</td>
                <td style={{ padding: '12px 16px' }}>${order.totalPrice}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                    background: order.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                    color: order.paymentStatus === 'paid' ? '#065f46' : '#92400e',
                  }}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                    background: statusColors[order.orderStatus]?.bg,
                    color: statusColors[order.orderStatus]?.color,
                  }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={order.orderStatus}
                    onChange={e => updateMutation.mutate({ id: order._id, orderStatus: e.target.value })}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}