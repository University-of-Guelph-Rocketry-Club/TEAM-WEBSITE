// The Photos pages and the postcards strip on the home page.
//
// Every event in `events` gets a cover on /gallery and its own page at /gallery/<slug>. Its photos
// live in frontend/public/Images/<slug>/, two files each: `<name>.webp` (1600px on the long edge,
// for the viewer) and `<name>-s.webp` (720px, for the grids). Export new ones at those sizes, drop
// them in that folder, and add them to a chapter below. Newest event goes first.
//
// `size` is how big the photo is in the grid. Leave it out for a normal tile, or use 'big' (twice
// the width and height), 'tall' (twice the height, for portraits) or 'wide' (twice the width but
// not the height, so it gets cropped to a letterbox). The grid is six columns wide and a normal
// tile takes two, so a row fills up with three normals, a big and a tall, or a wide and a normal.
// `ratio` is width divided by height, so the page can reserve the right space before the file loads.
// `focus` is optional: where to keep in frame when a tile crops the photo, like '80% 50%' to keep
// the right side.
//
// Anywhere else on the site, a photo is written as '<slug>/<name>', like
// 'launch-canada-2026/pad-2'.

export const events = [
  {
    slug: 'launch-canada-2026',
    // Stamped on its prints in the home page strip.
    short: 'Launch Canada ’26',
    title: 'Launch Canada 2026',
    // Short line on the cover and under the title, then the longer intro.
    intro: 'Five days up in Timmins with a rocket called Alaris',
    text: 'Launch Canada is the big one. Every student rocketry team in the country rolls into a hockey arena for build week, then heads out to a launch site in the bush. We took a few hundred photos. These are the keepers',
    when: 'August 2026',
    where: 'Timmins, Ontario',
    // The photo at the top of the page and on its cover.
    hero: 'pad-2',
    chapters: [
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
          {
            name: 'chute',
            ratio: 0.6667,
            size: 'tall',
            caption: 'The chute, checked one more time'
          },
          { name: 'the-site', ratio: 1.5, size: 'wide', caption: 'The site, from up the hill' },
          { name: 'fitting', ratio: 1.5, caption: 'Lining up the body tube' },
          { name: 'alaris', ratio: 1.5, size: 'wide', caption: 'Named Alaris. Go on, look it up' },
          { name: 'in-the-sand', ratio: 1.5, caption: 'Last fit check in the sand' }
        ]
      },
      {
        id: 'ground-test',
        title: 'Ground test',
        text: 'Respirators on. Before anything flies, the motor gets fired on the ground, and nobody rushes this bit',
        photos: [
          {
            name: 'motor',
            ratio: 1.5,
            size: 'big',
            caption: 'Masks on, gloves on, motor going together'
          },
          {
            name: 'motor-casing',
            ratio: 0.6667,
            size: 'tall',
            caption: 'Loading the casing for the ground test'
          },
          { name: 'aft-end', ratio: 1.5, size: 'wide', caption: 'Buttoning up the aft end' },
          { name: 'gloves', ratio: 1.5, caption: 'Ready to fire' }
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
          { name: 'road-trip', ratio: 1.3333, caption: 'We yearn for the mines' },
          { name: 'crew-3', ratio: 1.5, caption: 'Range day face' }
        ]
      }
    ]
  },
  {
    slug: 'cubesat-conference-2026',
    // Stamped on its prints in the home page strip.
    short: 'CubeSat Conf ’26',
    title: 'Canadian CubeSat Conference 2026',
    intro: 'Two days of satellites, talks and a lot of snow',
    text: 'The CubeSat team packed up a poster and headed to the Canadian CubeSat Conference to see what everyone else is flying, and to show off what we’re building',
    when: 'March 2026',
    hero: 'panels',
    chapters: [
      {
        id: 'table',
        title: 'Our table',
        text: 'A poster, a couple of laptops and whoever was on shift',
        photos: [
          { name: 'booth', ratio: 1.5013, size: 'big', caption: 'Poster up, ready for questions' },
          { name: 'banner', ratio: 0.75, size: 'tall', caption: 'Made it' },
          { name: 'crew', ratio: 1.7778, size: 'wide', caption: 'The whole crew' },
          { name: 'booth-2', ratio: 1.7778, caption: 'Next shift' }
        ]
      },
      {
        id: 'floor',
        title: 'Around the conference',
        text: 'Talks all day, and a show floor full of real flight hardware to stare at',
        photos: [
          { name: 'panels', ratio: 1.7778, size: 'big', caption: 'Now those are solar panels' },
          { name: 'panels-tall', ratio: 0.5625, size: 'tall', caption: 'Taking notes for ours' },
          { name: 'talk', ratio: 1.7778, size: 'wide', caption: 'Talks, snacks in hand' },
          { name: 'street', ratio: 0.5625, caption: 'The walk over' }
        ]
      },
      {
        id: 'after-hours',
        title: 'After hours',
        text: 'Snow on every roof and nobody going to bed early',
        photos: [
          { name: 'skyline', ratio: 1.7778, size: 'big', caption: 'The view from the venue' },
          {
            name: 'night',
            ratio: 0.5625,
            size: 'tall',
            focus: '82% 50%',
            caption: 'Midnight, still going'
          }
        ]
      }
    ]
  }
]

// The strip of prints on the home page, in order. `photo` is '<slug>/<name>', `tilt` is the angle
// in degrees, and each print links to its event's page.
export const postcards = [
  { photo: 'launch-canada-2026/pad-2', caption: 'Pad 2, ready', tilt: -2 },
  { photo: 'cubesat-conference-2026/panels', caption: 'Satellite envy', tilt: 1.5 },
  { photo: 'launch-canada-2026/carrying', caption: 'The walk out', tilt: -1 },
  { photo: 'cubesat-conference-2026/booth', caption: 'Poster day', tilt: 2 },
  { photo: 'launch-canada-2026/motor', caption: 'Ground test prep', tilt: -1.5 },
  { photo: 'launch-canada-2026/chute', caption: 'Chute check', tilt: 1 },
  { photo: 'cubesat-conference-2026/night', caption: 'Midnight, still going', tilt: -2.5 },
  { photo: 'launch-canada-2026/alaris', caption: 'Alaris', tilt: 1.5 },
  { photo: 'cubesat-conference-2026/crew', caption: 'CubeSat crew', tilt: -1 },
  { photo: 'launch-canada-2026/sunrise', caption: '5:56 am', tilt: 2 }
]

// '<slug>/<name>' to a file. `small` gives the 720px grid version.
export const photoSrc = (photo, small = false) => `/Images/${photo}${small ? '-s' : ''}.webp`

export const eventFor = photo => events.find(event => photo.startsWith(`${event.slug}/`))
