-- Analytics migration: add location_tracks and listen_events
-- Does NOT modify any existing table.

CREATE TABLE IF NOT EXISTS location_tracks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  VARCHAR(128) NOT NULL,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lt_session   ON location_tracks(session_id);
CREATE INDEX IF NOT EXISTS idx_lt_timestamp ON location_tracks(timestamp);
CREATE INDEX IF NOT EXISTS idx_lt_latlng    ON location_tracks(lat, lng);

CREATE TABLE IF NOT EXISTS listen_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       VARCHAR(128) NOT NULL,
  poi_id           UUID NOT NULL REFERENCES pois(id) ON DELETE CASCADE,
  listened_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_le_session  ON listen_events(session_id);
CREATE INDEX IF NOT EXISTS idx_le_poi      ON listen_events(poi_id);
CREATE INDEX IF NOT EXISTS idx_le_listened ON listen_events(listened_at);
