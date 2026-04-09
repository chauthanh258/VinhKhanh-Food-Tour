'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, UtensilsCrossed, Tag, Volume2, Loader2, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

interface PoiTranslation {
  name?: string;
  description?: string;
  specialties?: string;
  priceRange?: string;
  imageUrl?: string;
}

interface PoiDetail {
  id: string;
  lat: number;
  lng: number;
  rating?: number;
  translations?: PoiTranslation[];
}

export default function PoiDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [poi, setPoi] = useState<PoiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const poiId = params?.id;
    if (!poiId) {
      setError('POI id is missing');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadPoi = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/pois/${poiId}`);
        const detail = response?.data ?? response;
        if (!cancelled) {
          setPoi(detail);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load POI');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPoi();

    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  const translation = poi?.translations?.[0] || {};
  const title = translation.name || 'POI detail';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={() => router.push('/tour?view=map')}
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <ExternalLink className="h-4 w-4" />
            Open tour
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-3 text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading POI...
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center">
              <p className="text-lg font-semibold text-white">Could not load POI</p>
              <p className="mt-2 text-sm text-zinc-300">{error}</p>
              <button
                onClick={() => router.push('/tour?view=map')}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                Go to tour
              </button>
            </div>
          </div>
        ) : poi ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl">
              <div className="relative h-72 w-full bg-zinc-900">
                {translation.imageUrl ? (
                  <img src={translation.imageUrl} alt={title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-500">
                    <MapPin className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Vinh Khanh Food Tour</p>
                  <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h1>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-sm text-yellow-300">
                    <Star className="h-4 w-4 fill-yellow-300" />
                    {poi.rating ?? 0}
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm text-orange-300">
                    <MapPin className="h-4 w-4" />
                    {poi.lat.toFixed(6)}, {poi.lng.toFixed(6)}
                  </div>
                </div>

                <div className="space-y-3 text-zinc-300">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                    <Volume2 className="h-4 w-4 text-orange-400" />
                    Description
                  </h2>
                  <p className="text-sm leading-7 text-zinc-300">{translation.description || 'No description available.'}</p>
                </div>
              </div>
            </div>

            <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">POI Info</p>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-zinc-400">
                    <UtensilsCrossed className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em]">Specialties</span>
                  </div>
                  <p className="text-sm text-zinc-200">{translation.specialties || 'Not specified'}</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-zinc-400">
                    <Tag className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em]">Price</span>
                  </div>
                  <p className="text-sm text-zinc-200">{translation.priceRange || 'Not specified'}</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/tour?view=map')}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Open in tour map
              </button>
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}