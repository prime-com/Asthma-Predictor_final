import React, { useState } from 'react';
import type { EnvironmentalFactors } from '../types/asthma';
import { Wind, CloudRain, Thermometer, Sun, AlertTriangle, MapPin } from 'lucide-react';

interface EnvironmentalMonitorProps {
  environmental: EnvironmentalFactors;
  onChangeEnvironmental: (env: EnvironmentalFactors) => void;
}

const CITY_PRESETS: Array<{ name: string; data: EnvironmentalFactors }> = [
  {
    name: 'Seattle, WA (Clean Maritime Air)',
    data: {
      locationName: 'Seattle, WA',
      aqi: 32,
      pm25: 7.8,
      pm10: 14.2,
      pollenLevel: 'low',
      humidity: 62,
      temperature: 18,
      moldExposure: false,
      coldAirExposure: false,
      stressLevel: 'low'
    }
  },
  {
    name: 'Atlanta, GA (High Pollen Season)',
    data: {
      locationName: 'Atlanta, GA',
      aqi: 85,
      pm25: 28.4,
      pm10: 45.0,
      pollenLevel: 'very_high',
      humidity: 75,
      temperature: 27,
      moldExposure: false,
      coldAirExposure: false,
      stressLevel: 'moderate'
    }
  },
  {
    name: 'Chicago, IL (Chilly & High AQI)',
    data: {
      locationName: 'Chicago, IL',
      aqi: 142,
      pm25: 58.0,
      pm10: 95.0,
      pollenLevel: 'moderate',
      humidity: 45,
      temperature: 5,
      moldExposure: true,
      coldAirExposure: true,
      stressLevel: 'high'
    }
  },
  {
    name: 'Los Angeles, CA (Smog Alert)',
    data: {
      locationName: 'Los Angeles, CA',
      aqi: 168,
      pm25: 82.5,
      pm10: 130.0,
      pollenLevel: 'high',
      humidity: 35,
      temperature: 30,
      moldExposure: false,
      coldAirExposure: false,
      stressLevel: 'moderate'
    }
  }
];

export const EnvironmentalMonitor: React.FC<EnvironmentalMonitorProps> = ({
  environmental,
  onChangeEnvironmental
}) => {
  const [selectedCity, setSelectedCity] = useState(environmental.locationName || 'Seattle, WA');

  const getAqiColorClass = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (aqi <= 100) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (aqi <= 150) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (aqi <= 200) return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
    return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
  };

  const getAqiLabel = (aqi: number) => {
    if (aqi <= 50) return 'Good Air Quality';
    if (aqi <= 100) return 'Moderate Air Quality';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy Air Quality';
    return 'Very Unhealthy / Hazardous';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950/40 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Wind className="w-4 h-4" /> Environmental Radar & Trigger Index
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Air Quality & Allergen Monitor
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time simulation of environmental triggers including PM2.5 particulate levels, pollen counts, humidity, and atmospheric weather indicators.
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              const found = CITY_PRESETS.find(c => c.name === e.target.value);
              if (found) onChangeEnvironmental(found.data);
            }}
            className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
          >
            {CITY_PRESETS.map((city) => (
              <option key={city.name} value={city.name} className="bg-slate-900 text-white">
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Environmental Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Air Quality Index (AQI) */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold font-heading">
              <Wind className="w-5 h-5 text-cyan-400" />
              <span>Air Quality Index (AQI)</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getAqiColorClass(environmental.aqi)}`}>
              AQI {environmental.aqi}
            </span>
          </div>

          <div className="text-center py-4">
            <div className="text-5xl font-extrabold font-heading text-white">
              {environmental.aqi}
            </div>
            <p className="text-sm font-semibold text-cyan-400 mt-1">
              {getAqiLabel(environmental.aqi)}
            </p>
          </div>

          {/* AQI Range Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 (Good)</span>
              <span>150 (Unhealthy)</span>
              <span>300 (Hazardous)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 to-rose-500"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">PM2.5 Concentration</span>
              <span className="font-mono font-bold text-white text-sm">{environmental.pm25} µg/m³</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">PM10 Concentration</span>
              <span className="font-mono font-bold text-white text-sm">{environmental.pm10} µg/m³</span>
            </div>
          </div>
        </div>

        {/* Card 2: Allergen & Pollen Radar */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold font-heading">
              <Sun className="w-5 h-5 text-amber-400" />
              <span>Allergen & Pollen Level</span>
            </div>
            <span className="text-xs uppercase font-bold text-amber-400">
              {environmental.pollenLevel.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-3 py-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Tree Pollen Index</span>
                <span className="font-semibold text-amber-400">High</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Grass Pollen Index</span>
                <span className="font-semibold text-emerald-400">Moderate</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Ragweed & Mold Spores</span>
                <span className="font-semibold text-cyan-400">Low</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>High pollen days can trigger airway inflammation even indoors. Consider keeping windows closed during morning hours.</span>
          </div>
        </div>

        {/* Card 3: Weather & Atmospheric Factors */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold font-heading">
              <Thermometer className="w-5 h-5 text-teal-400" />
              <span>Weather Conditions</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{environmental.locationName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <Thermometer className="w-5 h-5 text-teal-400 mx-auto mb-1" />
              <span className="text-slate-400 text-xs block">Temperature</span>
              <span className="text-xl font-bold font-heading text-white">{environmental.temperature}°C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <CloudRain className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <span className="text-slate-400 text-xs block">Humidity</span>
              <span className="text-xl font-bold font-heading text-white">{environmental.humidity}%</span>
            </div>
          </div>

          {/* Trigger Factors Status */}
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40">
              <span className="text-slate-300">Cold Air Airway Sensitivity</span>
              <span className={`font-semibold ${environmental.coldAirExposure ? 'text-rose-400' : 'text-emerald-400'}`}>
                {environmental.coldAirExposure ? 'High Risk' : 'Low Risk'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40">
              <span className="text-slate-300">Indoor Mold / Moisture Risk</span>
              <span className={`font-semibold ${environmental.moldExposure ? 'text-amber-400' : 'text-emerald-400'}`}>
                {environmental.moldExposure ? 'Detected' : 'Normal'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
