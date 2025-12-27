'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type LenisProviderProps = {
  children: React.ReactNode
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    gsap.registerPlugin(ScrollTrigger)
    const onLenisScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onLenisScroll)

    // Drive Lenis with GSAP's ticker to keep ScrollTrigger perfectly in sync
    const ticker = (time: number) => {
      // gsap's time is in seconds; Lenis expects ms
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(ticker)
      lenis.off('scroll', onLenisScroll)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      lenis.destroy()
    }
  }, [])

  return children as React.ReactElement
}

export default LenisProvider


