import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data.users),
  });

  if (isLoading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 24 }}>Users</h1>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Username', 'Email', 'Role', 'Joined'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: 14 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{user.username}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                    background: user.role === 'admin' ? '#dbeafe' : '#f1f5f9',
                    color: user.role === 'admin' ? '#1e40af' : '#475569',
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}