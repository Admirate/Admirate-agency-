import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center font-inter"
    >
      <Image
        src="/redadmiratelogo.png"
        alt="ADMIRATE"
        width={200}
        height={60}
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
  )
}
