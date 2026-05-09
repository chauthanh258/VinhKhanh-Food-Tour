/**
 * analytics-heatmap-sample.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mã mẫu JavaScript để:
 *   1. Gọi API GET /api/analytics/heatmap-data
 *   2. Vẽ heatmap lên bản đồ Leaflet hiện có bằng leaflet-heatmap.js (Leaflet.heat)
 *
 * Yêu cầu:
 *   - Thư viện Leaflet đã được load và có biến `map` (L.Map instance)
 *   - Script leaflet.heat.js được nạp:
 *       <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>
 *   - ADMIN_TOKEN: JWT token của tài khoản ADMIN
 *
 * Tích hợp vào component hiện có (React / Vue / Vanilla):
 *   - Gọi initAnalyticsHeatmap(map, token) sau khi bản đồ đã khởi tạo.
 *   - Gọi destroyAnalyticsHeatmap() khi unmount để tránh memory leak.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const API_BASE = 'http://localhost:3000/api'; // thay bằng env của bạn
let heatLayer = null;
let refreshInterval = null;

/**
 * Lấy dữ liệu heatmap từ server và render lên bản đồ.
 *
 * @param {L.Map}  map        - Instance bản đồ Leaflet hiện có
 * @param {string} token      - Bearer token ADMIN
 * @param {object} [options]
 * @param {string} [options.from]   - ISO 8601 start datetime (optional)
 * @param {string} [options.to]     - ISO 8601 end   datetime (optional)
 * @param {number} [options.radius] - Radius of each point in pixels (default 25)
 * @param {number} [options.blur]   - Amount of blur (default 15)
 * @param {number} [options.maxZoom]- Max zoom level to show heatmap (default 18)
 */
async function fetchAndRenderHeatmap(map, token, options = {}) {
  const { from, to, radius = 25, blur = 15, maxZoom = 18 } = options;

  // Build query string
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to)   params.set('to',   to);

  try {
    const response = await fetch(`${API_BASE}/analytics/heatmap-data?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Heatmap] API error:', response.status, await response.text());
      return;
    }

    const { data } = await response.json();
    // data: Array<{ lat: number, lng: number, weight: number }>

    if (!Array.isArray(data) || data.length === 0) {
      console.info('[Heatmap] No data points in selected range.');
      if (heatLayer) {
        heatLayer.setLatLngs([]);
      }
      return;
    }

    // leaflet.heat expects: [[lat, lng, intensity], ...]
    // Normalise weight to 0-1 range for better colour distribution
    const maxWeight = Math.max(...data.map((p) => p.weight));
    const points = data.map((p) => [p.lat, p.lng, p.weight / maxWeight]);

    if (heatLayer) {
      // Update existing layer instead of recreating (better perf)
      heatLayer.setLatLngs(points);
    } else {
      heatLayer = L.heatLayer(points, {
        radius,
        blur,
        maxZoom,
        gradient: {
          0.0: '#313695',
          0.2: '#4575b4',
          0.4: '#74add1',
          0.6: '#fdae61',
          0.8: '#f46d43',
          1.0: '#d73027',
        },
      });
      heatLayer.addTo(map);
    }

    console.info(`[Heatmap] Rendered ${data.length} grid cells (max weight: ${maxWeight}).`);
  } catch (err) {
    console.error('[Heatmap] Fetch failed:', err);
  }
}

/**
 * Khởi tạo heatmap analytics lên bản đồ Leaflet.
 * Tự động làm mới mỗi 60 giây.
 *
 * @param {L.Map}  map   - Instance bản đồ Leaflet hiện có
 * @param {string} token - Bearer token ADMIN
 */
function initAnalyticsHeatmap(map, token) {
  // Lấy ngay lần đầu
  fetchAndRenderHeatmap(map, token);

  // Làm mới mỗi 60 giây
  refreshInterval = setInterval(() => {
    fetchAndRenderHeatmap(map, token);
  }, 60_000);
}

/**
 * Xoá heatmap layer và dừng auto-refresh.
 * Gọi khi unmount component.
 */
function destroyAnalyticsHeatmap() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  if (heatLayer) {
    heatLayer.remove();
    heatLayer = null;
  }
}

// ─── Ví dụ gửi location track từ client ──────────────────────────────────────
/**
 * Gọi hàm này mỗi khi vị trí người dùng thay đổi (watchPosition callback).
 *
 * @param {string} sessionId - UUID ngẫu nhiên lưu trong localStorage
 * @param {number} lat
 * @param {number} lng
 */
async function sendLocationTrack(sessionId, lat, lng) {
  try {
    await fetch(`${API_BASE}/analytics/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        lat,
        lng,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    // silent fail – analytics không được ảnh hưởng đến UX chính
    console.warn('[Analytics] Location track failed (non-critical):', err);
  }
}

// ─── Ví dụ gửi listen event từ client ────────────────────────────────────────
/**
 * Gọi khi người dùng dừng/ngừng nghe audio của một POI.
 *
 * @param {string} sessionId       - UUID ngẫu nhiên từ localStorage
 * @param {string} poiId           - UUID của POI
 * @param {number} durationSeconds - Thời gian nghe thực tế (giây)
 */
async function sendListenEvent(sessionId, poiId, durationSeconds) {
  try {
    await fetch(`${API_BASE}/analytics/listen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, poiId, durationSeconds }),
    });
  } catch (err) {
    console.warn('[Analytics] Listen event failed (non-critical):', err);
  }
}

// ─── Tạo hoặc lấy sessionId ẩn danh ─────────────────────────────────────────
function getOrCreateSessionId() {
  const KEY = 'vk_session_id';
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    // Tạo UUID v4 chuẩn (không dùng crypto.randomUUID để tương thích rộng hơn)
    sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(KEY, sid);
  }
  return sid;
}

// ─── Ví dụ sử dụng tích hợp đầy đủ ──────────────────────────────────────────
/*

  // 1. Lấy sessionId
  const SESSION_ID = getOrCreateSessionId();

  // 2. Theo dõi vị trí và gửi lên server
  navigator.geolocation.watchPosition(
    (pos) => sendLocationTrack(SESSION_ID, pos.coords.latitude, pos.coords.longitude),
    (err) => console.warn('GPS error:', err),
    { enableHighAccuracy: true, maximumAge: 10_000 }
  );

  // 3. Khi audio kết thúc:
  audioElement.addEventListener('ended', () => {
    const durationSec = Math.round(audioElement.currentTime);
    sendListenEvent(SESSION_ID, currentPoiId, durationSec);
  });

  // 4. Trong trang Admin – vẽ heatmap lên bản đồ Leaflet đã có:
  const ADMIN_TOKEN = localStorage.getItem('auth_token');
  initAnalyticsHeatmap(map, ADMIN_TOKEN);

  // 5. Khi unmount (React useEffect cleanup / Vue beforeUnmount):
  return () => destroyAnalyticsHeatmap();

*/

// Export cho môi trường module (React/Vue/Next)
if (typeof module !== 'undefined') {
  module.exports = {
    initAnalyticsHeatmap,
    destroyAnalyticsHeatmap,
    fetchAndRenderHeatmap,
    sendLocationTrack,
    sendListenEvent,
    getOrCreateSessionId,
  };
}
