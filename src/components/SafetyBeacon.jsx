import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SafetyBeacon = ({ isVisible = false, userLocation = "Delhi" }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const activateBeacon = async () => {
    setIsActivating(true);
    
    try {
      // Simulate sending notifications to emergency contacts
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
      const userName = localStorage.getItem('username') || 'User';
      
      // Mock notification sending
      console.log(`Safety beacon activated for ${userName} in ${userLocation}`);
      console.log('Notifying emergency contacts:', emergencyContacts);
      
      setIsActivated(true);
      toast.success('Safety beacon activated! Emergency contacts have been notified.', {
        duration: 5000,
        icon: '🚨',
      });
      
      // Store beacon activation
      const beaconData = {
        timestamp: new Date().toISOString(),
        location: userLocation,
        contacts: emergencyContacts.length,
      };
      localStorage.setItem('lastBeaconActivation', JSON.stringify(beaconData));
      
    } catch (error) {
      toast.error('Failed to activate safety beacon. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-red-500 text-white rounded-2xl p-6 shadow-2xl max-w-sm mx-4">
          <div className="text-center">
            <div className="text-4xl mb-3">🚨</div>
            <h3 className="text-xl font-bold mb-2">Emergency Alert Active</h3>
            <p className="text-red-100 text-sm mb-4">
              A severe alert is active in your area. Let your emergency contacts know you're safe.
            </p>
            
            {!isActivated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={activateBeacon}
                disabled={isActivating}
                className="w-full bg-white text-red-500 font-bold py-3 px-6 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActivating ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Activating...
                  </div>
                ) : (
                  'I Am Safe 🛡️'
                )}
              </motion.button>
            ) : (
              <div className="bg-green-500 text-white py-3 px-6 rounded-xl font-bold">
                ✅ Safety Beacon Activated
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SafetyBeacon;