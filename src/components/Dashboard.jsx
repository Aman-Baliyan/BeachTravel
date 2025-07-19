import React, { useState, useEffect , useRef} from 'react';
import { toast } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { 
  MapPin, 
  Waves, 
  Wind, 
  Thermometer, 
  Eye, 
  Droplets, 
  Navigation, 
  Activity,
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  ChevronDown,
  Calendar,
  Users,
  Plane,
  ArrowRight,
  Menu,
  X,
  Home,
  Compass,
  BookOpen,
  Settings,
  User,
  Bell,
  Heart,
  Star,
  Filter,
  TrendingUp,
  Clock,
  Shield,
  Mail,
  Phone,
  Edit,
  Camera
} from 'lucide-react';

import TravelPlan from './TravelPlan';
import { TravelPlanShimmer, MapSearchShimmer } from './ShimmerUI';
import axios from 'axios';

export default function Dashboard() {
  const [selectedBeach, setSelectedBeach] = useState(null);
  const [sections, setSections] = useState(null);
  const [selectedState, setSelectedState] = useState('All States');
  const [safetyStatus, setSafetyStatus] = useState('All Alerts');
  const [activeTab, setActiveTab] = useState('search'); // Default to search tab
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false); // For inline form toggle
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [searchedDestination, setSearchedDestination] = useState(null);
  const [searchData, setSearchData] = useState('');
  const [isLoadingTravelPlan, setIsLoadingTravelPlan] = useState(false);
  const [isLoadingMapData, setIsLoadingMapData] = useState(false);
  
  // User profile data - using mock user for now
  const user = 'amanc5922@gmail.com';
  const userProfile = {
    name: user?.split('@')[0] || 'User',
    email: user || 'user@example.com',
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    joinDate: 'January 2024',
    totalTrips: 12,
    favoriteDestinations: 8,
    profileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200'
  };

  // Navigation items
  const navigationItems = [
    { id: 'search', label: 'Plan Trip', icon: Search, description: 'Search destinations & plan your journey' },
    { id: 'dashboard', label: 'Beach Safety', icon: Shield, description: 'Monitor beach safety conditions' },
    { id: 'destinations', label: 'Destinations', icon: Compass, description: 'Explore popular destinations' },
    { id: 'bookings', label: 'My Bookings', icon: BookOpen, description: 'View your travel bookings' },
    { id: 'favorites', label: 'Favorites', icon: Heart, description: 'Your saved destinations' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your account' }
  ];

  const getSafetyColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'caution': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unsafe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatus = (val) => {
      if(val >= 80){
        return 'safe';
      }
      else if(val >= 60){
         return 'caution';
      }
      return 'unsafe'
  }

  const getSafetyIcon = (status) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-5 w-5" />;
      case 'caution': return <AlertTriangle className="h-5 w-5" />;
      case 'unsafe': return <XCircle className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      case 'unsafe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (activity) => {
    const icons = {
      swimming: '🏊',
      surfing: '🏄',
      boating: '🚤',
      fishing: '🎣'
    };
    return icons[activity] || '🌊';
  };
  const [formData, setFormData] = useState({
    start:'',
    end:'',
    startDate:'',
    endDate:''
  })

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }
 
  const generatePlanHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    const username = 'aman@gmail.com'; // Replace with real values
    const password = '1234';
    const authHeader = 'Basic ' + btoa(username + ':' + password);
    
    setIsLoadingTravelPlan(true);
    
    try{
      const response = await axios.post("http://localhost:8080/api/generate",
        {
           source: formData.start,
           destination: formData.end,
           startDate: formData.startDate,
           endDate: formData.endDate
          },
      {
          headers:{
              Authorization: authHeader,
             'Content-Type': 'application/json'

          }
      }
      );
      console.log(response.data);
      setSections(response.data);
    }catch(e){
        console.log("Error");
        toast.error("Error");
    } finally {
      setIsLoadingTravelPlan(false);
    }
  };

   const renderSearchTab = () => (
    <div className="space-y-8">
      {/* Show shimmer while loading travel plan */}
      {isLoadingTravelPlan && <TravelPlanShimmer />}
      
      {/* Show travel plan if available and not loading */}
      {sections && !isLoadingTravelPlan && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Travel Plan</h2>
            <button 
              onClick={() => {
                setSections(null);
                setShowSearchForm(false);
              }}
              className="group flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Plan New Trip</span>
            </button>
          </div>
          <TravelPlan planData={sections} />
        </div>
      )}

      {/* Search form - only show if no travel plan is displayed and not loading */}
      {!sections && !isLoadingTravelPlan && (
        <>
          {/* Hero Section with Search */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Plan Your Perfect Coastal Journey</h2>
              <p className="text-xl opacity-90">Discover amazing beaches and create unforgettable memories</p>
            </div>
            
            {!showSearchForm ? (
              <button
                onClick={() => setShowSearchForm(true)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group hover:shadow-2xl hover:shadow-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">Where do you want to go?</h3>
                      <p className="text-sm opacity-80">Search destinations, dates, and travelers</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
            ) : (
              <form onSubmit={generatePlanHandler}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Departure Location
                        </label>
                        <input
                          type="text"
                          name="start"
                          value={formData.start}
                          onChange={changeHandler}
                          placeholder="Enter departure city"
                          className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-gray-900 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 placeholder-gray-500 transition-all duration-200 hover:bg-white focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Destination
                        </label>
                        <input
                          type="text"
                          name="end"
                          value={formData.end}
                          onChange={changeHandler}
                          placeholder="Enter destination"
                          className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-gray-900 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 placeholder-gray-500 transition-all duration-200 hover:bg-white focus:bg-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={changeHandler}
                          className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-gray-900 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 hover:bg-white focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={changeHandler}
                          className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-gray-900 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 hover:bg-white focus:bg-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setShowSearchForm(false)}
                        className="group flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                      >
                        <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span>Back to Search</span>
                      </button>
                      <button 
                        disabled={!formData.start || !formData.end || !formData.startDate || !formData.endDate || isLoadingTravelPlan}
                        type="submit" 
                        className="group flex items-center space-x-2 px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                      >
                        <span>{isLoadingTravelPlan ? 'Generating...' : 'Generate Trip Plan'}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
  
  const [comingData, setComingData] = useState(null);
  const FlyToOnAPICall = ({ targetCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (targetCoords) {
      map.flyTo([targetCoords.lat, targetCoords.lng], 12); // You can change zoom
    }
  }, [targetCoords, map]);

  return null; // No UI needed
};
  const [targetCoords, setTargetCoords] = useState(null);
  
  
  const apiDataForMap = async () => {
    const username = 'aman@gmail.com'; 
    const password = '1234';
    const authHeader = 'Basic ' + btoa(username + ':' + password);
    if(searchData){
      setIsLoadingMapData(true);
      try{
        const response = await axios.get(`http://localhost:8080/search/analyzeData/${searchData}`, 
        {
            headers:{
                Authorization: authHeader,
               'Content-Type': 'application/json'
            }
        }
        );
        const data = response.data;
        setComingData(data); 
       setTargetCoords({
        lat: data.latitude,
        lng: data.longitude,
    });
        
      }catch(e){
        toast.error("Error fetching destination data");
      } finally {
        setIsLoadingMapData(false);
      }
    }
  }
  
  

  const renderDashboardTab = () => (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations (e.g., Goa, Kerala, Chennai...)"
                onChange={(e) => {setSearchData(e.target.value)}}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 hover:bg-white hover:border-gray-300"
              />
            </div>
            <button 
              onClick={apiDataForMap} 
              disabled={isLoadingMapData}
              className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>{isLoadingMapData ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Show shimmer while loading map data */}
      {isLoadingMapData && <MapSearchShimmer />}

      {/* Interactive Map - only show when not loading */}
      {!isLoadingMapData && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Interactive Map</h2>
            {!searchData && (
              <p className="text-gray-600 text-sm mt-1">Enter a destination in the search bar above</p>
            )}
          </div>
          
          <div className="relative h-96 overflow-hidden">
            <MapContainer
                center={{ lat: 26.8333, lng: 80.95 }} // Center of India
                zoom={5}
                scrollWheelZoom={true}
                className="h-full w-full"
                
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <FlyToOnAPICall targetCoords={targetCoords} />
                  {comingData &&
                    <Marker  position={[comingData.latitude, comingData.longitude]}>
                    <Popup>
                      <strong>{searchData}</strong><br />
                      {/* State: {beach.state}<br /> */}
                      Safety: {getStatus(comingData.caution)}
                    </Popup>
                  </Marker>
                  }
              </MapContainer>
            
          </div>
        </div>
      )}

      {/* Destination Details (shown when searched and not loading) */}
      {comingData && !isLoadingMapData && (
        <div className="space-y-6">
          {/* Beach Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{searchData}</h2>
                <div className="flex items-center space-x-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{searchData}</span>
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getSafetyColor(getStatus(comingData.caution))}`}>
                {getSafetyIcon(getStatus(comingData.caution))}
                <span className="font-semibold capitalize">{getStatus(comingData.caution)}</span>
              </div>
            </div>

            {/* Current Conditions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Wave Height</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{comingData.current.waveHeight}m</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Wind className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Wind Speed</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{comingData.current.windSpeed} km/h</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Thermometer className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Temperature</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{comingData.current.waterTemperature}°C</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Eye className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Weather</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{comingData.current.weatherType}</p>
              </div>
            </div>
          </div>

          {/* Recreational Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recreational Activities</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(comingData.activity).map(([activity, data]) => (
                <div key={activity} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">{getActivityIcon(activity)}</div>
                  <h4 className="font-medium text-gray-900 capitalize mb-2">{activity}</h4>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getActivityColor(getStatus(data))}`}>
                    {getStatus(data)}
                  </span>
                </div>
              ))}
            </div>

            {/* Last Updated */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
            <p className="text-gray-600">{userProfile.email}</p>
            <p className="text-gray-500 text-sm">Member since {userProfile.joinDate}</p>
          </div>
          
          <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            <Edit className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{userProfile.totalTrips}</h3>
          <p className="text-gray-600">Total Trips</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{userProfile.favoriteDestinations}</h3>
          <p className="text-gray-600">Favorite Destinations</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
          <p className="text-gray-600">Average Rating</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{userProfile.name}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{userProfile.email}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{userProfile.phone}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{userProfile.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates about your trips and safety alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Safety Alerts</h4>
                <p className="text-sm text-gray-600">Get notified about weather and safety conditions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return renderSearchTab();
      case 'dashboard':
        return renderDashboardTab();
      case 'destinations':
        return (
          <div className="text-center py-20">
            <Compass className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Destinations</h3>
            <p className="text-gray-600">Explore amazing destinations around the world</p>
          </div>
        );
      case 'bookings':
        return (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600">View and manage your travel bookings</p>
          </div>
        );
      case 'favorites':
        return (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Favorites</h3>
            <p className="text-gray-600">Your saved destinations and places</p>
          </div>
        );
      case 'profile':
        return renderProfileTab();
      default:
        return renderSearchTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Welcome Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {userProfile.name}! 👋
              </h1>
              <p className="text-gray-600">
                Monitor beach safety conditions and plan your coastal adventures
              </p>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowMobileMenu(false);
                        // Reset search states when switching tabs
                        if (item.id !== 'dashboard') {
                          setMapSearchQuery('');
                          setSearchedDestination(null);
                          setSelectedBeach(null);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs ${activeTab === item.id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}