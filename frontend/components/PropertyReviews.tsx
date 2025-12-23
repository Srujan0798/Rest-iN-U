'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, User } from 'lucide-react';

interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    content: string;
    helpful: number;
    avatar?: string;
}

const mockReviews: Review[] = [
    {
        id: '1', author: 'Sarah Jenkins', rating: 5, date: '2 weeks ago',
        content: 'Absolutely stunning property! The Vastu alignment feels perfect, and the natural light is incredible. Highly recommend for anyone looking for a peaceful home.',
        helpful: 12
    },
    {
        id: '2', author: 'Michael Chen', rating: 4, date: '1 month ago',
        content: 'Great location and amenities. The only downside is the street parking can be a bit tight, but the garage is spacious.',
        helpful: 8
    },
    {
        id: '3', author: 'Priya Patel', rating: 5, date: '2 months ago',
        content: 'We loved the meditation room and the garden. It truly feels like a sanctuary in the city.',
        helpful: 15
    }
];

export default function PropertyReviews() {
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview || rating === 0) return;

        const review: Review = {
            id: Date.now().toString(),
            author: 'You',
            rating,
            date: 'Just now',
            content: newReview,
            helpful: 0
        };

        setReviews([review, ...reviews]);
        setNewReview('');
        setRating(0);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500 fill-current" />
                Property Reviews ({reviews.length})
            </h2>

            {/* Write Review */}
            <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`transition ${rating >= star ? 'text-amber-500' : 'text-gray-300'}`}
                        >
                            <Star className="w-6 h-6 fill-current" />
                        </button>
                    ))}
                </div>
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience with this property..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    rows={3}
                />
                <button
                    type="submit"
                    disabled={!newReview || rating === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    Post Review
                </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {review.author[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="flex text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span>•</span>
                                        <span>{review.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-3 ml-13 pl-13">{review.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-blue-600 transition">
                                <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful})
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-600 transition">
                                <MessageSquare className="w-4 h-4" /> Reply
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
