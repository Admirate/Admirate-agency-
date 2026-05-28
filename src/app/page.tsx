 
import dynamic from 'next/dynamic'
import MainContent from '@/components/MainContent'
import ServicesIntro from '@/components/ServicesIntro'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

const AdvertisingSection = dynamic(() => import('@/components/AdvertisingSection'))
const DesignSection = dynamic(() => import('@/components/DesignSection'))
const WebIntentSection = dynamic(() => import('@/components/WebIntentSection'))
const SocialsSection = dynamic(() => import('@/components/SocialsSection'))
const IdentitiesSection = dynamic(() => import('@/components/IdentitiesSection'))
const VideoSection = dynamic(() => import('@/components/VideoSection'))
const ClientsSection = dynamic(() => import('@/components/ClientsSection'))
const ContactSection = dynamic(() => import('@/components/ContactSection'))

export default function Home() {
  return (
    <>
      <header>
        <ErrorBoundary>
          <MainContent />
        </ErrorBoundary>
      </header>
      <main id="main-content">
        <ErrorBoundary>
          <ServicesIntro />
        </ErrorBoundary>
        <ErrorBoundary>
          <AdvertisingSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <DesignSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <WebIntentSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <SocialsSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <IdentitiesSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <VideoSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <ClientsSection />
        </ErrorBoundary>
      </main>
      <footer>
        <ErrorBoundary>
          <ContactSection />
        </ErrorBoundary>
      </footer>
    </>
  );
}
