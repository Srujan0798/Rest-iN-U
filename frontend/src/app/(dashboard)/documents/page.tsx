'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Document {
  id: string;
  name: string;
  type: 'CONTRACT' | 'DEED' | 'INSPECTION' | 'VASTU' | 'DISCLOSURE' | 'FINANCIAL' | 'ID' | 'OTHER';
  status: 'PENDING_SIGNATURE' | 'SIGNED' | 'UPLOADED' | 'REJECTED' | 'EXPIRED';
  fileType: 'pdf' | 'docx' | 'jpg' | 'png';
  fileSize: string;
  uploadedAt: string;
  expiresAt?: string;
  propertyId?: string;
  propertyTitle?: string;
  signedBy?: string[];
  pendingSignatures?: string[];
  url: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Purchase Agreement - 4BHK Villa Koramangala',
    type: 'CONTRACT',
    status: 'PENDING_SIGNATURE',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadedAt: '2024-12-18T10:00:00',
    expiresAt: '2024-12-25T23:59:00',
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    signedBy: ['Seller - Vikram Mehta'],
    pendingSignatures: ['Buyer - You', 'Agent - Priya Sharma'],
    url: '/documents/purchase-agreement.pdf'
  },
  {
    id: '2',
    name: 'Vastu Compliance Certificate',
    type: 'VASTU',
    status: 'UPLOADED',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    uploadedAt: '2024-12-17T14:00:00',
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    url: '/documents/vastu-certificate.pdf'
  },
  {
    id: '3',
    name: 'Home Inspection Report',
    type: 'INSPECTION',
    status: 'UPLOADED',
    fileType: 'pdf',
    fileSize: '5.8 MB',
    uploadedAt: '2024-12-16T09:00:00',
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    url: '/documents/inspection-report.pdf'
  },
  {
    id: '4',
    name: 'Property Deed',
    type: 'DEED',
    status: 'SIGNED',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    uploadedAt: '2024-12-10T11:00:00',
    propertyId: 'prop2',
    propertyTitle: 'Modern 3BHK Apartment',
    signedBy: ['Seller - Anita Reddy', 'Buyer - You', 'Agent - Rahul Verma'],
    url: '/documents/property-deed.pdf'
  },
  {
    id: '5',
    name: 'Seller Disclosure Statement',
    type: 'DISCLOSURE',
    status: 'UPLOADED',
    fileType: 'pdf',
    fileSize: '890 KB',
    uploadedAt: '2024-12-15T16:00:00',
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    url: '/documents/disclosure.pdf'
  },
  {
    id: '6',
    name: 'Loan Pre-Approval Letter',
    type: 'FINANCIAL',
    status: 'UPLOADED',
    fileType: 'pdf',
    fileSize: '450 KB',
    uploadedAt: '2024-12-12T10:00:00',
    expiresAt: '2025-01-12T23:59:00',
    url: '/documents/preapproval.pdf'
  },
  {
    id: '7',
    name: 'Aadhaar Card',
    type: 'ID',
    status: 'UPLOADED',
    fileType: 'jpg',
    fileSize: '1.5 MB',
    uploadedAt: '2024-12-01T10:00:00',
    url: '/documents/aadhaar.jpg'
  },
  {
    id: '8',
    name: 'Title Search Report',
    type: 'OTHER',
    status: 'PENDING_SIGNATURE',
    fileType: 'pdf',
    fileSize: '2.0 MB',
    uploadedAt: '2024-12-19T08:00:00',
    expiresAt: '2024-12-26T23:59:00',
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    pendingSignatures: ['Buyer - You'],
    url: '/documents/title-search.pdf'
  }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Document['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Document['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 500);
  }, []);

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'CONTRACT':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'DEED':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'INSPECTION':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'VASTU':
        return (
          <span className="text-orange-500 font-bold">ðŸ•‰ï¸</span>
        );
      case 'DISCLOSURE':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'FINANCIAL':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ID':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'CONTRACT': return 'bg-purple-100 text-purple-700';
      case 'DEED': return 'bg-blue-100 text-blue-700';
      case 'INSPECTION': return 'bg-teal-100 text-teal-700';
      case 'VASTU': return 'bg-orange-100 text-orange-700';
      case 'DISCLOSURE': return 'bg-yellow-100 text-yellow-700';
      case 'FINANCIAL': return 'bg-green-100 text-green-700';
      case 'ID': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'PENDING_SIGNATURE': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'SIGNED': return 'bg-green-100 text-green-700 border-green-300';
      case 'UPLOADED': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-300';
      case 'EXPIRED': return 'bg-gray-100 text-gray-500 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getFileIcon = (fileType: Document['fileType']) => {
    switch (fileType) {
      case 'pdf':
        return <span className="text-red-500 font-bold text-xs">PDF</span>;
      case 'docx':
        return <span className="text-blue-500 font-bold text-xs">DOC</span>;
      case 'jpg':
      case 'png':
        return <span className="text-green-500 font-bold text-xs">IMG</span>;
      default:
        return <span className="text-gray-500 font-bold text-xs">FILE</span>;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const typeMatch = filter === 'all' || doc.type === filter;
    const statusMatch = statusFilter === 'all' || doc.status === statusFilter;
    const searchMatch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  const stats = {
    total: documents.length,
    pendingSignature: documents.filter(d => d.status === 'PENDING_SIGNATURE').length,
    signed: documents.filter(d => d.status === 'SIGNED').length,
    uploaded: documents.filter(d => d.status === 'UPLOADED').length
  };

  const documentTypes: Array<{ value: Document['type'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: 'CONTRACT', label: 'Contracts' },
    { value: 'DEED', label: 'Deeds' },
    { value: 'INSPECTION', label: 'Inspections' },
    { value: 'VASTU', label: 'Vastu' },
    { value: 'DISCLOSURE', label: 'Disclosures' },
    { value: 'FINANCIAL', label: 'Financial' },
    { value: 'ID', label: 'ID Documents' },
    { value: 'OTHER', label: 'Other' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage your property documents and signatures</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Document
        </button>
      </div>

      {/* Alert for Pending Signatures */}
      {stats.pendingSignature > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">Action Required</h3>
            <p className="text-yellow-700 text-sm">You have {stats.pendingSignature} document{stats.pendingSignature !== 1 ? 's' : ''} awaiting your signature.</p>
          </div>
          <button
            onClick={() => setStatusFilter('PENDING_SIGNATURE')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors text-sm"
          >
            Review Now
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-gray-600">Total Documents</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-yellow-600">{stats.pendingSignature}</div>
          <div className="text-gray-600">Pending Signature</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-green-600">{stats.signed}</div>
          <div className="text-gray-600">Signed</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-blue-600">{stats.uploaded}</div>
          <div className="text-gray-600">Uploaded</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_SIGNATURE">Pending Signature</option>
            <option value="SIGNED">Signed</option>
            <option value="UPLOADED">Uploaded</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredDocuments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl border border-gray-200"
            >
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">Upload your first document to get started.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium"
              >
                Upload Document
              </button>
            </motion.div>
          ) : (
            filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(doc.type)}`}>
                    {getTypeIcon(doc.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            {getFileIcon(doc.fileType)}
                            <span>{doc.fileSize}</span>
                          </span>
                          <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                        </div>
                        {doc.propertyTitle && (
                          <Link
                            href={`/property/${doc.propertyId}`}
                            className="text-sm text-orange-600 hover:underline mt-1 inline-block"
                          >
                            {doc.propertyTitle}
                          </Link>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Signature Info */}
                    {doc.status === 'PENDING_SIGNATURE' && doc.pendingSignatures && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="text-sm text-yellow-800">
                          <span className="font-medium">Waiting for:</span> {doc.pendingSignatures.join(', ')}
                        </div>
                        {doc.expiresAt && (
                          <div className={`text-xs mt-1 ${getDaysRemaining(doc.expiresAt) <= 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                            Expires in {getDaysRemaining(doc.expiresAt)} day{getDaysRemaining(doc.expiresAt) !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}

                    {doc.status === 'SIGNED' && doc.signedBy && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Signed by: {doc.signedBy.join(', ')}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      <button className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Download
                      </button>
                      {doc.status === 'PENDING_SIGNATURE' && doc.pendingSignatures?.includes('Buyer - You') && (
                        <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-colors">
                          Sign Now
                        </button>
                      )}
                      <button className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors ml-auto">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Document</h2>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-gray-400 text-sm">Supports PDF, DOCX, JPG, PNG (Max 25MB)</p>
              </div>

              {/* Document Type */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  {documentTypes.filter(t => t.value !== 'all').map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Property (Optional) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Property (Optional)</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">No property</option>
                  <option value="prop1">Luxurious 4BHK Villa with Vastu</option>
                  <option value="prop2">Modern 3BHK Apartment</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors">
                  Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
