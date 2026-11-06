import { Link } from 'react-router-dom'
import StoryStage from '../components/projects/StoryStage'
import MachOdometer from '../components/projects/MachOdometer'
import FlightProfile from '../components/projects/FlightProfile'
import FieldFootage from '../components/projects/FieldFootage'
import GroundStation from '../components/projects/GroundStation'
import { useSectionProgress, useStorySection } from '../components/projects/scrollStory'
import '../projects.css'

// Labels that follow parts of the 3D models (decorative; the same info is in the copy).
const labels = [
  { anchor: 'rocket-nose', title: 'Nose cone', text: 'Shaped for going supersonic', side: 'up', vside: 'left' },
  { anchor: 'rocket-chute', title: 'Parachutes', text: 'Bring it home in one piece', side: 'down', vside: 'right' },
  { anchor: 'rocket-avionics', title: 'Av bay', text: 'Flight computer, sensors and radio', side: 'up', vside: 'right' },
  { anchor: 'rocket-fins', title: 'Fins', text: 'Keep it flying straight', side: 'down', vside: 'right' },
  { anchor: 'rocket-motor', title: 'Solid motor', text: 'Does all the pushing', side: 'up', vside: 'left' },
  { anchor: 'sat-wing', title: 'Solar panels', text: 'Power from the sun', side: 'down', vside: 'right' },
  { anchor: 'sat-antenna', title: 'UHF antennas', text: 'How we talk to it', side: 'up', vside: 'left' },
  { anchor: 'sat-payload', title: 'Experiment', text: 'Our plant experiment', side: 'down', vside: 'left' },
  { anchor: 'guelph', title: 'Guelph ground station', text: 'The circle is our radio range', side: 'down', vside: 'right' },
  { anchor: 'orbit-sat', title: 'Our CubeSat', text: 'Way bigger than real life', side: 'up', vside: 'left' }
]

const rocketParts = [
  ['Nose cone', 'shaped for going supersonic'],
  ['Parachutes', 'they come out of the bay under the nose cone and bring it home in one piece'],
  ['Av bay', 'the flight computer, sensors and radio, right below the parachute bay'],
  ['Fins', 'keep it flying straight'],
  ['Solid motor', 'does all the pushing']
]

const subsystems = [
  ['Power', 'Solar panels and a battery keep it running, even on the dark side of the planet'],
  ['Attitude control', 'Sensors and little actuators that keep it pointed the right way'],
  ['Flight computer', 'The brain. It runs the flight software and stores all the data'],
  ['Radio', 'Our UHF link for sending commands up and getting data down'],
  ['Structure', 'A 3U frame that has to survive getting shaken around on launch'],
  ['Thermal', 'Keeps everything from getting too hot or too cold, in sunlight and in shadow'],
  ['Ground station', 'Our antenna and software here in Guelph that track every pass'],
  ['Deorbit', 'When the mission’s over it has to come back down and burn up within 5 years']
]

