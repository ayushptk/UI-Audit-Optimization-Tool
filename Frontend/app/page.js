import Image from "next/image";
import Navbar from "./components/layout/Navbar";
import Herosection from "./components/Landing/Herosection";
import Feature from "./components/Landing/Feature";
import Pricing from "./components/Landing/Pricing";
import Faq from "./components/Landing/Faq";
import Footer from "./components/layout/Footer";


export default function Home() {
  return (
    <div>
      <Navbar />
      <Herosection />
      <Feature />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  );
}
