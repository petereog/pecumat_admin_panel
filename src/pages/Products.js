import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

function ProductCard({ product, onDelete }) {
  return (
    <tr className="border-b border-slate-200/80 bg-white transition hover:bg-slate-50">
      <td className="px-4 py-4">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">No</div>
        )}
      </td>
      <td className="px-4 py-4 font-medium text-slate-900">{product.name}</td>
      <td className="px-4 py-4 text-slate-600">{product.category}</td>
      <td className="px-4 py-4 text-slate-900">${product.price}</td>
      <td className="px-4 py-4 text-slate-600">{product.stock}</td>
      <td className="px-4 py-4">
        <button
          onClick={() => onDelete(product._id)}
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function Products() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [images, setImages] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((res) => res.data.products),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
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
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => formData.append('images', img));
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Products</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:bg-sky-700"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
          <h2 className="text-xl font-semibold text-slate-950">New product</h2>
          <p className="mt-1 text-sm text-slate-500">Add product details and upload images.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {['name', 'category', 'price', 'stock'].map((field) => (
                <div key={field}>
                  <label className="mb-2 block text-sm font-medium text-slate-700 capitalize">{field}</label>
                  <input
                    value={form[field]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-sm file:font-semibold"
              />
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((img, index) => (
                    <img key={index} src={URL.createObjectURL(img)} alt="preview" className="h-16 w-16 rounded-3xl object-cover" />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/30 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {createMutation.isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-2 border-b border-slate-200/80 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Product list</h2>
            <p className="text-sm text-slate-500">Manage items and inventory from one dashboard.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{data?.length ?? 0} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500">
                <th className="px-4 py-4">Image</th>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : data?.length ? (
                data.map((product) => (
                  <ProductCard key={product._id} product={product} onDelete={(id) => deleteMutation.mutate(id)} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}