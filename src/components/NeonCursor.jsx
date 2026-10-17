import { useEffect, useRef } from 'react'
import './NeonCursor.css'

const interactiveSelector =
  'a, button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [role="button"], [role="link"], .event-card'

function NeonCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!cursor || !finePointer.matches) return undefined

    const orb = cursor.querySelector('.neon-cursor-orb')
    const halo = cursor.querySelector('.neon-cursor-halo')
    const glow = cursor.querySelector('.neon-cursor-glow')
    const trails = [...cursor.querySelectorAll('.neon-cursor-trail')]
    const positions = trails.map(() => ({ x: 0, y: 0 }))
    const pointer = { x: 0, y: 0 }
    let orbPosition = { x: 0, y: 0 }
    let haloPosition = { x: 0, y: 0 }
    let glowPosition = { x: 0, y: 0 }
    let trailOpacity = 0
    let targetTrailOpacity = 0
    let frameId = 0
    let previousTime = 0
    let previousPointerTime = 0
    let lastPointerTime = 0
    let visible = false
    let interactive = false

    const place = (element, position) => {
      element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
    }

    const scheduleFrame = () => {
      if (!frameId) frameId = window.requestAnimationFrame(animate)
    }

    const setInteractive = (target) => {
      const element = target instanceof Element ? target : target?.parentElement
      const nextInteractive = Boolean(element?.closest(interactiveSelector))
      if (interactive === nextInteractive) return
      interactive = nextInteractive
      cursor.classList.toggle('is-interactive', interactive)
    }

    const hideCursor = () => {
      visible = false
      interactive = false
      cursor.classList.remove('is-visible', 'is-interactive')
      document.body.classList.remove('neon-cursor-active')
    }

    function animate(time) {
      frameId = 0
      if (!visible) return

      const elapsed = previousTime ? Math.min(time - previousTime, 48) : 16
      previousTime = time
      const instant = reducedMotion.matches
      const follow = (milliseconds) => 1 - Math.exp(-elapsed / milliseconds)
      orbPosition = pointer
      const haloEase = instant ? 1 : follow(28)
      haloPosition = {
        x: haloPosition.x + (pointer.x - haloPosition.x) * haloEase,
        y: haloPosition.y + (pointer.y - haloPosition.y) * haloEase,
      }
      const glowEase = instant ? 1 : follow(36)
      glowPosition = {
        x: glowPosition.x + (pointer.x - glowPosition.x) * glowEase,
        y: glowPosition.y + (pointer.y - glowPosition.y) * glowEase,
      }

      place(halo, haloPosition)
      place(glow, glowPosition)

      const trailActivity = Math.max(0, 1 - (time - lastPointerTime) / 65)
      const activeTrailTarget = instant ? 0 : targetTrailOpacity * trailActivity
      const trailEase = instant ? 1 : follow(30)
      trailOpacity += (activeTrailTarget - trailOpacity) * trailEase

      let trailTarget = orbPosition
      trails.forEach((trail, index) => {
        const position = positions[index]
        const trailEaseAmount = instant ? 1 : follow(34 + index * 14)
        position.x += (trailTarget.x - position.x) * trailEaseAmount
        position.y += (trailTarget.y - position.y) * trailEaseAmount
        place(trail, position)
        trail.style.opacity = String(trailOpacity * [0.55, 0.28][index])
        trailTarget = position
      })

      const stillMoving =
        Math.abs(orbPosition.x - haloPosition.x) > 0.12 ||
        Math.abs(orbPosition.y - haloPosition.y) > 0.12 ||
        Math.abs(orbPosition.x - glowPosition.x) > 0.12 ||
        Math.abs(orbPosition.y - glowPosition.y) > 0.12 ||
        trailOpacity > 0.006

      if (stillMoving) scheduleFrame()
      else {
        previousTime = 0
        positions.forEach((position) => Object.assign(position, pointer))
        trails.forEach((trail) => place(trail, pointer))
      }
    }

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') return

      const now = performance.now()
      const distance = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y)
      const speed = previousPointerTime ? distance / Math.max(now - previousPointerTime, 1) : 0
      pointer.x = event.clientX
      pointer.y = event.clientY
      previousPointerTime = now
      lastPointerTime = now
      targetTrailOpacity = reducedMotion.matches ? 0 : Math.min(speed / 2.8, 0.22)
      setInteractive(event.target)

      if (!visible) {
        visible = true
        orbPosition = { ...pointer }
        haloPosition = { ...pointer }
        glowPosition = { ...pointer }
        positions.forEach((position) => Object.assign(position, pointer))
        place(orb, orbPosition)
        place(halo, haloPosition)
        place(glow, glowPosition)
        trails.forEach((trail) => {
          trail.style.opacity = '0'
        })
        trailOpacity = 0
        cursor.classList.add('is-visible')
        document.body.classList.add('neon-cursor-active')
      }

      orbPosition = { ...pointer }
      place(orb, orbPosition)

      if (reducedMotion.matches || document.hidden) {
        if (frameId) window.cancelAnimationFrame(frameId)
        frameId = 0
        orbPosition = { ...pointer }
        haloPosition = { ...pointer }
        glowPosition = { ...pointer }
        positions.forEach((position) => Object.assign(position, pointer))
        place(orb, orbPosition)
        place(halo, haloPosition)
        place(glow, glowPosition)
        trails.forEach((trail) => {
          trail.style.opacity = '0'
        })
        trailOpacity = 0
        targetTrailOpacity = 0
        previousTime = 0
        return
      }

      scheduleFrame()
    }

    const handlePointerOut = (event) => {
      if (event.relatedTarget === null) hideCursor()
    }

    const handleWindowBlur = () => hideCursor()

    const handleResize = () => {
      pointer.x = Math.min(pointer.x, window.innerWidth)
      pointer.y = Math.min(pointer.y, window.innerHeight)
      if (visible) {
        orbPosition = { ...pointer }
        place(orb, orbPosition)
        scheduleFrame()
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerout', handlePointerOut, { passive: true })
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('resize', handleResize)
      if (frameId) window.cancelAnimationFrame(frameId)
      document.body.classList.remove('neon-cursor-active')
    }
  }, [])

  return (
    <div ref={cursorRef} className="neon-cursor" aria-hidden="true">
      <span className="neon-cursor-glow" />
      <span className="neon-cursor-trail" />
      <span className="neon-cursor-trail" />
      <span className="neon-cursor-halo" />
      <span className="neon-cursor-orb" />
    </div>
  )
}

export default NeonCursor
