import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Products() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [images, setImages] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(res => res.data.products),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product created');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', category: '', stock: '' });
      setImages([]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['products']); toast.success('Product deleted'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    images.forEach(img => formData.append('images', img));
    createMutation.mutate(formData);
  };

  if (isLoading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b' }}>Products</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {['name', 'category', 'price', 'stock'].map(field => (
              <div key={field}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, textTransform: 'capitalize' }}>{field}</label>
                <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Images</label>
              <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }} />
              {images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <img key={i} src={URL.createObjectURL(img)} alt="preview"
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #d1d5db' }} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <button type="submit" disabled={createMutation.isPending}
            style={{ marginTop: 16, background: '#10b981', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
            {createMutation.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      )}

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: 14 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map(product => (
              <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 8 }} />
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{product.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{product.category}</td>
                <td style={{ padding: '12px 16px' }}>${product.price}</td>
                <td style={{ padding: '12px 16px' }}>{product.stock}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => deleteMutation.mutate(product._id)}
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}