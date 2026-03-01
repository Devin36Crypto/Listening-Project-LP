import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

export default function DeviceCheck() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Simulate checking for existing device ID in local storage
    const deviceId = localStorage.getItem("device_id");
    
    // In a real app, we would check this against a backend database
    // For this demo, we'll just set a dummy ID if one doesn't exist
    if (!deviceId) {
      const newId = crypto.randomUUID();
      localStorage.setItem("device_id", newId);
    }
  }, []);

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-red-500/10 border border-red-500/20 backdrop-blur-md p-4 rounded-xl z-50 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-200">Device Limit Reached</h4>
            <p className="text-xs text-red-300/80 mt-1">
              Your subscription is active on another device. Please log out there to use the app here.
            </p>
          </div>
          <button 
            onClick={() => setShowWarning(false)}
            className="text-red-400 hover:text-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
