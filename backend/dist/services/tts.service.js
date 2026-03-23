"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeTextToMp3Buffer = void 0;
const google_tts_api_1 = require("google-tts-api");
const fetchAudioBuffer = async (url) => {
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
    });
    if (!res.ok) {
        throw new Error(`TTS upstream failed: ${res.status}`);
    }
    return Buffer.from(await res.arrayBuffer());
};
/** Concatenate MP3 segments from Google TTS (long text is split into chunks). */
const synthesizeTextToMp3Buffer = async (text, googleLang) => {
    const trimmed = text.trim();
    if (!trimmed) {
        throw new Error('Empty text');
    }
    const parts = (0, google_tts_api_1.getAllAudioUrls)(trimmed, { lang: googleLang, slow: false });
    const buffers = await Promise.all(parts.map((p) => fetchAudioBuffer(p.url)));
    return Buffer.concat(buffers);
};
exports.synthesizeTextToMp3Buffer = synthesizeTextToMp3Buffer;
//# sourceMappingURL=tts.service.js.map