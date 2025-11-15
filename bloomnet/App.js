import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bell, Plus, MapPin, Package, Clock, Plane, User, X, CheckCircle, AlertTriangle, Truck, Star, MessageCircle, Volume2 } from 'lucide-react';

const BloomNet = () => {
  // --- TOPIC 2: User Account System & State Initialization ---
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('donor');
  const [selectedLang, setSelectedLang] = useState('en');
  const [showDroneModal, setShowDroneModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [notifications, setNotifications] = useState([]); // TOPIC 6: Smart Notification Engine
  const [showAIAssistant, setShowAIAssistant] = useState(false); // TOPIC 10: AI Assistant
  const [aiQuery, setAiQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 30.7333, lon: 76.7794, name: 'Simulated Central Hub' });
  const [locationError, setLocationError] = useState(false);

  // Simulated Food Data with Location (for real-time matching)
  const [foodItems, setFoodItems] = useState([
    {
      id: 1, name: 'Vegetable Biryani', type: 'Cooked', quantity: '50', unit: 'Plates',
      expiry: 2, status: 'Fresh', safetyScore: 95, donor: 'Delhi Community Kitchen',
      location: 'Connaught Place, Delhi', packType: 'Bulk Pack', claimed: false, volunteer: null, lat: 30.735, lon: 76.775,
    },
    {
      id: 2, name: 'Fresh Bread Loaves', type: 'Bakery', quantity: '30', unit: 'Packs',
      expiry: 6, status: 'Fresh', safetyScore: 90, donor: 'Sunrise Bakery',
      location: 'Karol Bagh, Delhi', packType: 'Family Pack', claimed: false, volunteer: null, lat: 30.750, lon: 76.800,
    },
    {
      id: 3, name: 'Rice & Dal', type: 'Cooked', quantity: '100', unit: 'Plates',
      expiry: 1, status: 'Share Soon', safetyScore: 75, donor: 'Golden Temple Langar',
      location: 'Amritsar, Punjab (Disaster Zone)', packType: 'Bulk Pack', claimed: false, volunteer: null, lat: 30.720, lon: 76.760,
    },
  ]);

  const volunteers = [
    { id: 1, name: 'Raj Kumar', distance: 2.5, workload: 2, vehicle: 'Bike', rating: 4.8 },
    { id: 2, name: 'Priya Sharma', distance: 4.2, workload: 1, vehicle: 'Car', rating: 4.9 },
    { id: 3, name: 'Amit Singh', distance: 1.8, workload: 3, vehicle: 'Van', rating: 4.7 }
  ];

  // TOPIC 5: Community Kitchen Alert System
  const kitchenAlerts = [
    { id: 1, item: 'Dal', quantity: '50 KG', urgency: 'High', kitchen: 'Community Kitchen Delhi' },
    { id: 2, item: 'Rice', quantity: '30 KG', urgency: 'Medium', kitchen: 'Hope Foundation' }
  ];

  // TOPIC 9: Hunger Heatmap
  const hungerZones = [
    { id: 1, area: 'Old Delhi', severity: 'High', population: 5000 },
    { id: 2, area: 'East Delhi', severity: 'Medium', population: 3000 },
    { id: 3, area: 'Amritsar Rural', severity: 'High', population: 4500 }
  ];

  // TOPIC 12: Multi-Language Support
  const translations = useMemo(() => ({
    en: { title: 'BloomNet', tagline: 'Zero Hunger, Zero Waste', claim: 'Claim Food' },
    hi: { title: 'ब्लूमनेट', tagline: 'शून्य भूख, शून्य बर्बादी', claim: 'भोजन का दावा करें' },
    ta: { title: 'ப்ளூம்நெட்', tagline: 'பசி இல்லை, வீணில்லை', claim: 'உணவை கோரு' },
    pa: { title: 'ਬਲੂਮਨੈੱਟ', tagline: 'ਜ਼ੀਰੋ ਭੁੱਖ, ਜ਼ੀਰੋ ਬਰਬਾਦੀ', claim: 'ਭੋਜਨ ਮੰਗੋ' },
    ml: { title: 'ബ്ലൂംനെറ്റ്', tagline: 'വിശപ്പില്ല, പാഴാക്കലില്ല', claim: 'ഭക്ഷണം ക്ലെയിം ചെയ്യുക' }
  }), []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
  ];

  // --- Utility Functions ---

  const addNotification = useCallback((message) => {
    setNotifications(prev => [{ id: Date.now(), message, time: 'Just now' }, ...prev].slice(0, 10));
  }, []);

  const handleVoiceReading = (text) => {
    // TOPIC 12: Voice reading for low-literacy users (Simulated)
    console.log(`[VOICE READ] Reading aloud: "${text}"`);
    addNotification(`🔊 Voice Reading activated for: "${text.substring(0, 20)}..."`);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // TOPIC 13: Volunteer Load Optimizer (AI Logic)
  const optimizeVolunteer = useCallback((foodItem) => {
    const urgencyScore = foodItem.expiry <= 1 ? 5 : foodItem.expiry <= 3 ? 3 : 1;
    const scored = volunteers.map(v => ({
      ...v,
      // Score calculation: Proximity (higher distance penalty) + Low Workload + High Rating + Urgency
      score: (10 - v.distance) * 3 + (5 - v.workload) * 2 + v.rating + urgencyScore
    }));
    return scored.sort((a, b) => b.score - a.score)[0];
  }, [volunteers]);

  // --- Geolocation and Offline Sync Simulation (Topics: Live Map, Offline PWA Mode) ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Your Current Location (Live)'
          });
        },
        (error) => {
          console.log(`Geolocation failed (Code: ${error.code}). Using default simulated location.`);
          setLocationError(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError(true);
    }
    
    // TOPIC 8: Offline PWA Mode Simulation
    addNotification('🌐 Offline PWA mode synced! 3 tasks processed after connecting.');
  }, [addNotification]);

  // --- Food Claim and Drone Logic (Topics: 3, 11, 14) ---
  const handleClaim = useCallback((foodId) => {
    const food = foodItems.find(f => f.id === foodId);
    if (!food || food.claimed) return;

    const bestVolunteer = optimizeVolunteer(food);
    
    setFoodItems(prev => prev.map(item =>
      item.id === foodId ? { ...item, claimed: true, volunteer: bestVolunteer } : item
    ));
    
    addNotification(`✅ Food claimed! Volunteer ${bestVolunteer.name} assigned.`);
    
    setTimeout(() => {
      // TOPIC 14: Auto-Drone Response for Disaster Zones (Simulated logic)
      const isDisasterZone = food.location.includes('Amritsar') || food.location.includes('Disaster');
      if (isDisasterZone) {
        addNotification(`🚨 Disaster Zone detected in ${food.location}! Activating drone delivery...`);
        setTimeout(() => setShowDroneModal(true), 1000); // TOPIC 11: Drone Simulation
      } else {
        addNotification(`🚗 ${bestVolunteer.name} is on the way with ${bestVolunteer.vehicle}`);
      }
    }, 2000);
  }, [foodItems, optimizeVolunteer, addNotification]);

  // --- Upload Food Logic (Topic 1, 4) ---
  const [newFood, setNewFood] = useState({
    name: '', type: 'Cooked', quantity: '', unit: 'Plates',
    expiry: '4', packType: 'Meal Pack', location: userLocation.name, lat: userLocation.lat, lon: userLocation.lon,
  });

  const handleUploadFood = () => {
    if (newFood.name && newFood.quantity && newFood.expiry) {
      // Simple safety rule based on expiry (Topic 7: Food Safety Checker)
      const safety = parseInt(newFood.expiry) <= 2 ? 'Share Soon' : 'Fresh';
      
      const food = {
        id: Date.now(),
        ...newFood,
        expiry: parseInt(newFood.expiry),
        status: safety,
        safetyScore: safety === 'Fresh' ? 95 : 70,
        donor: currentUser?.name || 'Anonymous Donor',
        claimed: false,
        volunteer: null,
      };
      
      setFoodItems(prev => [food, ...prev]);
      addNotification(`✅ Food uploaded: ${newFood.name}. Safety check: ${safety}`);
      setShowUploadModal(false);
      setNewFood(prev => ({ ...prev, name: '', quantity: '' })); // Reset name and quantity
    }
  };

  return <div>BloomNet App</div>; // Placeholder for brevity, full code in original
};

export default BloomNet;
