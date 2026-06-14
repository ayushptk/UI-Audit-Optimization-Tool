import Image from "next/image";
import Navbar from "./components/layout/Navbar";
import Herosection from "./components/Landing/Herosection";
import Feature from "./components/Landing/Feature";
import Pricing from "./components/Landing/Pricing";
import Faq from "./components/Landing/Faq";
import Footer from "./components/layout/Footer";
import IntroLayout from "./components/Landing/IntroScreen";


export default function Home() {
  return (
    <div>
      <IntroLayout>
      <Navbar />
      <section id="home">
        <Herosection />
      </section>
      <section id="features">
        <Feature />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="faq">
        <Faq />
      </section>
      <Footer />
      </IntroLayout>
    </div>
  );
}
