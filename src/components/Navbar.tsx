import { motion } from "motion/react";
import { Menu, X, Headphones } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Headphones className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight font-display">Listening Project</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="hover:text-indigo-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Features</a>
              <a href="#demo" className="hover:text-indigo-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">AI Demo</a>
              <a href="#download" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">Download App</a>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-400">Features</a>
            <a href="#demo" className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-400">AI Demo</a>
            <a href="#download" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-indigo-600/20 text-indigo-400">Download App</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
