import Hero from '../components/Hero'
import Portfolio from '../components/Portfolio'
import About from '../components/About'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import Testimonials from '../components/Testimonials'
import InstagramGallery from '../components/InstagramGallery'
import StudioLocation from '../components/StudioLocation'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <About />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <StudioLocation />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}
