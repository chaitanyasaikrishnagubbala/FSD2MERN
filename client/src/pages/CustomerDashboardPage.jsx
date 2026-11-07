import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import {
  Calendar,
  Clock,
  Car,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Edit3,
  Phone,
  Mail,
  User,
  Shield,
  MapPin,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const CustomerDashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'cancelled', 'all'

  // Profile Edit State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Booking Cancel State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      if (res.data?.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      toast.error('Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile({ name: editName, phone: editPhone });
      toast.success('Profile details updated successfully');
      setProfileModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const res = await bookingService.cancelBooking(cancelModalBooking._id, cancelReason);
      if (res.data?.success) {
        toast.success('Booking cancelled successfully');
        setCancelModalBooking(null);
        setCancelReason('');
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  // Filter Bookings by Tab
  const now = new Date();
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return ['PENDING', 'CONFIRMED'].includes(b.status);
    }
    if (activeTab === 'past') {
      return b.status === 'COMPLETED';
    }
    if (activeTab === 'cancelled') {
      return ['CANCELLED', 'REJECTED'].includes(b.status);
    }
    return true; // 'all'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-brand-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-600 border border-brand-200">
                {user?.role}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {user?.phone}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditName(user?.name || '');
            setEditPhone(user?.phone || '');
            setProfileModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all shadow-2xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>

      {/* 2. Bookings Management Header & Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              My Rental Bookings
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Track active reservations, review previous trips, and manage booking requests
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
            {[
              { id: 'upcoming', label: 'Active & Upcoming' },
              { id: 'past', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'all', label: 'All' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Bookings List */}
        {loading ? (
          <LoadingSpinner text="Fetching your bookings..." size="lg" />
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const vehicle = b.vehicle || {};
              const pickupFormatted = new Date(b.pickupDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              const returnFormatted = new Date(b.returnDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              const isCancellable =
                ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.pickupDate) > new Date();

              return (
                <div
                  key={b._id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <img
                      src={
                        vehicle.images && vehicle.images.length > 0
                          ? vehicle.images[0]
                          : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={vehicle.model || 'Vehicle'}
                      className="w-full sm:w-36 h-24 rounded-2xl object-cover bg-slate-100"
                    />

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={b.status} />
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: #{b._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {vehicle.make} {vehicle.model}{' '}
                        <span className="text-xs text-slate-400 font-normal">({vehicle.year})</span>
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-600" />
                          {pickupFormatted} — {returnFormatted}
                        </span>
                        <span>•</span>
                        <span>{b.numberOfDays} Day(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="flex sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 font-medium block">Total Paid / Due</span>
                      <span className="text-xl font-black text-slate-900">
                        ₹{b.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {isCancellable && (
                        <button
                          onClick={() => setCancelModalBooking(b)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                      {vehicle._id && (
                        <Link
                          to={`/vehicles/${vehicle._id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        >
                          View Vehicle
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No bookings in this tab</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              You do not have any {activeTab} bookings at the moment.
            </p>
            <Link
              to="/vehicles"
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm"
            >
              Browse Fleet to Book
            </Link>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Your Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
                >
                  {updatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Cancel Booking #{cancelModalBooking._id.slice(-6).toUpperCase()}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel this reservation? The vehicle will immediately become available for other customers.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Change of travel plans, found alternative..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboardPage;
