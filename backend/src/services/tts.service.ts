import googleTTS from 'google-tts-api';

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

  // google-tts-api v0.0.6 giới hạn text < 200 chars cho 1 request.
  const MAX_CHARS = 200;
  const chunks: string[] = [];

  const words = trimmed.replace(/\s+/g, ' ').split(' ').filter(Boolean);
  let current = '';

  for (const word of words) {
    // Nếu 1 "word" quá dài, tách thẳng theo độ dài.
    if (word.length > MAX_CHARS) {
      if (current) {
        chunks.push(current);
        current = '';
      }
      for (let i = 0; i < word.length; i += MAX_CHARS) {
        chunks.push(word.slice(i, i + MAX_CHARS));
      }
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= MAX_CHARS) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = word;
    }
  }
  if (current) chunks.push(current);

  const buffers = await Promise.all(
    chunks.map(async (chunk) => {
      const url = await googleTTS(chunk, googleLang, 1 /* speed */);
      return fetchAudioBuffer(url);
    })
  );

  return Buffer.concat(buffers);
};
