import { Link } from 'react-router-dom'
import StoryStage from '../components/projects/StoryStage'
import MachOdometer from '../components/projects/MachOdometer'
import FlightProfile from '../components/projects/FlightProfile'
import FieldFootage from '../components/projects/FieldFootage'
import GroundStation from '../components/projects/GroundStation'
import SeedChambers from '../components/projects/SeedChambers'
import CountUp from '../components/projects/CountUp'
import { useSectionProgress, useStorySection } from '../components/projects/scrollStory'
import '../projects.css'

// Labels that follow parts of the 3D models (decorative; the same facts are in the copy).
const labels = [
  { anchor: 'rocket-nose', title: 'Nose cone', text: 'Shaped for supersonic flight', side: 'up', vside: 'left' },
  { anchor: 'rocket-chute', title: 'Parachutes', text: 'Drogue up high, main near the ground', side: 'down', vside: 'right' },
  { anchor: 'rocket-avionics', title: 'Avionics bay', text: 'Flight computer, sensors and radio', side: 'up', vside: 'left' },
  { anchor: 'rocket-fins', title: 'Fins', text: 'Keep it flying straight', side: 'down', vside: 'right' },
  { anchor: 'rocket-motor', title: 'Solid motor', text: 'A few seconds of serious thrust', side: 'up', vside: 'left' },
  { anchor: 'sat-wing', title: 'Solar panels', text: 'Power from sunlight', side: 'down', vside: 'right' },
  { anchor: 'sat-antenna', title: 'UHF antennas', text: 'Our link to the ground', side: 'up', vside: 'left' },
  { anchor: 'sat-payload', title: 'Seed chambers', text: 'The experiment, tucked inside', side: 'down', vside: 'left' },
  { anchor: 'guelph', title: 'Ground station', text: 'Guelph, Ontario', side: 'down', vside: 'right' },
  { anchor: 'orbit-sat', title: 'Our CubeSat', text: 'Not to scale', side: 'up', vside: 'left' }
]

const rocketParts = [
  ['Nose cone', 'shaped for supersonic flight'],
  ['Parachutes', 'a drogue opens at the top of the flight, then the main chute near the ground'],
  ['Avionics bay', 'our flight computer, sensors and radio'],
  ['Fins', 'keep the rocket flying straight'],
  ['Solid motor', 'a few seconds of serious thrust']
]

