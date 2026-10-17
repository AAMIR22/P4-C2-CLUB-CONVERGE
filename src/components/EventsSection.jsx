import { motion } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { featuredEvents } from '../data/events'

function EventsSection() {
  const eventsViewport = useRef(null)

  const moveEvents = (direction) => {
    const viewport = eventsViewport.current
    const card = viewport?.querySelector('.event-card')
    if (!viewport || !card) return

    const gap = Number.parseFloat(getComputedStyle(viewport).columnGap) || 0
    viewport.scrollBy({
      left: (card.getBoundingClientRect().width + gap) * direction,
      behavior: 'smooth',
    })
  }

  return (
    <section id="events" className="panel events-section reveal">
      <div className="events-header">
        <div>
          <p className="eyebrow">Upcoming events</p>
          <h2>
            <span>Events That</span>
            <span>Bring Us <em>Together</em></span>
          </h2>
        </div>
        <div className="events-controls">
          <button type="button" className="events-arrow" aria-label="Previous events" onClick={() => moveEvents(-1)}>
            <ArrowLeft aria-hidden="true" size={18} />
          </button>
          <button type="button" className="events-arrow" aria-label="Next events" onClick={() => moveEvents(1)}>
            <ArrowRight aria-hidden="true" size={18} />
          </button>
          <a href="#contact" className="events-view-all">
            <span>View All Events</span>
            <ArrowRight aria-hidden="true" size={19} />
          </a>
        </div>
      </div>

      <div className="event-grid" ref={eventsViewport} aria-label="Featured upcoming events">
        {featuredEvents.map((event, index) => {
          const [venue, ...scheduleParts] = event.meta.split(' • ')
          const schedule = scheduleParts.join(' • ')

          return (
            <motion.article
              key={event.id}
              className={`event-card event-photo-${index + 1} accent-${event.accent}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="event-photo" aria-hidden="true" />
              <span className="event-date-badge">
                <small>Schedule</small>
                <strong>{scheduleParts[0] || 'Upcoming'}</strong>
              </span>
              <div className="event-card-body">
                <span className="event-category">C2 Club Event</span>
                <h3>{event.title}</h3>
                <p>{event.blurb}</p>
                <div className="event-meta">
                  <span><CalendarDays aria-hidden="true" size={15} />{schedule}</span>
                  <span><MapPin aria-hidden="true" size={15} />{venue}</span>
                </div>
                <a className="event-action" href="#contact" aria-label={`Ask about ${event.title}`}>
                  <ArrowUpRight aria-hidden="true" size={19} />
                </a>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default EventsSection
