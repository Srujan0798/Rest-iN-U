'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Phone, Mail, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    propertyInterest: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Closed' | 'Lost';
    date: string;
    notes: string;
}

const mockLeads: Lead[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0123', propertyInterest: 'Vastu Villa', status: 'New', date: '2 hours ago', notes: 'Interested in Vastu compliance' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0124', propertyInterest: 'Sunset Condo', status: 'Contacted', date: '1 day ago', notes: 'Scheduled viewing for Friday' },
    { id: '3', name: 'Robert Johnson', email: 'rob@example.com', phone: '555-0125', propertyInterest: 'Eco Estate', status: 'Qualified', date: '3 days ago', notes: 'Pre-approved for mortgage' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', phone: '555-0126', propertyInterest: 'Lake House', status: 'Closed', date: '1 week ago', notes: 'Offer accepted' },
];

const columns = ['New', 'Contacted', 'Qualified', 'Closed'];

export default function LeadManagement() {
    const [leads, setLeads] = useState<Lead[]>(mockLeads);
    const [draggedLead, setDraggedLead] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedLead(id);
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: Lead['status']) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        if (id) {
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        }
        setDraggedLead(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Qualified': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Closed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 p-6 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Lead Management</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Filter</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Lead</button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 min-w-[1000px] h-full">
                    {columns.map(column => (
                        <div
                            key={column}
                            className="flex-1 flex flex-col bg-gray-100/50 rounded-xl p-4 border border-gray-200"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column as Lead['status'])}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-700">{column}</h3>
                                <span className="px-2 py-0.5 bg-white text-gray-500 rounded-full text-xs font-medium shadow-sm">
                                    {leads.filter(l => l.status === column).length}
                                </span>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                                {leads.filter(l => l.status === column).map(lead => (
                                    <div
                                        key={lead.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead.id)}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-move hover:shadow-md transition group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                {lead.propertyInterest}
                                            </span>
                                            <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{lead.name}</h4>
                                        <div className="flex flex-col gap-1 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" /> {lead.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" /> {lead.phone}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {lead.date}
                                            </div>
                                            {lead.status === 'New' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
