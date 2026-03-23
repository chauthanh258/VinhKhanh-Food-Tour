import { getAllAudioUrls } from 'google-tts-api';

const fetchAudioBuffer = async (url: string): Promise<Buffer> => {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) {
    throw new Error(`TTS upstream failed: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
};

/** Concatenate MP3 segments from Google TTS (long text is split into chunks). */
export const synthesizeTextToMp3Buffer = async (text: string, googleLang: string): Promise<Buffer> => {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Empty text');
  }
  const parts = getAllAudioUrls(trimmed, { lang: googleLang, slow: false });
  const buffers = await Promise.all(parts.map((p) => fetchAudioBuffer(p.url)));
  return Buffer.concat(buffers);
};
