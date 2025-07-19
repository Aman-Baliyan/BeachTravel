import React from 'react';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Car, 
  Mountain, 
  Camera, 
  Utensils,
  TreePine,
  Landmark,
  Bus,
  Bike,
  Train,
  Banknote,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const TravelPlan = ({ planData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getActivityIcon = (activity) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes('flight') || activityLower.includes('airport')) return <Plane className="h-4 w-4" />;
    if (activityLower.includes('check-in') || activityLower.includes('hotel')) return <MapPin className="h-4 w-4" />;
    if (activityLower.includes('breakfast') || activityLower.includes('lunch') || activityLower.includes('dinner')) return <Utensils className="h-4 w-4" />;
    if (activityLower.includes('beach') || activityLower.includes('visit')) return <Camera className="h-4 w-4" />;
    if (activityLower.includes('shopping') || activityLower.includes('market')) return <Landmark className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getTransportIcon = (mode) => {
    const modeLower = mode.toLowerCase();
    if (modeLower.includes('flight') || modeLower.includes('plane')) return <Plane className="h-5 w-5" />;
    if (modeLower.includes('car') || modeLower.includes('taxi')) return <Car className="h-5 w-5" />;
    if (modeLower.includes('bus')) return <Bus className="h-5 w-5" />;
    if (modeLower.includes('bike')) return <Bike className="h-5 w-5" />;
    return <Car className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <CheckCircle className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Your Travel Plan is Ready!</h2>
        </div>
        <p className="text-green-100">Everything you need for an amazing trip, organized and ready to go.</p>
      </div>

      {/* Transport Options */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Transport Options</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To Destination */}
          {
           planData.transport_options.to_destination.map((option, index) => (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              {getTransportIcon(option.mode)}
              <h4 className="font-semibold text-gray-900">To Destination</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-medium">{option.mode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{option.estimated_time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-semibold text-green-600">{option.cost}</span>
              </div>
            </div>
          </div>


           ))
          }
          

          
        </div>
      </div>

      {/* Local Transport & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Local Transport */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Car className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Local Transport</h3>
          </div>
          <div className="space-y-2">
            {planData.local_transport.map((transport, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">{transport}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nature Spots */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TreePine className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nature Spots</h3>
          </div>
          <div className="space-y-2">
            {planData.nature_spots.map((spot, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{spot}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tourist Spots */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Landmark className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Tourist Attractions</h3>
          </div>
          <div className="space-y-2">
            {planData.tourist_spots.map((spot, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">{spot}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day-wise Itinerary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Day-wise Itinerary</h3>
        </div>
        
        <div className="space-y-6">
          {planData.day_wise_itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {dayIndex + 1}
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{formatDate(day.day)}</h4>
              </div>
              
              <div className="space-y-3">
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-sm font-medium text-indigo-600">{activity.time}</div>
                    </div>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-1 bg-white rounded-full">
                        {getActivityIcon(activity.activity)}
                      </div>
                      <span className="text-gray-700">{activity.activity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Budget Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Plane className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Travel</p>
            <p className="text-lg font-semibold text-blue-900">{planData.budget_breakdown.travel}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Stay</p>
            <p className="text-lg font-semibold text-purple-900">{planData.budget_breakdown.stay}</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Utensils className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Food</p>
            <p className="text-lg font-semibold text-orange-900">{planData.budget_breakdown.food}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Camera className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Activities</p>
            <p className="text-lg font-semibold text-green-900">{planData.budget_breakdown.activities}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center">
          <div className="flex items-center justify-center space-x-3">
            <Banknote className="h-8 w-8" />
            <div>
              <p className="text-green-100 mb-1">Total Budget</p>
              <p className="text-3xl font-bold">{planData.budget_breakdown.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Plan */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Return Journey</h3>
              <p className="text-blue-100">Departure at {planData.return_plan.time} via {planData.return_plan.mode}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">🏠</div>
            <p className="text-sm text-blue-100">Safe travels!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlan;