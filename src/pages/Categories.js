import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Categories() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data.categories),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created');
      setShowForm(false);
      setName('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ name });
  };

  if (isLoading) return <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-slate-500 shadow-xl shadow-slate-200/30">Loading categories...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Catalogue</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Categories</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:bg-sky-700"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
          <h2 className="text-xl font-semibold text-slate-950">New category</h2>
          <p className="mt-1 text-sm text-slate-500">Create a category to organize your store.</p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
              className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/30 transition hover:bg-emerald-700"
            >
              Save
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data?.map((category) => (
          <div key={category._id} className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-slate-950">{category.name}</span>
              <button
                onClick={() => deleteMutation.mutate(category._id)}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}