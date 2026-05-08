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
        if (!cancelled) setPoi(detail);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load POI');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPoi();

    return () => { cancelled = true; };
  }, [params?.id]);

  const translation = poi?.translations?.[0] || {};
  const title = translation.name || 'POI Detail';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navigation */}
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

      <div className="mx-auto max-w-5xl px-6 pb-20 overflow-y-auto h-[calc(100vh-100px)]">
        {loading ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Đang tải thông tin...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="max-w-md rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <p className="text-xl font-semibold">Không tải được thông tin</p>
              <p className="mt-3 text-zinc-400">{error}</p>
              <button
                onClick={() => router.push('/tour?view=map')}
                className="mt-6 w-full rounded-2xl bg-white py-3 text-black font-semibold hover:bg-zinc-200"
              >
                Về trang Tour
              </button>
            </div>
          </div>
        ) : poi ? (
          <>
            {/* Hero Section */}
            <div className="relative h-[520px] rounded-3xl overflow-hidden mb-10 shadow-2xl">
              {translation.imageUrl ? (
                <img
                  src={translation.imageUrl}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
                  <MapPin className="h-24 w-24 text-zinc-700" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-4 py-1.5 bg-orange-500/90 text-white text-xs font-bold tracking-widest rounded-full">
                    VINH KHANH FOOD TOUR
                  </div>
                </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {poi.rating && (
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{poi.rating}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                    <MapPin className="h-5 w-5" />
                    <span>{poi.lat.toFixed(5)}, {poi.lng.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8">
              {/* Main Content */}
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Volume2 className="h-6 w-6 text-orange-400" />
                    <h2 className="text-xl font-semibold tracking-wide">Mô tả</h2>
                  </div>
                  <p className="text-lg leading-relaxed text-zinc-300">
                    {translation.description || 'Chưa có mô tả chi tiết.'}
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8">
                    <h3 className="text-sm uppercase tracking-[2px] text-zinc-500 mb-6">Thông tin chi tiết</h3>

                    <div className="space-y-6">
                      {/* Specialties */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                            <UtensilsCrossed className="h-5 w-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500">Đặc sản</p>
                            <p className="font-medium text-zinc-100 mt-0.5">
                              {translation.specialties || 'Đang cập nhật'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                            <Tag className="h-5 w-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500">Mức giá</p>
                            <p className="font-medium text-zinc-100 mt-0.5">
                              {translation.priceRange || 'Đang cập nhật'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => router.push('/tour?view=map')}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl font-semibold text-lg hover:brightness-110 transition-all active:scale-[0.985]"
                  >
                    Mở trên Bản đồ Tour
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}