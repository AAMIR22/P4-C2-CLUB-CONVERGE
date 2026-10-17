import { ArrowRight } from 'lucide-react'

function CommunitySection() {
  return (
    <section className="panel community-section reveal" aria-labelledby="community-heading">
      <div className="community-copy">
        <p className="eyebrow">Join the community</p>
        <h2 id="community-heading">
          <span>Be Part of</span>
          <span><em>What&apos;s Next</em></span>
        </h2>
        <p>
          Join a growing community of innovators, creators and doers. Discover events,
          meet amazing people and create your own journey with C2 Club Converge.
        </p>
        <a href="#contact" className="primary-button community-cta">
          Join the Club <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </section>
  )
}

export default CommunitySection
