import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((res) => res.data.users),
  });

  if (isLoading) return <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-slate-500 shadow-xl shadow-slate-200/30">Loading users...</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">User directory</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Users</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{data?.length ?? 0} users</span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500">
                {['Username', 'Email', 'Role', 'Joined'].map((h) => (
                  <th key={h} className="px-4 py-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {data?.map((user) => (
                <tr key={user._id} className="bg-white transition hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{user.username}</td>
                  <td className="px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}