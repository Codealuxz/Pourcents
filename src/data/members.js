// Membres du clan ( % ) — données YouTube réelles (subs + views + avatar)
// Trié par subscribers desc. Limité aux membres avec compte YT connecté sur Discord.
// Source : Discord MS Saison 6 + API mixerno.space

export const members = [
  { name: 'Natop', handle: 'natop', channelId: 'UCOnHh1jq4LZ2Pgn7adeXnFg', subs: 11776459, views: 2818445094, pfp: '/avatars/natop.jpg', combined: true },
  { name: 'Litsu', handle: 'Litsu', channelId: 'UCfn_2UOehMdGzmr1KczYPNg', subs: 624162, views: 852655940, pfp: '/avatars/litsu.jpg' },
  { name: 'TuRis WORLD', handle: 'TuRis WORLD', channelId: 'UC-hzCqtEIc9kpXfibiI8g5g', subs: 484315, views: 187097645, pfp: '/avatars/turis.jpg' },
  { name: 'anakin', handle: 'Anakin', channelId: 'UCyGKTf_ciCMYx4yNnmCLO4A', subs: 219595, views: 75861897, pfp: '/avatars/anakin.jpg' },
  { name: 'BLZstarss', handle: 'BLZstarss', channelId: 'UC33ouI6m6PzoYXrYGWBoDxA', subs: 117721, views: 11759609, pfp: '/avatars/blzstarss.jpg' },
  { name: 'Palmito', handle: 'Palmito', channelId: 'UCCMX2mP6K0G7bGB0-690TlQ', subs: 83584, views: 9761220, pfp: '/avatars/palmito.jpg' },
  { name: 'Shawnichi', handle: 'Shawnichi', channelId: 'UCx3Gn8TvEWBpYS8FkuhJZXw', subs: 65313, views: 8285311, pfp: '/avatars/shawnichi.jpg' },
  { name: 'ElBiblo', handle: 'ElBiblo', channelId: 'UC42jFq9iynEwzDA8VG-xG7g', subs: 56035, views: 9065727, pfp: '/avatars/elbiblo.jpg' },
  { name: 'Fog', handle: 'Fog', channelId: 'UCWf56BPD2yh4FF5jnMyveKg', subs: 49128, views: 2507677, pfp: '/avatars/fog.jpg' },
  { name: 'Istor', handle: 'IstorHK', channelId: 'UCILJ5ys-e4C1ycb0h1A2mPg', subs: 47418, views: 14921640, pfp: '/avatars/istor.jpg' },
  { name: 'Struyow', handle: 'struyow', channelId: 'UCvs1t3lHOlVqRfmkTJRqbmg', subs: 33342, views: 6335129, pfp: '/avatars/struyow.jpg' },
  { name: 'FANTOCHE', handle: 'FANTOCHE', channelId: 'UCVoj4RFLNKHl952IAkSGttQ', subs: 31581, views: 15174611, pfp: '/avatars/fantoche.jpg' },
  { name: 'Rémax Superstar', handle: 'Rémax', channelId: 'UCZvetmGleeCfIzffI842x3Q', subs: 30041, views: 4640459, pfp: '/avatars/remax.jpg' },
  { name: 'dayviix', handle: 'dayviix', channelId: 'UCjWcCtB7itTtwBujCK7sb6A', subs: 21640, views: 1185956, pfp: '/avatars/ora.jpg' },
  { name: 'Karzaaax', handle: 'Karzax', channelId: 'UCYBhivau5cOjWDdlQ05u2-g', subs: 17421, views: 2145264, pfp: '/avatars/karzaaax.jpg' },
  { name: 'Qziou', handle: 'Qziouyt', channelId: 'UCap1FuQ_GyBE7LF3uShknqA', subs: 16003, views: 11758915, pfp: '/avatars/qziou.jpg' },
  { name: 'Strayed', handle: 'Strayed', channelId: 'UCbqvW9m4qjbDIcMyseIc3zg', subs: 8727, views: 502979, pfp: '/avatars/strayed.jpg' },
  { name: 'rom', handle: 'rom.minecraft', channelId: 'UCmGp6F8O4ZP9yeTc0BY9coA', subs: 2880, views: 3365213, pfp: '/avatars/rom.jpg' },
  { name: 'Malco', handle: 'Malco', channelId: 'UCz6bSwNXeWDi-q9LEond0Gw', subs: 2780, views: 472493, pfp: '/avatars/malco.jpg' },
  { name: 'Gumby', handle: 'Gumby', channelId: 'UCK0YZa9fia8DxE1qhUg-ZWw', subs: 2307, views: 734528, pfp: '/avatars/gumby.jpg' },
];

const fr = new Intl.NumberFormat('fr-FR');
export function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace('.', ',') + 'M';
  if (n >= 10_000) return Math.round(n / 1000) + 'K';
  if (n >= 1_000) return (n / 1000).toFixed(1).replace('.', ',') + 'K';
  return fr.format(n);
}
