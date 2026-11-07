// The photo gallery (the Photos page) and the postcards strip on the home page.
//
// Photos live in frontend/public/Images/launch-canada-2026/. Every photo has two files:
// `<name>.webp` (1600px on the long edge, for the lightbox) and `<name>-s.webp` (720px, for the
// grids). Export new ones at those sizes, drop them in that folder, and add them below.
//
// `size` is how big the photo is in the grid. Leave it out for a normal tile, or use 'big' (twice
// the width and height), 'tall' (twice the height, for portraits) or 'wide' (twice the width but
// not the height, so it gets cropped to a letterbox). The grid is six columns wide and a normal
// tile takes two, so a row fills up with three normals, a big and a tall, or a wide and a normal.
// `ratio` is width divided by height, so the page can reserve the right space before the file loads.

export const gallery = {
  title: 'Launch Canada 2026',
  // Short and long intro at the top of the page.
  intro: 'Five days up in Timmins with a rocket called Alaris',
  text: 'Launch Canada is the big one. Every student rocketry team in the country rolls into a hockey arena for build week, then heads out to a launch site in the bush. We took a few hundred photos. These are the keepers',
  when: 'August 2026',
  where: 'Timmins, Ontario',
  rocket: 'Alaris',
  // The one at the very top of the page.
  hero: 'pad-2'
}

export const chapters = [
  {
    id: 'arena',
    title: 'The arena',
    text: 'Build week happens on the floor of a hockey arena, one table per team. Ours was under the big tiger banner',
    photos: [
      {
        name: 'arena',
        ratio: 1.3333,
        size: 'big',
        caption: 'Every team in the country in one rink'
      },
      { name: 'arena-selfie', ratio: 0.75, size: 'tall', caption: 'Table claimed' },
      { name: 'arena-rocket', ratio: 1.5, caption: 'Alaris, freshly unpacked' },
      { name: 'avionics-table', ratio: 1.5, caption: 'Flight computer checks, thumbs up' },
      {
        name: 'chute-floor',
        ratio: 1.5,
        size: 'wide',
        caption: 'The main chute, laid out on the ice (well, the concrete)'
      },
      { name: 'checklist', ratio: 1.5, caption: 'Everything gets written down' },
      { name: 'gopro', ratio: 1.5, caption: 'The GoPro took about 150 photos of fingers' },
      { name: 'camera', ratio: 1.5, caption: 'Paparazzi' },
      { name: 'arena-table', ratio: 1.5, size: 'wide', caption: 'Our corner' }
    ]
  },
  {
    id: 'pad',
    title: 'Out at the pad',
    text: 'The launch site is a sandy clearing in the bush, all fireweed and the odd burnt tree. You work on a tarp',
    photos: [
      {
        name: 'caution-sign',
        ratio: 0.75,
        size: 'tall',
        caption: 'You know you’re in the right place'
      },
      { name: 'field-tarp', ratio: 1.5, size: 'wide', caption: 'The office' },
      { name: 'field-tent', ratio: 1.3333, caption: 'Range day' },
      { name: 'out-of-the-truck', ratio: 1.5, caption: 'Out of the truck, and in one piece' },
      { name: 'packing', ratio: 1.5, size: 'big', caption: 'Packing the recovery bay' },
      { name: 'chute', ratio: 0.6667, size: 'tall', caption: 'The chute, checked one more time' },
      { name: 'the-site', ratio: 1.5, size: 'wide', caption: 'The site, from up the hill' },
      { name: 'fitting', ratio: 1.5, caption: 'Lining up the body tube' },
      { name: 'alaris', ratio: 1.5, size: 'wide', caption: 'Named Alaris. Go on, look it up' },
      { name: 'in-the-sand', ratio: 1.5, caption: 'Last fit check in the sand' }
    ]
  },
  {
    id: 'motor',
    title: 'Motor time',
    text: 'Respirators on. Building the motor is the one bit of the day nobody rushes',
    photos: [
      { name: 'motor', ratio: 1.5, size: 'big', caption: 'Masks on, gloves on' },
      { name: 'motor-casing', ratio: 0.6667, size: 'tall', caption: 'Loading the casing' },
      { name: 'aft-end', ratio: 1.5, size: 'wide', caption: 'Buttoning up the aft end' },
      { name: 'gloves', ratio: 1.5, caption: 'Motor’s in' }
    ]
  },
  {
    id: 'rail',
    title: 'On the rail',
    text: 'Then the walk out to pad 2, the rail goes up, and everyone backs off to the fence',
    photos: [
      { name: 'carrying', ratio: 1.5, size: 'big', caption: 'The walk out' },
      { name: 'on-the-rail', ratio: 0.6667, size: 'tall', caption: 'Sliding onto the rail' },
      { name: 'at-the-rail', ratio: 1.5, caption: 'One last look before it goes up' },
      { name: 'pad-2-base', ratio: 1.5, caption: 'Last connections at the base' },
      { name: 'raising', ratio: 0.6667, size: 'tall', caption: 'Going vertical' },
      { name: 'pad-2', ratio: 1.5, size: 'big', caption: 'Pad 2, ready' },
      { name: 'running', ratio: 1.5, caption: 'Someone’s in a hurry' }
    ]
  },
  {
    id: 'crew',
    title: 'The crew',
    text: 'The best part of competition week is the week. Long days, early starts and a sunrise over the lake',
    photos: [
      { name: 'crew-1', ratio: 1.5, size: 'big', caption: 'Thumbs up all round' },
      { name: 'crew-2', ratio: 1.5, caption: 'Fireweed season' },
      { name: 'sunrise', ratio: 0.75, size: 'tall', caption: '5:56 am. Worth it' },
      { name: 'road-trip', ratio: 1.3333, caption: 'Day off' },
      { name: 'crew-3', ratio: 1.5, caption: 'Range day face' }
    ]
  }
]

// The strip of prints on the home page, in order. `tilt` is the angle in degrees.
export const postcards = [
  { name: 'pad-2', caption: 'Pad 2, ready', tilt: -2 },
  { name: 'carrying', caption: 'The walk out', tilt: 1.5 },
  { name: 'arena', caption: 'Build week in the arena', tilt: -1 },
  { name: 'motor', caption: 'Motor time', tilt: 2 },
  { name: 'chute', caption: 'Chute check', tilt: -1.5 },
  { name: 'gloves', caption: 'Motor’s in', tilt: 1 },
  { name: 'alaris', caption: 'Alaris', tilt: -2.5 },
  { name: 'sunrise', caption: '5:56 am', tilt: 1.5 }
]

export const photoSrc = (name, small = false) =>
  `/Images/launch-canada-2026/${name}${small ? '-s' : ''}.webp`

// Every photo in page order, for the lightbox's previous/next.
export const allPhotos = chapters.flatMap(chapter =>
  chapter.photos.map(photo => ({ ...photo, chapter: chapter.title }))
)
