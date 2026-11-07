import { site } from './site'

// The launch checklist on the Join page. `id` is what we save in the browser to remember which
// switches someone has flipped, so give new steps a new id. `link` is optional.
export const checklist = [
  {
    id: 'discord',
    title: 'Join our Discord',
    text: 'Hop in and introduce yourself! Meeting times and updates all go there',
    link: { href: site.discord, text: 'Open Discord', external: true }
  },
  {
    id: 'meeting',
    title: 'Come to a meeting',
    text: 'Come see what we’re building and meet everyone'
  },
  {
    id: 'team',
    title: 'Pick a team (or two)',
    text: 'Not sure yet? Try a couple! Here’s what each one does',
    link: { href: '#departments', text: 'See the teams' }
  },
  {
    id: 'github',
    title: 'Get on our GitHub',
    text: 'Writing code or designing boards? Grab the join code from Discord and sign in',
    link: { href: '#github', text: 'Join the org' }
  }
]

// "Where will you start?" on the Join page. `link` is where "See what they're up to" goes.
export const departments = [
  {
    name: 'Software',
    summary: 'Flight computers, ground stations, simulations, and data visualization',
    details: 'Flight software, telemetry, and the ground station that tracks the CubeSat',
    link: '/projects#flight'
  },
  {
    name: 'Avionics',
    summary: 'Sensors, circuits, control systems, and PCB design',
    details: 'Everything in the av bay, plus the boards inside the CubeSat',
    link: '/projects#competition'
  },
  {
    name: 'Rocketry',
    summary: 'Propulsion, aerodynamics, structures, and composites',
    details: 'Airframe, fins, parachutes, the motor and the liquid engine',
    link: '/projects#propulsion'
  },
  {
    name: 'Finance',
    summary: 'Sponsorship, budgeting, and event coordination',
    details: 'Finding sponsors and getting the whole team to Launch Canada',
    link: '/sponsors'
  }
]
