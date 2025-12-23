'use client';

import React, { useState } from 'react';
import { Search, MoreVertical, Shield, User, Briefcase, Trash2, Edit2, Check, X } from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'AGENT' | 'USER';
    status: 'ACTIVE' | 'SUSPENDED';
    joinDate: string;
}

const mockUsers: UserData[] = [
    { id: '1', name: 'Admin User', email: 'admin@restinu.com', role: 'ADMIN', status: 'ACTIVE', joinDate: '2024-01-01' },
    { id: '2', name: 'Sarah Agent', email: 'sarah@restinu.com', role: 'AGENT', status: 'ACTIVE', joinDate: '2024-02-15' },
    { id: '3', name: 'John Buyer', email: 'john@gmail.com', role: 'USER', status: 'ACTIVE', joinDate: '2024-03-10' },
    { id: '4', name: 'Mike Spammer', email: 'mike@spam.com', role: 'USER', status: 'SUSPENDED', joinDate: '2024-03-12' },
];

/**
 * UserManagement Component
 * Admin-only interface for managing platform users, roles, and account status.
 */
export default function UserManagement() {
    const [users, setUsers] = useState<UserData[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<UserData>>({});

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (user: UserData) => {
        setEditingId(user.id);
        setEditForm({ role: user.role, status: user.status });
    };

    const handleSave = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...editForm } : u));
        setEditingId(null);
        setEditForm({});
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"><Shield className="w-3 h-3" /> Admin</span>;
            case 'AGENT': return <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"><Briefcase className="w-3 h-3" /> Agent</span>;
            default: return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"><User className="w-3 h-3" /> User</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Joined</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-gray-500 text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === user.id ? (
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                                            className="border rounded px-2 py-1 text-xs"
                                        >
                                            <option value="USER">User</option>
                                            <option value="AGENT">Agent</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    ) : (
                                        getRoleBadge(user.role)
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === user.id ? (
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                            className="border rounded px-2 py-1 text-xs"
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="SUSPENDED">Suspended</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{user.joinDate}</td>
                                <td className="px-6 py-4 text-right">
                                    {editingId === user.id ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleSave(user.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                                            <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEditClick(user)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(user.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
