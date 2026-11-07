import React from 'react';
import type { Metadata } from 'next';
import DiscoverClient from './DiscoverClient';

export const metadata: Metadata = {
  title: 'Scholarship Directory & Smart Filter | GRANTLY',
  description:
    'Search, filter, and discover eligible national, state, and corporate scholarships with deterministic eligibility matching.',
};

export default async function DiscoverPage(props: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const searchParams = await props?.searchParams;
  const initialSearch = searchParams?.search || '';
  return <DiscoverClient initialSearch={initialSearch} />;
}
