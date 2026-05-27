import http from 'http';
import { WebSocketServer } from 'ws';

const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDxGnvfLIAZZNUTiOUOCyLeeCbP_JhvscQ';
const PORT = process.env.PORT || 3000;
const REFRESH_MS = parseInt(process.env.REFRESH_MS || '30000', 10);

// 21 chaines : Natop x5 + 16 autres
const CHANNELS = [
  'UCOnHh1jq4LZ2Pgn7adeXnFg', // Natop
  'UCxnV0b1efAuVgzvLdjzrTsg', // Natop²
  'UCPZJQKRCa8qR42yrbsZPA0A', // Natop Shorts
  'UCsNveX_fUw-feGXtavJaXoA', // Natop short
  'UCjIR192gYk5mqSc3u9pOmWA', // Natop Clips
  'UCfn_2UOehMdGzmr1KczYPNg', // Litsu
  'UC-hzCqtEIc9kpXfibiI8g5g', // TuRis
  'UCyGKTf_ciCMYx4yNnmCLO4A', // anakin
  'UC33ouI6m6PzoYXrYGWBoDxA', // BLZstarss
  'UCCMX2mP6K0G7bGB0-690TlQ', // Palmito
  'UCx3Gn8TvEWBpYS8FkuhJZXw', // Shawnichi
  'UC42jFq9iynEwzDA8VG-xG7g', // ElBiblo
  'UCWf56BPD2yh4FF5jnMyveKg', // Fog
  'UCILJ5ys-e4C1ycb0h1A2mPg', // Istor
  'UCvs1t3lHOlVqRfmkTJRqbmg', // Struyow
  'UCZvetmGleeCfIzffI842x3Q', // Rémax
  'UCVoj4RFLNKHl952IAkSGttQ', // FANTOCHE
  'UCjWcCtB7itTtwBujCK7sb6A', // dayviix
  'UCYBhivau5cOjWDdlQ05u2-g', // Karzaaax
  'UCap1FuQ_GyBE7LF3uShknqA', // Qziou
  'UCbqvW9m4qjbDIcMyseIc3zg', // Strayed
  'UCK0YZa9fia8DxE1qhUg-ZWw', // Gumby
  'UCaPMLRrvxHljtxTLEXMCJtw', // annito
  'UCz6bSwNXeWDi-q9LEond0Gw', // Malco
  'UCDemjuEn6LJprtgIdRB7Cew', // Nirio
];

let cache = { total: 0, perChannel: {}, at: 0 };

async function fetchAll() {
  // YouTube Data API : 1 requete pour jusqu'a 50 channels (batch)
  const url = new URL('https://www.googleapis.com/youtube/v3/channels');
  url.searchParams.set('part', 'statistics');
  url.searchParams.set('id', CHANNELS.join(','));
  url.searchParams.set('key', API_KEY);

  try {
    const r = await fetch(url);
    const j = await r.json();
    if (!j.items) {
      console.warn('[yt] no items:', JSON.stringify(j).slice(0, 200));
      return;
    }
    const perChannel = {};
    let total = 0;
    for (const item of j.items) {
      const subs = parseInt(item.statistics?.subscriberCount || '0', 10);
      perChannel[item.id] = subs;
      total += subs;
    }
    cache = { total, perChannel, at: Date.now() };
    broadcast({ type: 'subs', total, at: cache.at });
    console.log(`[refresh] total=${total} channels=${Object.keys(perChannel).length}`);
  } catch (e) {
    console.error('[refresh] err:', e.message);
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, total: cache.total, at: cache.at }));
  }
  if (req.url === '/snapshot') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify(cache));
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((c) => {
    if (c.readyState === 1) c.send(msg);
  });
}

wss.on('connection', (ws) => {
  // envoie la derniere valeur connue au nouveau client
  if (cache.total > 0) {
    ws.send(JSON.stringify({ type: 'subs', total: cache.total, at: cache.at }));
  }
});

fetchAll();
setInterval(fetchAll, REFRESH_MS);

server.listen(PORT, () => console.log(`[ws] listening on ${PORT} (refresh every ${REFRESH_MS}ms)`));
