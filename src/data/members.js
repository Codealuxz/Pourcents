// Membres du clan ( % ) — données YouTube réelles (subs + views + avatar)
// Trié par subscribers desc. Limité aux membres avec compte YT connecté sur Discord.
// Source : Discord MS Saison 6 + API mixerno.space

export const members = [
  { name: 'Natop', handle: 'natop', channelId: 'UCOnHh1jq4LZ2Pgn7adeXnFg', subs: 11765762, views: 2811916418, pfp: '/avatars/natop.jpg', combined: true },
  { name: 'Litsu', handle: 'Litsu', channelId: 'UCfn_2UOehMdGzmr1KczYPNg', subs: 575001, views: 748689589, pfp: '/avatars/litsu.jpg' },
  { name: 'TuRis WORLD', handle: 'TuRis WORLD', channelId: 'UC-hzCqtEIc9kpXfibiI8g5g', subs: 427000, views: 162455137, pfp: '/avatars/turis.jpg' },
  { name: 'anakin', handle: 'Anakin', channelId: 'UCyGKTf_ciCMYx4yNnmCLO4A', subs: 181000, views: 59523001, pfp: '/avatars/anakin.jpg' },
  { name: 'BLZstarss', handle: 'BLZstarss', channelId: 'UC33ouI6m6PzoYXrYGWBoDxA', subs: 113185, views: 9120909, pfp: '/avatars/blzstarss.jpg' },
  { name: 'Palmito', handle: 'Palmito', channelId: 'UCCMX2mP6K0G7bGB0-690TlQ', subs: 78699, views: 5288398, pfp: '/avatars/palmito.jpg' },
  { name: 'Shawnichi', handle: 'Shawnichi', channelId: 'UCx3Gn8TvEWBpYS8FkuhJZXw', subs: 59900, views: 7400968, pfp: '/avatars/shawnichi.jpg' },
  { name: 'ElBiblo', handle: 'ElBiblo', channelId: 'UC42jFq9iynEwzDA8VG-xG7g', subs: 53500, views: 8591580, pfp: '/avatars/elbiblo.jpg' },
  { name: 'Fog', handle: 'Fog', channelId: 'UCWf56BPD2yh4FF5jnMyveKg', subs: 46700, views: 2383708, pfp: '/avatars/fog.jpg' },
  { name: 'Istor', handle: 'IstorHK', channelId: 'UCILJ5ys-e4C1ycb0h1A2mPg', subs: 41399, views: 15584970, pfp: '/avatars/istor.jpg' },
  { name: 'Struyow', handle: 'struyow', channelId: 'UCvs1t3lHOlVqRfmkTJRqbmg', subs: 32800, views: 6216787, pfp: '/avatars/struyow.jpg' },
  { name: 'Rémax Superstar', handle: 'Rémax', channelId: 'UCZvetmGleeCfIzffI842x3Q', subs: 28900, views: 4570783, pfp: '/avatars/remax.jpg' },
  { name: 'FANTOCHE', handle: 'FANTOCHE', channelId: 'UCVoj4RFLNKHl952IAkSGttQ', subs: 25200, views: 10199023, pfp: '/avatars/fantoche.jpg' },
  { name: 'dayviix', handle: 'dayviix', channelId: 'UCjWcCtB7itTtwBujCK7sb6A', subs: 21600, views: 1179887, pfp: '/avatars/ora.jpg' },
  { name: 'Karzaaax', handle: 'Karzax', channelId: 'UCYBhivau5cOjWDdlQ05u2-g', subs: 16400, views: 2017449, pfp: '/avatars/karzaaax.jpg' },
  { name: 'Qziou', handle: 'Qziouyt', channelId: 'UCap1FuQ_GyBE7LF3uShknqA', subs: 14000, views: 11064519, pfp: '/avatars/qziou.jpg' },
  { name: 'Strayed', handle: 'Strayed', channelId: 'UCbqvW9m4qjbDIcMyseIc3zg', subs: 8480, views: 464090, pfp: '/avatars/strayed.jpg' },
  { name: 'Gumby', handle: 'Gumby', channelId: 'UCK0YZa9fia8DxE1qhUg-ZWw', subs: 2310, views: 733525, pfp: '/avatars/gumby.jpg' },
];

const fr = new Intl.NumberFormat('fr-FR');
export function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace('.', ',') + 'M';
  if (n >= 10_000) return Math.round(n / 1000) + 'K';
  if (n >= 1_000) return (n / 1000).toFixed(1).replace('.', ',') + 'K';
  return fr.format(n);
}
