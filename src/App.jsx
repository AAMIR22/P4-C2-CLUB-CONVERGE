import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CalendarDays, TrendingUp, UsersRound } from 'lucide-react'
import { useRef } from 'react'
import Navbar from './components/Navbar'
import HeroScene from './components/HeroScene'
import EventsSection from './components/EventsSection'
import CommunitySection from './components/CommunitySection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import NeonCursor from './components/NeonCursor'
import { galleryItems } from './data/events'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '10+', label: 'Events hosted' },
  { value: '500+', label: 'Community members' },
  { value: '25+', label: 'Creative partners' },
  { value: '∞', label: 'New possibilities' },
]

function App() {
  const heroRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const pointerEnabled = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  useGSAP(() => {
    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
          },
        },
      )
    })

    gsap.to('.nav-shell', {
      backgroundColor: 'rgba(8, 11, 21, 0.7)',
      borderColor: 'rgba(196, 132, 252, 0.28)',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 18px 40px rgba(10, 10, 20, 0.4)',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=120',
        scrub: true,
      },
    })
  }, [])

  const handlePointerMove = (event) => {
    if (!pointerEnabled.current || event.pointerType === 'touch') return
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return

    const offsetX = (event.clientX - rect.left) / rect.width - 0.5
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5

    pointerRef.current.x = offsetX * 2
    pointerRef.current.y = offsetY * 2
  }

  return (
    <div id="top" className="page-shell">
      <NeonCursor />
      <Navbar />

      <main className="main-content">
        <div className="content-grid top-grid">
          <section
            id="home"
            ref={heroRef}
            className="panel hero reveal"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => {
              pointerRef.current.x = 0
              pointerRef.current.y = 0
            }}
          >
            <div className="hero-copy hero-foreground">
              <p className="eyebrow">People • Ideas • Experiences</p>
              <h1>
                <span>C2 CLUB</span>
                <span className="heading-block">CONVERGE</span>
              </h1>
              <p className="lead">
                A community where ideas, people and possibilities meet.
              </p>

              <div className="cta-row">
                <a href="#events" className="primary-button">
                  Explore Events
                </a>
                <a href="#about" className="secondary-button">
                  Learn More
                </a>
              </div>

              <div className="stats-grid" aria-label="C2 Club Converge overview metrics">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual hero-scene-layer" aria-label="C2 Club Converge 3D scene">
              <HeroScene pointerRef={pointerRef} />
            </div>
          </section>

          <section id="about" className="panel about-section reveal">
            <div className="about-content">
              <div className="about-copy">
                <p className="eyebrow">About</p>
                <h2>
                  <span>More Than</span>
                  <span>Just <em>Events</em></span>
                </h2>
                <p>
                  C2 Club Converge is a community of curious minds, creatives, and
                  change-makers. We bring people together through events, experiences
                  and meaningful conversations.
                </p>
              </div>

              <div className="about-cards">
                <article className="info-card">
                  <span className="icon-badge"><UsersRound aria-hidden="true" /></span>
                  <div>
                    <strong>Community</strong>
                    <span>People with shared passions.</span>
                  </div>
                </article>
                <article className="info-card">
                  <span className="icon-badge"><CalendarDays aria-hidden="true" /></span>
                  <div>
                    <strong>Events</strong>
                    <span>Experiences that inspire.</span>
                  </div>
                </article>
                <article className="info-card">
                  <span className="icon-badge"><TrendingUp aria-hidden="true" /></span>
                  <div>
                    <strong>Growth</strong>
                    <span>Learn, collaborate and create.</span>
                  </div>
                </article>
              </div>
            </div>

            <div className="about-visual" aria-hidden="true">
              <svg className="about-orbit-lines" viewBox="0 0 600 520" fill="none">
                <ellipse cx="300" cy="260" rx="228" ry="110" transform="rotate(-31 300 260)" />
                <ellipse cx="300" cy="260" rx="215" ry="142" transform="rotate(32 300 260)" />
                <ellipse cx="300" cy="260" rx="183" ry="204" transform="rotate(72 300 260)" />
              </svg>
              <span className="about-tag about-tag-ideas">Ideas</span>
              <span className="about-tag about-tag-people">People</span>
              <span className="about-tag about-tag-experiences">Experiences</span>
            </div>
          </section>
        </div>

        <EventsSection />

        <div className="content-grid lower-grid">
          <section id="gallery" className="panel gallery-section reveal">
            <div className="section-header">
              <div>
                <p className="eyebrow">Experiences</p>
                <h2>Moments that stay with you.</h2>
              </div>
              <a href="#contact" className="text-button">
                View gallery <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="gallery-grid">
              <motion.div
                className="feature-card feature-tall"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <div className="feature-info">
                  <p className="eyebrow">Live atmosphere</p>
                  <h3>Immersive nights designed for connection.</h3>
                </div>
              </motion.div>

              <div className="mini-gallery">
                {galleryItems.slice(1).map((item) => (
                  <motion.div
                    key={item.title}
                    className={`mini-card-visual ${item.className}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mini-visual-content">
                      <span>{item.type}</span>
                      <strong>{item.title}</strong>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <CommunitySection />

        <div className="content-grid bottom-grid">
          <div className="right-stack">
            <ContactSection />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
