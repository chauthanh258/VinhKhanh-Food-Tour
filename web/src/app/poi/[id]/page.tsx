import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PoiRedirectPage({ params }: Props) {
  const { id } = await params;
  
  // Redirect to the tour page with the poiId as a search parameter
  // This allows the TourPage to handle highighting and audio triggering
  redirect(`/tour?poiId=${id}`);
}
