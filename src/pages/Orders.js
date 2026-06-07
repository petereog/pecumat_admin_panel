import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusStyles = {
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const paymentStyles = {
  paid: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-rose-100 text-rose-700',
};

export default function Orders() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then((res) => res.data.orders),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, orderStatus }) => api.put(`/orders/${id}/status`, { orderStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Order updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  if (isLoading) return <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-slate-500 shadow-xl shadow-slate-200/30">Loading orders...</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sales</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Orders</h1>
          </div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{data?.length ?? 0} total orders</span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500">
                {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Actions'].map((head) => (
                  <th key={head} className="px-4 py-4 font-medium">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {data?.map((order) => (
                <tr key={order._id} className="bg-white transition hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-600">#{order._id.slice(-6)}</td>
                  <td className="px-4 py-4 text-slate-900">{order.user?.username}</td>
                  <td className="px-4 py-4 text-slate-900">${order.totalPrice}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentStyles[order.paymentStatus] ?? 'bg-slate-100 text-slate-700'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] ?? 'bg-slate-100 text-slate-700'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateMutation.mutate({ id: order._id, orderStatus: e.target.value })}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
    </div>
  );
}