import { ArrowRight } from 'lucide-react'

function ContactSection() {
  return (
    <section id="contact" className="panel contact-panel reveal">
      <div className="contact-copy">
        <p className="eyebrow">Let&apos;s connect</p>
        <h2>
          <span>Got a Question</span>
          <span>or an <em>Idea?</em></span>
        </h2>
        <p>
          We&apos;d love to hear from you. Reach out for collaborations, partnerships
          or just to say hello!
        </p>
        <a href="mailto:hello@c2clubconverge.com" className="primary-button contact-cta">
          Contact Us <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </section>
  )
}

export default ContactSection
