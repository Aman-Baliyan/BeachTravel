import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  Waves,
  Wind,
  Thermometer,
  Eye,
  Droplets,
  Navigation,
  MapPin,
  Clock,
  X
} from 'lucide-react';

const BeachSafetyAnalyzer = ({ isOpen, onToggle, onClose }) => {
  const [selectedBeach, setSelectedBeach] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    current: true,
    forecast: false,
    activities: false,
    alerts: false
  });

  // Mock beach data - replace with actual INCOIS API
  const beachOptions = [
    'Marina Beach, Chennai',
    'Kovalam Beach, Kerala',
    'Goa Beaches',
    'Puri Beach, Odisha',
    'Digha Beach, West Bengal',
    'Varkala Beach, Kerala',
    'Radhanagar Beach, Andaman',
    'Calangute Beach, Goa'
  ];
  const analyzeBeach = async () => {
    if (!selectedBeach) return;
    
    setLoading(true);

    // Simulate API call
     try {
    const response = await axios.get(`http://localhost:8080/search/analyzeData/${selectedBeach}`);
    setAnalysisData(response.data);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
    setLoading(false);

    // setTimeout(() => {
    //   setAnalysisData(mockAnalysisData[selectedBeach] || null);
    //   
    // }, 1500);
  };

  const getSafetyColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'caution': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unsafe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatus = (score) => {
      if(score >= 80){
         return "safe";
      }
      else if(score >= 60){
        return "caution"

      }
      return "unsafe"
  }

  const getSafetyIcon = (status) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4" />;
      case 'caution': return <AlertTriangle className="h-4 w-4" />;
      case 'unsafe': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 w-96 max-h-[80vh] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <h3 className="font-semibold">Beach Safety Analyzer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 max-h-[calc(80vh-80px)] overflow-y-auto">
        {/* Beach Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Beach Location
          </label>
          <div className="flex space-x-2">
            <select
              value={selectedBeach}
              onChange={(e) => setSelectedBeach(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a beach...</option>
              {beachOptions.map((beach) => (
                <option key={beach} value={beach}>{beach}</option>
              ))}
            </select>
            <button
              onClick={analyzeBeach}
              disabled={!selectedBeach || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing beach safety conditions...</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && !loading && (
          <div className="space-y-4">
            {/* Overall Safety Status */}
            <div className={`p-4 rounded-lg border ${getSafetyColor(getStatus(analysisData.caution))}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSafetyIcon(getStatus(analysisData.caution))}
                  <span className="font-semibold capitalize">{getStatus(analysisData.caution)}</span>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(analysisData.caution)}`}>
                  {analysisData.caution}/100
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    analysisData.caution >= 80 ? 'bg-green-500' :
                    analysisData.caution >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysisData.caution}%` }}
                ></div>
              </div>
            </div>

            {/* Current Conditions */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('current')}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Current Conditions</span>
                {expandedSections.current ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.current && (
                <div className="p-3 border-t border-gray-200 grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Waves className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Wave Height</div>
                      <div className="font-medium">{analysisData.current.waveHeight}m</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-xs text-gray-500">Wind Speed</div>
                      <div className="font-medium">{analysisData.current.windSpeed} km/h</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="text-xs text-gray-500">Water Temp</div>
                      <div className="font-medium">{analysisData.current.waterTemperature}°C</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">UV_Index</div>
                      <div className="font-medium">{analysisData.current.uv_index} km</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activities Safety */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('activities')}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Activity Safety</span>
                {expandedSections.activities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.activities && (
                <div className="p-3 border-t border-gray-200 space-y-2">
                  {Object.entries(analysisData.activity).map(([name, score]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="capitalize text-sm">{name}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getSafetyColor(getStatus(score))}`}>
                          {getStatus(score)}
                        </span>
                        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alerts */}
            {analysisData.alerts.length > 0 && (
              <div className="border border-red-200 rounded-lg bg-red-50">
                <button
                  onClick={() => toggleSection('alerts')}
                  className="w-full p-3 flex items-center justify-between hover:bg-red-100 transition-colors"
                >
                  <span className="font-medium text-red-800">Active Alerts ({analysisData.alerts.length})</span>
                  {expandedSections.alerts ? <ChevronUp className="h-4 w-4 text-red-600" /> : <ChevronDown className="h-4 w-4 text-red-600" />}
                </button>
                {expandedSections.alerts && (
                  <div className="p-3 border-t border-red-200">
                    {analysisData.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center space-x-2 text-red-700 text-sm">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3-Hour Forecast */}
            {/* <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('forecast')}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">3-Hour Forecast</span>
                {expandedSections.forecast ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.forecast && (
                <div className="p-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2">
                    {analysisData.forecast.map((item, index) => (
                      <div key={index} className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">{item.time}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getSafetyColor(item.safety)} mb-1`}>
                          {item.safety}
                        </div>
                        <div className="text-xs">
                          <div>Wave: {item.waveHeight}m</div>
                          <div>Wind: {item.windSpeed}km/h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div> */}

            {/* Last Updated */}
            {/* <div className="text-center text-xs text-gray-500 flex items-center justify-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Last updated: {new Date(analysisData.lastUpdated).toLocaleTimeString()}</span>
            </div> */}
          </div>
        )}

        {/* No Data State */}
        {!analysisData && !loading && selectedBeach && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No safety data available for this beach.</p>
            <p className="text-sm">Please try another location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeachSafetyAnalyzer;