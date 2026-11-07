import { Metadata } from 'next';
import { DEMO_SCHOLARSHIPS } from '@/data/scholarships';
import { ScholarshipDetailClient } from './ScholarshipDetailClient';

export function generateStaticParams() {
  return DEMO_SCHOLARSHIPS.map((s) => ({
    id: s.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const scholarship = DEMO_SCHOLARSHIPS.find((s) => s.id === resolvedParams.id);
  if (!scholarship) {
    return {
      title: 'Scholarship Not Found — GRANTLY',
    };
  }
  return {
    title: `${scholarship.name} — GRANTLY`,
    description: scholarship.description,
  };
}

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  return <ScholarshipDetailClient id={resolvedParams.id} />;
}
