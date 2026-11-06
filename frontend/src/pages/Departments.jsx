import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import api from '../api/client.js';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { Spinner, ErrorState, EmptyState } from '../components/States.jsx';
import { toast } from '../components/Toast.jsx';

const emptyForm = { name: '', code: '', description: '' };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      const res = await api.get('/departments', { params });
      setDepartments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(loadDepartments, 300);
    return () => clearTimeout(t);
  }, [loadDepartments]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(dept) {
    setEditing(dept);
    setForm({ name: dept.name, code: dept.code, description: dept.description || '' });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/departments/${editing._id}`, form);
        setDepartments((prev) => prev.map((d) => (d._id === editing._id ? res.data : d)));
        toast('Department updated successfully');
      } else {
        const res = await api.post('/departments', form);
        setDepartments((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
        toast('Department added successfully');
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/departments/${deleteId}`);
      setDepartments((prev) => prev.filter((d) => d._id !== deleteId));
      toast('Department removed');
      setDeleteId(null);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete department', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="mt-1 text-sm text-slate-500">Manage academic departments</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Department
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or code..."
            className="input pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="card">
          <Spinner label="Loading departments..." />
        </div>
      ) : error ? (
        <div className="card">
          <ErrorState message={error} />
        </div>
      ) : departments.length === 0 ? (
        <div className="card">
          <EmptyState message={search ? 'No departments match your search' : 'No departments yet. Add your first department.'} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <div key={d._id} className="card group p-6 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(d)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(d._id)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{d.name}</h3>
              <p className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {d.code}
              </p>
              {d.description && (
                <p className="mt-3 text-sm text-slate-500">{d.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Department' : 'Add Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
          )}
          <div>
            <label className="label">Department Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input"
              placeholder="e.g. Computer Science"
            />
          </div>
          <div>
            <label className="label">Department Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
              className="input"
              placeholder="e.g. CSE"
            />
          </div>
          <div>
            <label className="label">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input resize-none"
              placeholder="Brief description of the department"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Department' : 'Add Department'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? You cannot delete a department that has students or staff assigned to it."
        loading={deleting}
      />
    </div>
  );
}
