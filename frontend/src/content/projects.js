// Lists on the Projects page. The rest of that page's writing is in pages/Projects.jsx.

// Labels that follow parts of the 3D rocket and CubeSat as you scroll. `anchor` is the name of a
// part in the 3D model and `side`/`vside` say which way the label sticks out, so only change the
// title and text.
export const storyLabels = [
  {
    anchor: 'rocket-nose',
    title: 'Nose cone',
    text: 'Shaped for going supersonic',
    side: 'up',
    vside: 'left'
  },
  {
    anchor: 'rocket-chute',
    title: 'Parachutes',
    text: 'Bring it home in one piece',
    side: 'down',
    vside: 'right'
  },
  {
    anchor: 'rocket-avionics',
    title: 'Av bay',
    text: 'Flight computer, sensors and radio',
    side: 'up',
    vside: 'right'
  },
  {
    anchor: 'rocket-fins',
    title: 'Fins',
    text: 'Keep it flying straight',
    side: 'down',
    vside: 'right'
  },
  {
    anchor: 'rocket-motor',
    title: 'Solid motor',
    text: 'Does all the pushing',
    side: 'up',
    vside: 'left'
  },
  {
    anchor: 'sat-wing',
    title: 'Solar panels',
    text: 'Power from the sun',
    side: 'down',
    vside: 'right'
  },
  {
    anchor: 'sat-antenna',
    title: 'UHF antennas',
    text: 'How we talk to it',
    side: 'up',
    vside: 'left'
  },
  {
    anchor: 'sat-payload',
    title: 'Payload',
    text: 'A biology based experiment',
    side: 'down',
    vside: 'left'
  },
  {
    anchor: 'guelph',
    title: 'Guelph ground station',
    text: 'The circle is our radio range',
    side: 'down',
    vside: 'right'
  },
  {
    anchor: 'orbit-sat',
    title: 'Our CubeSat',
    text: 'Way bigger than real life',
    side: 'up',
    vside: 'left'
  }
]

// Read out to screen readers while the rocket comes apart (sighted people get the labels above).
export const rocketParts = [
  { name: 'Nose cone', text: 'shaped for going supersonic' },
  {
    name: 'Parachutes',
    text: 'they come out of the bay under the nose cone and bring it home in one piece'
  },
  { name: 'Av bay', text: 'the flight computer, sensors and radio, right below the parachute bay' },
  { name: 'Fins', text: 'keep it flying straight' },
  { name: 'Solid motor', text: 'does all the pushing' }
]

// "What goes into a satellite". `key` links each one to its parts in the 3D cutaway (hover one
// and its parts light up), so only change the title and text.
export const subsystems = [
  {
    key: 'power',
    title: 'Power',
    text: 'Solar panels charge a battery pack, and the power board shares that energy out so everything keeps running, even on the night side of the planet'
  },
  {
    key: 'attitude',
    title: 'Attitude control',
    text: 'Sensors work out which way it’s facing, then little spinning wheels and magnetic coils turn it to point the right way'
  },
  {
    key: 'computer',
    title: 'Flight computer',
    text: 'The brain. It runs our flight software, checks in on every other part and stores data until we can download it'
  },
  {
    key: 'radio',
    title: 'Radio',
    text: 'A UHF radio and four tape antennas that unroll in orbit, for sending commands up and getting data down'
  },
  {
    key: 'payload',
    title: 'Experiment',
    text: 'A sealed biology based payload with its own sensors, wrapped in gold insulation. It’s the whole reason we’re going up!'
  },
  {
    key: 'structure',
    title: 'Structure',
    text: 'An aluminium 3U frame with rails that slide into the launcher, tough enough to survive getting shaken around on the way up'
  },
  {
    key: 'thermal',
    title: 'Thermal',
    text: 'Heaters and a radiator keep everything, especially the payload, from getting too hot or too cold in sunlight and in shadow'
  },
  {
    key: 'ground',
    title: 'Ground station',
    text: 'Our antenna and software here in Guelph, which follow the satellite across the sky on every pass'
  },
  {
    key: 'deorbit',
    title: 'Deorbit',
    text: 'When the mission’s over it has to come back down and burn up within 5 years, so we’re looking at a small drag sail to help it along'
  }
]

// Labels around the 3D CubeSat cutaway. `part` is the part in the model the line points at and
// `key` is the subsystem above it belongs to, so only change the title and text.
export const cutawayLabels = [
  {
    part: 'radio',
    key: 'radio',
    side: 'right',
    title: 'Radio',
    text: 'UHF radio and antenna deployer'
  },
  {
    part: 'power',
    key: 'power',
    side: 'right',
    title: 'Power',
    text: 'Power board and battery pack'
  },
  { part: 'solar', key: 'power', side: 'right', title: 'Solar panels', text: 'On every side' },
  {
    part: 'payload',
    key: 'payload',
    side: 'right',
    title: 'Payload bay',
    text: 'The biology based experiment'
  },
  {
    part: 'deorbit',
    key: 'deorbit',
    side: 'right',
    title: 'Drag sail',
    text: 'Folded up until the end'
  },
  { part: 'computer', key: 'computer', side: 'left', title: 'Flight computer' },
  {
    part: 'attitude',
    key: 'attitude',
    side: 'left',
    title: 'Attitude control',
    text: 'Reaction wheels and torque rods'
  },
  {
    part: 'thermal',
    key: 'thermal',
    side: 'left',
    title: 'Thermal',
    text: 'Heaters and a radiator'
  },
  { part: 'structure', key: 'structure', side: 'left', title: 'Structure', text: 'Rails and frame' }
]

// "Where we're at". Set `current: true` on the step we're on now and it gets highlighted.
export const timeline = [
  {
    tag: 'Now',
    when: 'Fall 2026',
    text: 'Writing our proposal and putting the team together',
    current: true
  },
  {
    tag: 'Deadline',
    when: 'November 19, 2026',
    text: 'Our application goes in to the Canadian Space Agency'
  },
  {
    tag: 'Decision',
    when: 'Around March 2027',
    text: 'The CSA should let us know if we’re in (they aim for about 15 weeks after the deadline)'
  },
  {
    tag: 'If we’re picked',
    when: 'Build and test',
    text: 'We design, build and test the real satellite'
  },
  {
    tag: 'Launch',
    when: 'Into orbit',
    text: 'The CSA sorts out our ride to space, then we fly the mission from Guelph'
  }
]
