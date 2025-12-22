'use client';
import ChatWindow from '@/components/ChatWindow';

export default function MessagesPage() {
    // In production, get current user from auth context
    const currentUserId = 'current-user-id';

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                <p className="text-gray-600 mb-6">
                    Stay connected with agents and buyers
                </p>
                <ChatWindow currentUserId={currentUserId} />
            </div>
        </div>
    );
}
