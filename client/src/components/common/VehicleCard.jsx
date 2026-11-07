import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Fuel, Settings2, MapPin, ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

export const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(
    vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : FALLBACK_IMAGE
  );

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {vehicle.category}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-900/75 backdrop-blur-md text-white shadow-sm">
            {vehicle.year}
          </span>
        </div>
        {!vehicle.isActive && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-md">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{vehicle.location || 'Available Citywide'}</span>
          </div>

          {/* Vehicle Make & Model */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            {vehicle.make} <span className="font-semibold text-slate-700">{vehicle.model}</span>
          </h3>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Users className="w-4 h-4 text-brand-600" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Fuel className="w-4 h-4 text-brand-600" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Settings2 className="w-4 h-4 text-brand-600" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Daily Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ day</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/vehicles/${vehicle._id}`}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Details
            </Link>
            <button
              onClick={() => navigate(`/vehicles/${vehicle._id}?action=book`)}
              disabled={!vehicle.isActive}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-brand-500/20 flex items-center gap-1"
            >
              Book Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
