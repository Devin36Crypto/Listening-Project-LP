import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ChatWidget from "./components/ChatWidget";
import TTSDemo from "./components/TTSDemo";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <TTSDemo />
        <ChatWidget />
      </main>
      <Footer />
    </div>
  );
}
