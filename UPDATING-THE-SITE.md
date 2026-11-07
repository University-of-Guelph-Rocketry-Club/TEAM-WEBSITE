# Updating the site

Most of the writing on the site lives in `frontend/src/content/`. There's one file per page, plus `site.js` for links that show up everywhere. Change the text in there, save, and the site updates. You don't need to touch any of the page code for this stuff

## Where things are

| To change...                                          | Edit                                  |
| ----------------------------------------------------- | ------------------------------------- |
| Team members, roles and photos                        | `content/team.js`                     |
| Discord, email, Instagram, LinkedIn or GitHub links   | `content/site.js`                     |
| The competition we're going to (name and year)        | `competition` in `content/site.js`    |
| The project cards in the home page hangar             | `hangarProjects` in `content/home.js` |
| The "I'm into ___" picker on the home page            | `interests` in `content/home.js`      |
| Sponsors and "Where your support goes"                | `content/sponsors.js`                 |
| The launch checklist and teams on the Join page       | `content/join.js`                     |
| Projects page lists (subsystems, timeline, 3D labels) | `content/projects.js`                 |
| The Photos page and the postcards on the home page    | `content/gallery.js`                  |
| Any other heading or paragraph                        | the page itself in `src/pages/`       |

For that last one, search the `src` folder for the sentence you want to change and it'll take you straight there

## Adding someone to the team

1. Put their photo in `frontend/public/Images/`, say `sam.jpg`. It gets cropped to a 4:5 portrait, so a photo with their face near the middle works best
2. Add a line to `content/team.js`:

   ```js
   { name: 'Sam', role: 'Rocketry Team Lead', photo: '/Images/sam.jpg' },
   ```

3. They show up in the same order as the list. No photo yet? Leave `photo` out and it shows the first letter of their name instead

When the new execs take over, update `teamIntro` at the top of the same file too, since it has the year in it

## Adding a sponsor

Add another entry to `sponsors` in `content/sponsors.js`. Each one gets its own block on the Sponsors page, and the first one in the list also shows near the bottom of the home page

## Adding photos

Photos live in `frontend/public/Images/launch-canada-2026/`. Each one has a big version (`name.webp`, 1600px on the long edge) for the viewer and a small one (`name-s.webp`, 720px) for the grids. Export both, drop them in that folder, then add the photo to a chapter in `content/gallery.js` with a caption. The comment at the top of that file explains the `size` options for the grid. The same names work for the home page too: `postcards` in `content/gallery.js` is the strip of prints, and each interest in `content/home.js` can have a `photo`

## Apostrophes

The text uses curly apostrophes (’) like in `We’re`. If you type a normal one (') inside text that's wrapped in 'single quotes' it ends the text early and the site won't build. Either use the curly one, or wrap that bit of text in "double quotes" instead

## Things that need a bit more care

- **Anything with an `anchor`, `part` or `key`.** Those link a label to a part of a 3D model, so only change the `title` and `text`
- **The hangar on the home page has exactly three stops** (rocket, CubeSat, engine). The cards can say whatever you like, but adding or removing a project means changing the 3D scene in `components/home/hangarScene.js` and `hangarStations.js`
- **The Mach 2.2 goal** is in the hangar card text, a couple of sentences in `pages/Projects.jsx` and `goal` on the `MachOdometer`. The example flight on the Projects page (`components/projects/flightSim.js`) is tuned to hit about Mach 2.2, so if the goal changes a lot that needs redoing too, along with the "more than twice the speed of sound" line
- **Checklist `id`s** are what we save in people's browsers to remember which switches they flipped, so give a new step a new `id` instead of reusing an old one
- **The timeline** highlights whichever step has `current: true`. Move it along as the CubeSat application goes

## Adding a new page

1. Make the page in `src/pages/`, like `src/pages/Events.jsx`
2. Give it a route in `src/App.jsx`
3. Add it to `PAGES` at the top of `src/components/Navbar.jsx` so it shows in the menu

## Running it on your computer

```bash
cd frontend
npm install
npm run dev
```

## Before you commit

```bash
npm run format
npm run lint
npm run build
```

`format` tidies up the code so everyone's changes look the same, `lint` catches mistakes like unused variables, and `build` makes sure the site still builds. If all three pass you're good to go

## Writing style

Keep it casual, like you're telling a friend about the club. Short paragraphs, contractions are good, and no full stop at the end of a short paragraph. If a 3D model or graph isn't our real design yet, say it's an example
