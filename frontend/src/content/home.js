import { site } from './site'

// "What we're building" on the home page. Each card goes with one stop in the 3D hangar
// (rocket, then CubeSat, then engine), so keep them in this order. Changing the wording is fine,
// but adding or removing a project also needs the 3D scene changed (components/home/hangarScene.js).
export const hangarProjects = [
  {
    name: 'Rocket',
    title: 'Competition rocket',
    text: `We’re heading for ${site.competition} with a rocket designed and built by our team. The goal? Mach 2.2!`,
    link: '/projects#competition',
    linkText: 'Check out the rocket'
  },
  {
    name: 'CubeSat',
    title: 'CubeSat',
    text: 'Build a satellite with us! Help with the spacecraft structure, electronics, or onboard computing',
    link: '/projects#cubesat',
    linkText: 'Check out the CubeSat'
  },
  {
    name: 'Engine',
    title: 'Liquid engine',
    text: 'Let’s get this engine firing! We’re designing the liquid engine and its ground test stand'
  }
]

// The "I'm into ___" picker. `label` is the button, then it says "You'd fit right in on
// {team}!" followed by `text`. Add or remove as many as you like.
export const interests = [
  {
    label: 'writing code',
    team: 'Software',
    text: 'Flight software, the ground station, flight sims and even this website'
  },
  {
    label: 'circuits',
    team: 'Avionics',
    text: 'Flight computers, sensors, radios and designing our own PCBs'
  },
  {
    label: 'building stuff',
    team: 'Rocketry',
    text: 'Airframes, fins, parachutes, the motor and the liquid engine'
  },
  {
    label: 'biology',
    team: 'the CubeSat team',
    text: 'There’s a biology based payload going up on the CubeSat (yes, really)'
  },
  {
    label: 'money stuff',
    team: 'Finance',
    text: 'Sponsors, budgets and getting the whole team to competition'
  },
  {
    label: 'social media',
    team: 'Outreach',
    text: 'Running our Instagram and LinkedIn, taking photos at launches and telling everyone what we’re up to'
  }
]
