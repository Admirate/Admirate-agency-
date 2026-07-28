import Link from 'next/link'
import Image from 'next/image'
import { asset } from '@/lib/cdn'
import { SITE, telHref } from '@/lib/seo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
    <main
      className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center"
    >
      <Image
        src={asset('admirate logo.webp')}
        alt="ADMIRATE"
        width={213}
        height={46}
        className="mb-12 object-contain"
        priority
      />
      <h1
        className="text-6xl sm:text-7xl md:text-8xl font-black text-red-600 mb-4 font-integral"
      >
        404
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-md">
        This page doesn&apos;t exist. But great ideas do — let&apos;s get you back.
      </p>
      <Link
        href="/"
        className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300"
      >
        Back to Home
      </Link>
    </main>

    {/* Every other page carries the NAP line and the legal links; this one was
        the exception. A 404 is a page Google crawls like any other, and it is
        a page a lost visitor lands on — both want a way onward. Built from
        SITE rather than the shared raw-HTML footer, because this page is
        Tailwind-styled and that stylesheet is written for RawPage. */}
    <footer className="border-t border-gray-200 px-6 py-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[10.5px] uppercase tracking-[.2em] text-gray-400">
        <div>© 2026 {SITE.name}.IN</div>
        <div>
          {SITE.area}, {SITE.city} ·{' '}
          <a href={telHref} className="hover:text-red-600">
            {SITE.phone.replace('-', ' ')}
          </a>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/privacy-policy" className="hover:text-red-600">
            Privacy Policy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="hover:text-red-600">
            Terms
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/sitemap" className="hover:text-red-600">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
    </div>
  )
}
