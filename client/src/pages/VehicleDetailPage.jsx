import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Fuel,
  Settings2,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Share2,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { vehicleService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  // Date Selection State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(tomorrowStr);

  // Availability & Pricing State
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await vehicleService.getVehicleById(id);
        if (res.data?.success) {
          const veh = res.data.vehicle;
          setVehicle(veh);
          setActiveImage(veh.images && veh.images.length > 0 ? veh.images[0] : FALLBACK_IMAGE);
        }
      } catch (err) {
        toast.error('Failed to load vehicle details');
        navigate('/vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate]);

  // Check availability whenever dates change or on button click
  const handleCheckAvailability = async (pDate = pickupDate, rDate = returnDate) => {
    if (!pDate || !rDate) return;
    setCheckingAvailability(true);
    try {
      const res = await vehicleService.checkAvailability(id, pDate, rDate);
      if (res.data?.success) {
        setAvailabilityResult(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error checking vehicle availability');
      setAvailabilityResult(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Perform initial check once vehicle is loaded
  useEffect(() => {
    if (vehicle && vehicle.isActive) {
      handleCheckAvailability(pickupDate, returnDate);
    }
  }, [vehicle]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      toast('Please log in or create an account to book', { icon: '🔑' });
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!availabilityResult || !availabilityResult.isAvailable) {
      toast.error('This vehicle is not available for the chosen dates.');
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    setBookingInProgress(true);
    try {
      const res = await bookingService.createBooking({
        vehicleId: vehicle._id,
        pickupDate,
        returnDate
      });

      if (res.data?.success) {
        toast.success('Booking requested successfully! Awaiting admin confirmation.');
        setConfirmModalOpen(false);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place booking. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading vehicle specifications..." size="lg" />
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to vehicle catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Image Gallery & Specs (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Showcase Image */}
          <div className="aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative">
            <img
              src={activeImage}
              alt={`${vehicle.make} ${vehicle.model}`}
              onError={() => setActiveImage(FALLBACK_IMAGE)}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-md backdrop-blur-md">
                {vehicle.category}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 text-white shadow-md backdrop-blur-md">
                Model Year {vehicle.year}
              </span>
            </div>
            {!vehicle.isActive && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                <span className="px-4 py-2 rounded-2xl text-sm font-bold uppercase tracking-wider bg-rose-600 text-white shadow-xl">
                  Vehicle Currently Deactivated
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-brand-600 ring-2 ring-brand-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title and Key Badges */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>{vehicle.location}</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600">
                Reg: {vehicle.registrationNumber}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {vehicle.make} <span className="text-slate-700 font-semibold">{vehicle.model}</span>
            </h1>
          </div>

          {/* Specifications Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Users className="w-5 h-5 text-brand-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">Seating</p>
                <p className="text-sm font-bold text-slate-900">{vehicle.seats} Adults</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Fuel className="w-5 h-5 text-brand-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">Fuel Type</p>
                <p className="text-sm font-bold text-slate-900">{vehicle.fuelType}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Settings2 className="w-5 h-5 text-brand-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">Transmission</p>
                <p className="text-sm font-bold text-slate-900">{vehicle.transmission}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-brand-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">Safety Rating</p>
                <p className="text-sm font-bold text-slate-900">Certified</p>
              </div>
            </div>
          </div>

          {/* Vehicle Description */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Vehicle Overview & Features
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Booking & Availability Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            {/* Daily Rate Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Rental Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ day</span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Instant Booking
              </span>
            </div>

            {/* Date Picker Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Pickup Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={pickupDate}
                  onChange={(e) => {
                    const newP = e.target.value;
                    setPickupDate(newP);
                    let newR = returnDate;
                    if (newP >= returnDate) {
                      const nextD = new Date(newP);
                      nextD.setDate(nextD.getDate() + 1);
                      newR = nextD.toISOString().split('T')[0];
                      setReturnDate(newR);
                    }
                    handleCheckAvailability(newP, newR);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Return Date
                </label>
                <input
                  type="date"
                  min={pickupDate || todayStr}
                  value={returnDate}
                  onChange={(e) => {
                    const newR = e.target.value;
                    setReturnDate(newR);
                    handleCheckAvailability(pickupDate, newR);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Availability Status Indicator */}
            {checkingAvailability ? (
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-slate-500">
                <Clock className="w-4 h-4 animate-spin text-brand-600" />
                Checking calendar availability...
              </div>
            ) : availabilityResult ? (
              availabilityResult.isAvailable ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Available for {availabilityResult.numberOfDays} rental day(s)</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-center gap-2.5 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Reserved for these dates. Please choose alternate dates.</span>
                </div>
              )
            ) : null}

            {/* Price Breakdown Calculation */}
            {availabilityResult?.pricing && (
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    ₹{vehicle.pricePerDay.toLocaleString('en-IN')} × {availabilityResult.numberOfDays} days
                  </span>
                  <span className="font-semibold text-slate-800">
                    ₹{availabilityResult.pricing.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Comprehensive Insurance</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Roadside Assistance</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-slate-900">
                  <span className="text-sm font-bold">Total Payable</span>
                  <span className="text-xl font-black text-brand-600">
                    ₹{availabilityResult.pricing.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={handleBookingClick}
              disabled={
                !vehicle.isActive ||
                checkingAvailability ||
                (availabilityResult && !availabilityResult.isAvailable)
              }
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20"
            >
              {!vehicle.isActive
                ? 'Vehicle Unavailable'
                : availabilityResult?.isAvailable
                ? 'Proceed to Book'
                : 'Select Available Dates'}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Zero cancellation fee prior to pickup start</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {confirmModalOpen && availabilityResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
                Booking Review
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Confirm Your Rental
              </h3>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex justify-between font-bold text-sm text-slate-900">
                <span>Vehicle:</span>
                <span>{vehicle.make} {vehicle.model} ({vehicle.year})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pickup Date:</span>
                <span className="font-semibold text-slate-900">{pickupDate} (00:00 UTC)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Return Date:</span>
                <span className="font-semibold text-slate-900">{returnDate} (23:59 UTC)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Duration:</span>
                <span className="font-semibold text-slate-900">{availabilityResult.numberOfDays} Day(s)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{user?.name} ({user?.phone})</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-base text-slate-900">
                <span>Total Amount:</span>
                <span className="text-brand-600">₹{availabilityResult.pricing.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              By confirming, your booking request will be placed in <span className="font-bold text-amber-600">PENDING</span> status. The rental rate is strictly locked and cannot be altered.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                disabled={bookingInProgress}
                className="w-1/2 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={bookingInProgress}
                className="w-1/2 py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-brand-500/20"
              >
                {bookingInProgress ? (
                  <>
                    <LoadingSpinner size="sm" text="" />
                    Processing...
                  </>
                ) : (
                  'Confirm & Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailPage;
