// src/utils/LiveLocationService.ts

import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';

let trackingInterval: number | null = null;

/**
 * Start live location tracking.
 * @param phoneNumber - User's phone number (must be passed explicitly).
 */
export const startLiveLocationTracking = async (phoneNumber: string): Promise<void> => {
  if (!phoneNumber) {
    console.error('❌ Phone number is required to start tracking.');
    return;
  }

  console.log(`📍 Starting live location tracking for ${phoneNumber}`);

  trackingInterval = BackgroundTimer.setInterval(() => {
    console.log("⏱ Background interval tick");
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const timestamp = Date.now();
        console.log("🚀 Writing to Firestore:", {
          phoneNumber,
          latitude,
          longitude,
          timestamp,
        });
        try {
          await setDoc(doc(db, 'liveLocations', phoneNumber), {
            phoneNumber,
            latitude,
            longitude,
            timestamp,
          });

          console.log(`✅ Location updated for ${phoneNumber}`);
        } catch (error) {
          console.error('🔥 Failed to update Firestore location:', error);
        }
      },
      (error) => {
        console.error('❌ Error getting location:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }, 15000);
};

/**
 * Stop the live location tracking.
 */
export const stopLiveLocationTracking = () => {
  if (trackingInterval !== null) {
    BackgroundTimer.clearInterval(trackingInterval);
    trackingInterval = null;
    console.log('🛑 Stopped live location tracking');
  }
};