const timeline = [
  ['Now', 'Fall 2026', 'Writing our proposal and putting the team together', true],
  ['Deadline', 'November 19, 2026', 'Our application goes in to the Canadian Space Agency'],
  ['Decision', 'Around March 2027', 'The CSA should let us know if we’re in (they aim for about 15 weeks after the deadline)'],
  ['If we’re picked', 'Build and test', 'We design, build and test the real satellite'],
  ['Launch', 'Into orbit', 'The CSA sorts out our ride to space, then we fly the mission from Guelph']
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
  const systemsRef = useStorySection('systems')
  const timelineRef = useStorySection('timeline')
  // Faded-out intro links shouldn't stay clickable or focusable.
  useSectionProgress('intro', ({ p }) => introRef.current?.querySelector('.intro-copy')?.toggleAttribute('inert', p > 0.5))

  return <div className="projects-story">
    <StoryStage labels={labels} />

    <section ref={introRef} className="chapter chapter-intro" style={{ '--h': 190 }} aria-labelledby="projects-title">
      <div className="chapter-pin">
        <Beat at={[-1, 0.5]} className="beat-center intro-copy">
          <h1 id="projects-title" className="mega">Here’s what<br />we’re building</h1>
          <p className="lede">A solid rocket for Launch Canada 2027 and a CubeSat we’re pitching to the Canadian Space Agency. Scroll down to check them out!</p>
          <div className="story-actions"><a className="club-button gold" href="#competition">See the rocket</a><a className="story-link" href="#cubesat">See the CubeSat</a></div>
        </Beat>
        <Beat at={[-1, 0.1]} className="scroll-hint">Scroll down</Beat>
      </div>
    </section>

    <section ref={rocketRef} id="competition" className="chapter chapter-rocket" style={{ '--h': 400 }} aria-labelledby="rocket-title">
      <div className="chapter-pin">
        <Beat at={[-1, 0.2]} className="beat-side">
          <h2 id="rocket-title" className="giant">Our competition rocket</h2>
          <p>This is the solid rocket we’re taking to Launch Canada 2027, and we’re aiming for Mach 2.2! We build the airframe, flight computer, radio and recovery system all ourselves</p>
        </Beat>
        <Beat at={[0.36, 0.82]} className="beat-top">
          <h3 className="giant-sm">Let’s take it apart</h3>
          <ul className="sr-only">{rocketParts.map(([name, text]) => <li key={name}>{name}: {text}</li>)}</ul>
        </Beat>
        <Beat at={[0.86, 2]} className="beat-side">
          <h3 className="giant-sm">Built by students</h3>
          <p>We design everything in SOLIDWORKS, run sims on it, then build it and test it before it goes anywhere near the launch rail</p>
        </Beat>
      </div>
    </section>

    <section ref={launchRef} className="chapter chapter-launch" style={{ '--h': 280 }} aria-labelledby="launch-title">
      <div className="chapter-pin">
        <Beat at={[0.02, 0.94]} className="beat-side mach-beat">
          <h2 id="launch-title" className="speed-goal">Our speed goal</h2>
          <MachOdometer section="launch" />
          <p>That’s more than twice the speed of sound! Everything on this rocket has to be built to handle it</p>
        </Beat>
      </div>
    </section>

    <section ref={profileRef} id="flight" className="chapter chapter-profile" style={{ '--h': 340 }} aria-labelledby="flight-title">
      <div className="chapter-pin">
        <div className="profile-layout">
          <div className="profile-head">
            <h2 id="flight-title" className="giant-sm">How a flight goes</h2>
          </div>
          <FlightProfile section="profile" />
          <p className="fine flight-note">This is a sim of an example flight (4 in rocket on an N motor) with real physics: standard atmosphere, drag that changes with speed, a drogue at the top and the main at 457 m. Our real numbers will change as the design does</p>
        </div>
      </div>
    </section>

    <section ref={fieldRef} className="chapter chapter-field" style={{ '--h': 260 }} aria-labelledby="field-title">
      <div className="chapter-pin"><FieldFootage section="field" /></div>
    </section>

    <section className="story-section telemetry" aria-labelledby="avionics-title">
      <div className="wrap telemetry-layout">
        <div className="telemetry-copy">
          <h2 id="avionics-title" className="giant-sm">We write our own flight software</h2>
          <p>Our flight computer runs on an STM32 microcontroller, with sensors that keep track of altitude, acceleration and position</p>
          <p>During the flight it sends live data down over LoRa radio using MANTLE, a packet format we made ourselves. Back on the ground, our ground station app plots everything live and can replay the flight after</p>
        </div>
        <GroundStation />
      </div>
    </section>

    <section ref={cubesatRef} id="cubesat" className="chapter chapter-cubesat" style={{ '--h': 290 }} aria-labelledby="cubesat-title">
      <div className="chapter-pin">
        <Beat at={[-1, 0.4]} className="beat-center beat-high">
          <h2 id="cubesat-title" className="mega">We’re building<br />a satellite!</h2>
          <p className="lede">We’re applying to the Canadian Space Agency’s CUBICS program, which helps student teams design, build and launch their own CubeSats</p>
        </Beat>
        <Beat at={[0.5, 2]} className="beat-side">
          <h3 className="giant-sm">About the size of a loaf of bread</h3>
          <p>It’s a 3U CubeSat, so roughly 10 × 10 × 34 cm, and it can’t weigh more than 6 kg. It still needs everything a big satellite has though: power, a computer, a radio and a way to point itself</p>
        </Beat>
      </div>
    </section>

    <section ref={deployRef} className="chapter chapter-deploy" style={{ '--h': 300 }} aria-labelledby="deploy-title">
      <div className="chapter-pin">
        <Beat className="beat-side">
          <h3 id="deploy-title" className="giant-sm">Then it unfolds</h3>
          <p>Once it’s out in space, it swings its solar panels out to soak up sunlight and unrolls its radio antennas</p>
          <ul className="sr-only"><li>Solar panels: power from the sun</li><li>UHF antennas: how we talk to it</li><li>Experiment: our plant experiment rides inside</li></ul>
        </Beat>
      </div>
    </section>

    <section ref={orbitRef} className="chapter chapter-orbit" style={{ '--h': 380 }} aria-labelledby="orbit-title">
      <div className="chapter-pin">
        <Beat at={[0.1, 0.38]} className="beat-side">
          <h3 id="orbit-title" className="giant-sm">Around the world every 95 minutes</h3>
          <p>The CSA plans to launch the CubeSats it picks into orbits that go over the poles (most likely sun-synchronous), around 500 to 620 km up. The orbit here is drawn to scale at 550 km</p>
        </Beat>
        <Beat at={[0.42, 0.6]} className="beat-side">
          <h3 className="giant-sm">A little plant experiment</h3>
          <p>It’ll carry a small plant biology experiment. We’re still working out the details with our profs, so stay tuned!</p>
        </Beat>
        <Beat at={[0.64, 2]} className="beat-side">
          <h3 className="giant-sm">Talking to it from Guelph</h3>
          <p>We can only talk to it while it’s inside that circle around Guelph, which is up to about 8 minutes per pass. That’s when we send commands up and pull data down over UHF radio</p>
          <p className="fine">The satellite is drawn way bigger than real life so you can actually see it</p>
        </Beat>
      </div>
    </section>

    <section ref={systemsRef} className="story-section systems" aria-labelledby="systems-title">
      <div className="wrap">
        <div className="section-lead">
          <h2 id="systems-title" className="giant-sm">What goes into a satellite</h2>
          <p>Each of these is a part of the build you could work on</p>
        </div>
        <dl className="system-list">
          {subsystems.map(([title, text]) => <div key={title}>
            <dt>{title}</dt>
            <dd>{text}</dd>
          </div>)}
        </dl>
      </div>
    </section>

    <section ref={timelineRef} className="story-section timeline" aria-labelledby="timeline-title">
      <div className="wrap">
        <div className="section-lead">
          <h2 id="timeline-title" className="giant-sm">Where we’re at</h2>
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
          <h2 id="cta-title" className="mega">Come build<br />it with us!</h2>
          <p className="lede">Never done any of this before? That’s totally fine! We need people for structures, electronics, software, plant science, radio, business and outreach</p>
          <div className="story-actions"><Link className="club-button gold" to="/join">Join the club</Link><a className="story-link" href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Come say hi on Discord</a></div>
        </div>
        <article id="propulsion" className="engine-card">
          <h3>Also in the works: a liquid engine</h3>
          <p>We want to fire an engine we designed ourselves! The work starts with engine design and fluid simulation, plus a test stand for running it on the ground</p>
        </article>
      </div>
    </section>
  </div>
}
