 
import dynamic from 'next/dynamic'
import MainContent from '@/components/MainContent'
import ServicesIntro from '@/components/ServicesIntro'

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
      <MainContent />
      <ServicesIntro />
      <AdvertisingSection />
      <DesignSection />
      <WebIntentSection />
      <SocialsSection />
      <IdentitiesSection />
      <VideoSection />
      <ClientsSection />
      <ContactSection />
    </>
  );
}
