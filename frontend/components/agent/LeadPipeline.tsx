'use client';
import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Phone, Mail } from 'lucide-react';

const columns = [
    { id: 'NEW', label: 'New Leads', color: 'bg-blue-500' },
    { id: 'CONTACTED', label: 'Contacted', color: 'bg-orange-500' },
    { id: 'SHOWING_SCHEDULED', label: 'Showing Scheduled', color: 'bg-purple-500' },
    { id: 'OFFER_MADE', label: 'Offer Made', color: 'bg-green-500' },
];

const mockLeads = [
    { id: '1', name: 'John Smith', email: 'john@email.com', phone: '555-0101', status: 'NEW', property: '123 Main St', message: 'Interested in scheduling a viewing', date: '2 hours ago' },
    { id: '2', name: 'Emily Davis', email: 'emily@email.com', phone: '555-0102', status: 'NEW', property: '456 Park Ave', message: 'Looking for 3BR under 500K', date: '5 hours ago' },
    { id: '3', name: 'Mike Johnson', email: 'mike@email.com', phone: '555-0103', status: 'CONTACTED', property: '789 Broadway', message: 'First time buyer', date: '1 day ago' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@email.com', phone: '555-0104', status: 'SHOWING_SCHEDULED', property: '321 Oak Lane', message: 'Relocating from Boston', date: '2 days ago' },
    { id: '5', name: 'David Brown', email: 'david@email.com', phone: '555-0105', status: 'OFFER_MADE', property: '555 Elm St', message: 'Ready to make an offer', date: '3 days ago' },
];

export default function LeadPipeline() {
    const [leads, setLeads] = useState(mockLeads);
    const [menuOpen, setMenuOpen] = useState<{ leadId: string | null; position: { x: number; y: number } | null }>({ leadId: null, position: null });
    const menuRef = useRef<HTMLDivElement>(null);

    const handleStatusChange = (leadId: string, newStatus: string) => {
        setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        setMenuOpen({ leadId: null, position: null });
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen({ leadId: null, position: null });
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col) => (
                <div key={col.id} className="min-w-[300px] flex-1 bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                        <div className={`w-2 h-2 rounded-full ${col.color} mr-2`}></div>
                        <span className="font-semibold text-gray-900">{col.label}</span>
                        <span className="ml-auto px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                            {leads.filter(l => l.status === col.id).length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {leads.filter(l => l.status === col.id).map((lead) => (
                            <div key={lead.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                                <div className="flex items-center mb-2">
                                    <div className={`w-9 h-9 rounded-full ${col.color} text-white flex items-center justify-center text-sm font-medium mr-2`}>
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-gray-900">{lead.name}</p>
                                        <p className="text-xs text-gray-500">{lead.date}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setMenuOpen({ leadId: lead.id, position: { x: rect.right, y: rect.bottom } });
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 mb-1">🏠 {lead.property}</p>
                                <p className="text-sm text-gray-700 truncate mb-2">{lead.message}</p>

                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700 hover:bg-gray-200">
                                        <Phone className="w-3 h-3" /> Call
                                    </button>
                                    <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700 hover:bg-gray-200">
                                        <Mail className="w-3 h-3" /> Email
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Dropdown Menu */}
            {menuOpen.leadId && menuOpen.position && (
                <div
                    ref={menuRef}
                    className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    style={{ top: menuOpen.position.y, left: menuOpen.position.x - 150 }}
                >
                    <p className="px-4 py-1 text-xs text-gray-500">Move to:</p>
                    {columns.map((col) => (
                        <button
                            key={col.id}
                            onClick={() => handleStatusChange(menuOpen.leadId!, col.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {col.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

