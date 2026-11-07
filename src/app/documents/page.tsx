'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  ShieldCheck,
  Check,
  Search,
  Filter,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

export default function DocumentsPage() {
  const { documents, toggleDocumentReady, stats, scholarships } = useGrantly();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchDoc, setSearchDoc] = useState('');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const categories = ['Identity', 'Academic', 'Financial', 'Institutional'];

  const filteredDocs = documents.filter((doc) => {
    if (filterCategory !== 'all' && doc.category !== filterCategory) return false;
    if (searchDoc.trim() && !doc.title.toLowerCase().includes(searchDoc.toLowerCase())) {
      return false;
    }
    return true;
  });

  const readinessPercent = Math.round((stats.documentsReadyCount / stats.documentsTotalCount) * 100);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Document Readiness Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-2xl">
              Track the preparedness of your verified credentials. Ensure zero last-minute rejection caused by missing or expired certificates.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#E7E9F0] shadow-card">
            <span className="text-xs font-semibold text-[#667085]">Readiness:</span>
            <span className="text-sm font-extrabold text-[#5145CD] tabular-nums">
              {stats.documentsReadyCount} of {stats.documentsTotalCount} Ready
            </span>
          </div>
        </div>

        {/* Readiness Meter Card */}
        <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-[#17213A]">Overall Portfolio Readiness</span>
            <span className="font-extrabold text-[#5145CD] tabular-nums">{readinessPercent}%</span>
          </div>
          <div className="w-full bg-[#F7F8FC] h-3 rounded-full overflow-hidden border border-[#E7E9F0]">
            <div
              className="bg-gradient-to-r from-[#5145CD] to-[#16A779] h-full rounded-full transition-all duration-500"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <p className="text-xs text-[#667085]">
            Having your documents prepared in advance allows instantaneous one-click submission on official government & corporate portals.
          </p>
        </div>

        {/* Safe Demo Notice */}
        <div className="bg-[#EDEBFF]/50 border border-[#7868F6]/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#17213A]">
          <ShieldCheck className="w-5 h-5 text-[#5145CD] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Privacy & Simulation Notice</p>
            <p className="text-[#667085] leading-relaxed">
              GRANTLY does not transmit or store actual government documents or confidential biometric PII. This checklist tracks document readiness status and file names locally on your device.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <label htmlFor="search-documents" className="sr-only">
              Search checklist documents
            </label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
            <input
              id="search-documents"
              type="text"
              placeholder="Search checklist documents..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E7E9F0] rounded-xl text-[#17213A] placeholder-[#667085] focus:border-[#5145CD]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === 'all'
                  ? 'bg-[#5145CD] text-white shadow-sm'
                  : 'bg-white text-[#667085] border border-[#E7E9F0] hover:text-[#17213A]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-[#5145CD] text-white shadow-sm'
                    : 'bg-white text-[#667085] border border-[#E7E9F0] hover:text-[#17213A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const isReady = doc.status === 'ready';
            const isExpanded = expandedDocId === doc.id;

            // Match actual scholarships requiring this document
            const matchingScholarships = scholarships.filter((s) =>
              s.requiredDocuments.some((reqDoc) => {
                const rLower = reqDoc.toLowerCase();
                const dLower = doc.title.toLowerCase();
                return rLower.includes(dLower) || dLower.includes(rLower);
              })
            );

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-[#E7E9F0] hover:border-[#7868F6]/40 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F8FC] text-[#667085] border border-[#E7E9F0]">
                      {doc.category}
                    </span>

                    <button
                      onClick={() => toggleDocumentReady(doc.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                        isReady
                          ? 'bg-emerald-50 text-[#16A779] border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/60'
                      }`}
                      aria-label={`Toggle readiness status for ${doc.title}`}
                    >
                      {isReady ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>{isReady ? 'Ready' : 'Pending'}</span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#17213A]">{doc.title}</h3>

                  {isReady && doc.fileName ? (
                    <p className="text-xs text-[#667085] flex items-center gap-1.5 bg-[#F7F8FC] p-2 rounded-lg border border-[#E7E9F0]">
                      <FileText className="w-3.5 h-3.5 text-[#5145CD]" />
                      <span className="truncate font-mono text-[11px]">{doc.fileName}</span>
                      <span className="text-[10px] text-gray-400">({doc.fileSize})</span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-800 bg-amber-50/60 p-2 rounded-lg border border-amber-100 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{doc.lastUpdated}</span>
                    </p>
                  )}
                </div>

                {/* Footer: Required For Count & Expandable Association */}
                <div className="pt-3 border-t border-[#E7E9F0] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                      className="inline-flex items-center gap-1.5 text-[#667085] hover:text-[#5145CD] font-medium text-left"
                      aria-expanded={isExpanded}
                    >
                      <span>
                        Required by <strong className="text-[#17213A]">{matchingScholarships.length || doc.requiredForCount}</strong> scholarships
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-[#5145CD]" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-[#5145CD]" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleDocumentReady(doc.id)}
                      className="text-xs font-bold text-[#5145CD] hover:underline"
                    >
                      {isReady ? 'Mark as Pending' : 'Simulate Ready'}
                    </button>
                  </div>

                  {/* Expanded Associated Scholarships List */}
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-dashed border-[#E7E9F0] space-y-2 animate-in fade-in duration-150">
                      <p className="text-[11px] font-bold text-[#17213A] uppercase tracking-wider">
                        Mandatory For Opportunities:
                      </p>
                      {matchingScholarships.length > 0 ? (
                        <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {matchingScholarships.map((s) => (
                            <li
                              key={s.id}
                              className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F7F8FC] hover:bg-[#EDEBFF]/60 transition-colors text-xs"
                            >
                              <Link
                                href={`/scholarships/${s.id}`}
                                className="font-semibold text-[#17213A] hover:text-[#5145CD] truncate flex-1"
                              >
                                {s.name}
                              </Link>
                              <span className="text-[11px] font-bold text-[#5145CD] whitespace-nowrap">
                                ₹{s.awardAmount.toLocaleString('en-IN')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-[#667085] italic">
                          Required for general state and central scholarship portals.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
