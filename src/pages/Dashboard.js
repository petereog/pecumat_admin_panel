import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const StatCard = ({ title, value }) => (
  <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
    <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{title}</p>
    <p className="mt-4 text-3xl font-semibold text-slate-950">{value ?? '-'}</p>
  </div>
);

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(res => res.data.stats),
  });

  if (isLoading) return <div className="p-8 text-slate-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Dashboard</h1>
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
          Updated just now
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={data?.totalUsers} />
        <StatCard title="Total Products" value={data?.totalProducts} />
        <StatCard title="Total Orders" value={data?.totalOrders} />
        <StatCard title="Total Revenue" value={data?.totalRevenue ? `$${data.totalRevenue.toFixed(2)}` : '-'} />
      </div>

      <section className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-950">Recent Orders</p>
            <p className="text-sm text-slate-500">Latest activity from your store</p>
          </div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{data?.recentOrders?.length ?? 0} orders</span>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {data?.recentOrders?.map(order => (
                <tr key={order._id} className="bg-slate-50/50 hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-600">#{order._id.slice(-6)}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">{order.user?.username}</td>
                  <td className="px-4 py-4 text-slate-900">${order.totalPrice}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.orderStatus === 'processing'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}