const subsystems = [
  ['Power', 'Solar panels and a battery keep everything running, even on the night side of the planet', 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z'],
  ['Attitude control', 'Sensors and actuators keep the satellite pointed the right way', 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4v5l3 2M12 3v2M21 12h-2M12 21v-2M3 12h2'],
  ['Flight computer', 'Runs the flight software, stores the data and keeps an eye on everything', 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4'],
  ['Radio', 'A UHF link to send commands up and bring experiment data down', 'M12 13v8M9 21h6M8.5 9.5a5 5 0 0 1 7 0M6 7a8.5 8.5 0 0 1 12 0M11 12a1.4 1.4 0 0 1 2 0'],
  ['Structure', 'A 3U frame tough enough to survive the shaking of launch', 'M7 3h10v18H7zM7 9h10M7 15h10M4 5h3M4 19h3M17 5h3M17 19h3'],
  ['Thermal', 'Keeps the seeds and electronics in a safe range, in sunlight and in shadow', 'M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0ZM12 9v7M17 6h3M17 10h3'],
  ['Ground station', 'Our antenna and software here in Guelph, tracking every pass', 'M5 21l4-9M19 21l-4-9M8 16h8M12 12V9M6.5 9a7.5 7.5 0 0 1 11 0M9 6.5a4 4 0 0 1 6 0'],
  ['Deorbit', 'When the mission ends, it has to come back down and burn up within five years', 'M4 6c5 0 9 4 9 9M4 10c3 0 5 2 5 5M17 13l3 3-3 3M14 16h6M4 4v16']
]

const timeline = [
  ['Now', 'Fall 2026', 'Writing our proposal and building the team', true],
  ['Deadline', 'November 19, 2026', 'Our application goes to the Canadian Space Agency'],
  ['Decision', 'Around March 2027', 'The CSA aims to announce results about 15 weeks after the deadline'],
  ['If selected', 'Build and test', 'Design, build and test the flight satellite, then hand it over for launch'],
  ['Launch', 'Into orbit', 'A ride to orbit arranged through the CSA, then mission operations from Guelph']
]

function Beat({ at = [-1, 2], className = '', children }) {
  return <div className={`beat ${className}`} style={{ '--in': at[0], '--out': at[1] }}>{children}</div>
}

export default function Projects() {
  const introRef = useStorySection('intro')
  const rocketRef = useStorySection('competition')
  const launchRef = useStorySection('launch')
  const profileRef = useStorySection('profile')
  const fieldRef = useStorySection('field')
  const cubesatRef = useStorySection('cubesat')
  const deployRef = useStorySection('deploy')
  const orbitRef = useStorySection('orbit')
  const payloadRef = useStorySection('payload')
  const systemsRef = useStorySection('systems')
  const timelineRef = useStorySection('timeline')
  // Faded-out intro links should not stay clickable or focusable.
  useSectionProgress('intro', ({ p }) => introRef.current?.querySelector('.intro-copy')?.toggleAttribute('inert', p > 0.5))

  return <div className="projects-story">
    <StoryStage labels={labels} />

    <section ref={introRef} className="chapter chapter-intro" style={{ '--h': 190 }} aria-labelledby="projects-title">
      <div className="chapter-pin">
        <Beat at={[-1, 0.5]} className="beat-center intro-copy">
          <p className="eyebrow">Guelph Rocketry projects</p>
          <h1 id="projects-title" className="mega">From the launch pad<br />to orbit</h1>
          <p className="lede">We’re building a solid rocket for Launch Canada 2027 and designing a CubeSat for the Canadian Space Agency. Scroll down and take a look inside both</p>
          <div className="story-actions"><a className="club-button gold" href="#competition">See the rocket</a><a className="story-link" href="#cubesat">See the CubeSat</a></div>
        </Beat>
        <Beat at={[-1, 0.1]} className="scroll-hint"><span aria-hidden="true" />Scroll to explore</Beat>
      </div>
    </section>

    <section ref={rocketRef} id="competition" className="chapter chapter-rocket" style={{ '--h': 400 }} aria-labelledby="rocket-title">
      <div className="chapter-pin">
        <Beat at={[-1, 0.2]} className="beat-side">
          <p className="eyebrow">01 · Solid rocket</p>
          <h2 id="rocket-title" className="giant">Competition<br />rocket</h2>
          <p>We’re designing and building a solid-fuel rocket to fly at Launch Canada 2027. The airframe, flight computer, radio telemetry and recovery system are all ours</p>
          <ul className="chip-row"><li>Launch Canada 2027</li><li>Goal: Mach 2.2</li></ul>
        </Beat>
        <Beat at={[0.36, 0.82]} className="beat-top">
          <p className="eyebrow">Take it apart</p>
          <h3 className="giant-sm">What’s inside the rocket</h3>
          <ul className="sr-only">{rocketParts.map(([name, text]) => <li key={name}>{name}: {text}</li>)}</ul>
        </Beat>
        <Beat at={[0.86, 2]} className="beat-side">
          <p className="eyebrow">Back together</p>
          <h3 className="giant-sm">Designed and built by students</h3>
          <p>Members design the rocket in SOLIDWORKS, simulate it, build it and test it before it ever sees a launch rail</p>
        </Beat>
      </div>
    </section>

    <section ref={launchRef} className="chapter chapter-launch" style={{ '--h': 280 }} aria-labelledby="launch-title">
      <div className="chapter-pin">
        <Beat at={[0.02, 0.94]} className="beat-side mach-beat">
          <p className="eyebrow">The goal</p>
          <h2 id="launch-title" className="sr-only">Our speed goal: Mach 2.2</h2>
          <MachOdometer section="launch" />
          <p>That’s more than twice the speed of sound. Getting there means the airframe, fins and electronics all have to handle some serious loads</p>
        </Beat>
      </div>
    </section>

    <section ref={profileRef} id="flight" className="chapter chapter-profile" style={{ '--h': 250 }} aria-labelledby="flight-title">
      <div className="chapter-pin">
        <div className="profile-layout">
          <div className="profile-head"><p className="eyebrow">Flight plan</p><h2 id="flight-title" className="giant-sm">How a flight goes</h2></div>
          <FlightProfile section="profile" />
        </div>
      </div>
    </section>

    <section ref={fieldRef} className="chapter chapter-field" style={{ '--h': 260 }} aria-labelledby="field-title">
      <div className="chapter-pin"><FieldFootage section="field" /></div>
    </section>

    <section className="story-section telemetry" aria-labelledby="avionics-title">
      <div className="wrap telemetry-layout">
        <div className="telemetry-copy">
          <p className="eyebrow">Avionics and software</p>
          <h2 id="avionics-title" className="giant-sm">We write our own flight software</h2>
          <p>Our flight computer is built around an STM32 microcontroller, with sensors that track altitude, acceleration and position</p>
          <p>In flight, it streams live packets over LoRa radio using MANTLE, a packet format our members designed. On the ground, our station app plots everything as it happens and can replay a flight afterward</p>
          <ul className="chip-row"><li>STM32</li><li>LoRa radio</li><li>MANTLE protocol</li><li>Ground station app</li></ul>
        </div>
        <GroundStation />
      </div>
    </section>

    <section ref={cubesatRef} id="cubesat" className="chapter chapter-cubesat" style={{ '--h': 290 }} aria-labelledby="cubesat-title">
      <div className="chapter-pin">
        <Beat at={[-1, 0.4]} className="beat-center beat-high">
          <p className="eyebrow blue">02 · CubeSat</p>
          <h2 id="cubesat-title" className="mega">A satellite<br />from Guelph</h2>
          <p className="lede">We’re applying to the Canadian Space Agency’s CUBICS program, which helps student teams design, build and fly their own small satellites</p>
        </Beat>
        <Beat at={[0.5, 2]} className="beat-side">
          <p className="eyebrow blue">Small, but real</p>
          <h3 className="giant-sm">About the size of a loaf of bread</h3>
          <p>A 3U CubeSat is roughly 10 × 10 × 34 cm, and for this program it can weigh no more than 6 kg. It still needs everything a big spacecraft has: power, a computer, a radio and a way to point itself</p>
          <ul className="stat-row">
            <li><strong><CountUp section="cubesat" at={0.52} value={3} />U</strong><span>CubeSat size</span></li>
            <li><strong><CountUp section="cubesat" at={0.52} value={34} /> cm</strong><span>Long</span></li>
            <li><strong><CountUp section="cubesat" at={0.52} value={6} /> kg</strong><span>Mass limit</span></li>
          </ul>
        </Beat>
      </div>
    </section>

    <section ref={deployRef} className="chapter chapter-deploy" style={{ '--h': 300 }} aria-labelledby="deploy-title">
      <div className="chapter-pin">
        <Beat className="beat-side">
          <p className="eyebrow blue">Unfolding</p>
          <h3 id="deploy-title" className="giant-sm">Panels out,<br />antennas up</h3>
          <p>Once it’s released into orbit, the satellite swings out its solar panels to catch the sun and unrolls its radio antennas</p>
          <ul className="sr-only"><li>Solar panels: power from sunlight</li><li>UHF antennas: our link to the ground</li><li>Seed chambers: the experiment, tucked inside</li></ul>
        </Beat>
      </div>
    </section>

    <section ref={orbitRef} className="chapter chapter-orbit" style={{ '--h': 320 }} aria-labelledby="orbit-title">
      <div className="chapter-pin">
        <Beat at={[0.1, 0.52]} className="beat-side">
          <p className="eyebrow blue">The orbit</p>
          <h3 id="orbit-title" className="giant-sm">Around the world every 95 minutes</h3>
          <p>The CSA plans to launch the CubeSats it selects into high orbits that pass near the poles, most likely sun-synchronous, about 500 to 620 km up</p>
        </Beat>
        <Beat at={[0.56, 2]} className="beat-side">
          <p className="eyebrow">Ground station</p>
          <h3 className="giant-sm">Calling home to Guelph</h3>
          <p>Every time it passes overhead, we’d talk to it from a ground station here in Guelph over a UHF radio link: commands go up, experiment data comes down</p>
          <p className="fine">Orbit and satellite not drawn to scale</p>
        </Beat>
      </div>
    </section>

    <section ref={payloadRef} id="payload" className="chapter chapter-payload" style={{ '--h': 330 }} aria-labelledby="payload-title">
      <div className="chapter-pin">
        <div className="wrap payload-layout">
          <div className="payload-copy">
            <p className="eyebrow blue">The experiment we’re proposing</p>
            <h2 id="payload-title" className="giant-sm">How do seedlings breathe in space?</h2>
            <p>Dry seeds launch sealed inside small chambers. Once in orbit, we add water. As the seeds sprout in the dark, sensors track the oxygen they use and the carbon dioxide they give off</p>
            <p>Two different water-delivery designs fly side by side, along with a chamber that has no seeds, so we can tell what the plants are doing from what the hardware is doing</p>
            <p className="fine">The plan is still being worked out with faculty, so details may change</p>
          </div>
          <SeedChambers section="payload" />
        </div>
      </div>
    </section>

    <section ref={systemsRef} className="story-section systems" aria-labelledby="systems-title">
      <div className="wrap">
        <div className="section-lead">
          <p className="eyebrow blue">Under the hood</p>
          <h2 id="systems-title" className="giant-sm">What it takes to fly</h2>
          <p>Every one of these is a subsystem students get to design, build and test</p>
        </div>
        <ul className="system-grid">
          {subsystems.map(([title, text, icon]) => <li key={title}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon} /></svg>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>)}
        </ul>
      </div>
    </section>

    <section ref={timelineRef} className="story-section timeline" aria-labelledby="timeline-title">
      <div className="wrap">
        <div className="section-lead">
          <p className="eyebrow">Where we are</p>
          <h2 id="timeline-title" className="giant-sm">The road to orbit</h2>
        </div>
        <ol className="timeline-track">
          {timeline.map(([tag, when, text, current], i) => <li key={tag} className={current ? 'is-current' : ''} style={{ '--i': i }}>
            <span className="timeline-tag">{tag}</span>
            <strong>{when}</strong>
            <p>{text}</p>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="story-section story-cta" aria-labelledby="cta-title">
      <div className="wrap cta-layout">
        <div>
          <h2 id="cta-title" className="mega">Come build<br />it with us</h2>
          <p className="lede">No experience? No problem. We need people for structures, electronics, software, plant science, radio, business and outreach</p>
          <div className="story-actions"><Link className="club-button gold" to="/join">Join the club</Link><a className="story-link" href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Say hi on Discord</a></div>
        </div>
        <article id="propulsion" className="engine-card">
          <p className="eyebrow">Also in the works</p>
          <h3>Liquid engine</h3>
          <p>We want to fire an engine we designed ourselves! The work starts with engine design and fluid simulation, plus a test stand for running it on the ground</p>
          <p className="engine-target">Engine design · Fluid dynamics · Test stand</p>
        </article>
      </div>
    </section>
  </div>
}
