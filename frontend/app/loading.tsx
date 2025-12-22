export default function Loading() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-2 flex items-center justify-center text-2xl">
                        🪷
                    </div>
                </div>
                <p className="text-gray-500">Loading your dharma...</p>
            </div>
        </div>
    );
}
