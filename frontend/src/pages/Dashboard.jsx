import { useEffect, useState } from 'react';
import {
  GraduationCap,
  Users,
  Building2,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { Spinner, ErrorState } from '../components/States.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  const cards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: GraduationCap,
      to: '/students',
      color: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Total Staff',
      value: stats.totalStaff,
      icon: Users,
      to: '/staff',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Departments',
      value: stats.totalDepartments,
      icon: Building2,
      to: '/departments',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your institute at a glance</p>
      </div>

    
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="card group flex items-center justify-between p-6 transition hover:shadow-md"
          >
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </Link>
        ))}
      </div>

    
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Students</h2>
            <Link
              to="/students"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {stats.recentRegistrations.students.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No students yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentRegistrations.students.map((s) => (
                <div key={s._id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{s.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {s.rollNumber} · {s.department?.name || 'N/A'}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {s.year}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Staff</h2>
            <Link
              to="/staff"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {stats.recentRegistrations.staff.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No staff yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentRegistrations.staff.map((s) => (
                <div key={s._id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{s.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {s.employeeId} · {s.designation}
                    </p>
                  </div>
                  <UserPlus className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
