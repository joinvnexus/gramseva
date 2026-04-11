'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';

interface User {
  id: string;
  name: string;
  phone: string;
  village: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`ইউজারের রোল পরিবর্তন করতে চান?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await response.json();
      if (data.success) {
        alert('রোল পরিবর্তন সফল!');
        fetchUsers();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('রোল পরিবর্তন করতে সমস্যা হয়েছে');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('ইউজার ডিলিট করতে চান? এই কাজ অপরিবর্তনীয়!')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        alert('ইউজার ডিলিট সফল!');
        fetchUsers();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('ইউজার ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.phone.includes(searchTerm);
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">ইউজার ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-1">সকল ইউজার দেখুন ও পরিচালনা করুন</p>
        </div>
        <div className="text-sm text-gray-500">
          মোট ইউজার: {users.length}
        </div>
      </div>

      {/* ফিল্টার ও সার্চ */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">সব রোল</option>
              <option value="USER">ইউজার</option>
              <option value="PROVIDER">প্রোভাইডার</option>
              <option value="ADMIN">অ্যাডমিন</option>
            </select>
          </div>
        </div>
      </div>

      {/* ইউজার লিস্ট */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ফোন</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">গ্রাম</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">রোল</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.village}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'PROVIDER' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="USER">ইউজার</option>
                    <option value="PROVIDER">প্রোভাইডার</option>
                    <option value="ADMIN">অ্যাডমিন</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.verified ? (
                    <span className="text-green-600">✓ ভেরিফাইড</span>
                  ) : (
                    <span className="text-yellow-600">⏳ পেন্ডিং</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={u.id === user?.id}
                  >
                    🗑️ ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            কোনো ইউজার পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}