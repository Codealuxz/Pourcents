import http from 'http';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 3000;
const REFRESH_MS = parseInt(process.env.REFRESH_MS || '1500', 10);

// 25 chaines : Natop x5 + 20 autres
const CHANNELS = [
  'UCOnHh1jq4LZ2Pgn7adeXnFg',
  'UCxnV0b1efAuVgzvLdjzrTsg',
  'UCPZJQKRCa8qR42yrbsZPA0A',
  'UCsNveX_fUw-feGXtavJaXoA',
  'UCjIR192gYk5mqSc3u9pOmWA',
  'UCfn_2UOehMdGzmr1KczYPNg',
  'UC-hzCqtEIc9kpXfibiI8g5g',
  'UCyGKTf_ciCMYx4yNnmCLO4A',
  'UC33ouI6m6PzoYXrYGWBoDxA',
  'UCCMX2mP6K0G7bGB0-690TlQ',
  'UCx3Gn8TvEWBpYS8FkuhJZXw',
  'UC42jFq9iynEwzDA8VG-xG7g',
  'UCWf56BPD2yh4FF5jnMyveKg',
  'UCILJ5ys-e4C1ycb0h1A2mPg',
  'UCvs1t3lHOlVqRfmkTJRqbmg',
  'UCZvetmGleeCfIzffI842x3Q',
  'UCVoj4RFLNKHl952IAkSGttQ',
  'UCjWcCtB7itTtwBujCK7sb6A',
  'UCYBhivau5cOjWDdlQ05u2-g',
  'UCap1FuQ_GyBE7LF3uShknqA',
  'UCbqvW9m4qjbDIcMyseIc3zg',
  'UCK0YZa9fia8DxE1qhUg-ZWw',
  'UCaPMLRrvxHljtxTLEXMCJtw',
  'UCz6bSwNXeWDi-q9LEond0Gw',
  'UCDemjuEn6LJprtgIdRB7Cew',
];

const lastKnown = new Map();
let cache = { total: 0, perChannel: {}, at: 0 };

async function fetchChannel(id) {
  try {
    const r = await fetch(`https://mixerno.space/api/youtube-channel-counter/user/${id}`);
    const j = await r.json();
    const sub =
      j.counts?.find((c) => c.value === 'subscribers')?.count ??
      j.counts?.find((c) => c.value === 'apisubscribers')?.count;
    if (sub != null) {
      lastKnown.set(id, sub);
      return sub;
    }
  } catch {
    // ignore
  }
  return lastKnown.get(id) ?? 0;
}

async function fetchAll() {
  const results = await Promise.all(CHANNELS.map((id) => fetchChannel(id).then((s) => [id, s])));
  const perChannel = Object.fromEntries(results);
  const total = results.reduce((acc, [, s]) => acc + s, 0);
  if (total > 0) {
    cache = { total, perChannel, at: Date.now() };
    broadcast({ type: 'subs', total, at: cache.at });
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, total: cache.total, at: cache.at }));
  }
  if (req.url === '/snapshot') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
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
  if (cache.total > 0) {
    ws.send(JSON.stringify({ type: 'subs', total: cache.total, at: cache.at }));
  }
});

fetchAll();
setInterval(fetchAll, REFRESH_MS);

server.listen(PORT, () => console.log(`[ws] :${PORT} refresh=${REFRESH_MS}ms src=mixerno channels=${CHANNELS.length}`));
