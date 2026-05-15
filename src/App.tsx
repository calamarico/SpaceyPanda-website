import { About } from "./components/About";
import { Blog } from "./components/Blog";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Instagram } from "./components/Instagram";
import { Navbar } from "./components/Navbar";
import { Releases } from "./components/Releases";
import { StarsCanvas } from "./components/StarsCanvas";
import { Streaming } from "./components/Streaming";
import { useScrollReveal } from "./lib/useScrollReveal";

function App() {
  useScrollReveal();

  return (
    <>
      <div className="sp-cosmos" aria-hidden />
      <StarsCanvas />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Releases />
        <Streaming />
        <Blog />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}

export default App;
