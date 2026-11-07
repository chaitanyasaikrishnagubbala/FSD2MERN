import React, { useState, useEffect } from 'react';
import { adminService, vehicleService } from '../services/api';
import {
  Car,
  Calendar,
  Users,
  IndianRupee,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  CheckCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'vehicles', 'users'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Vehicles state
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Vehicle Form State
  const initialVehicleForm = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'SUV',
    description: '',
    imagesText: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    pricePerDay: 2000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    registrationNumber: '',
    location: 'Bangalore Central',
    isActive: true
  };
  const [vehicleFormData, setVehicleFormData] = useState(initialVehicleForm);
  const [savingVehicle, setSavingVehicle] = useState(false);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load stats
  const fetchDashboardStats = async () => {
    try {
      const res = await adminService.getDashboardStats();
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoadingStats(false);
    }
  };

  // Load vehicles
  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const res = await vehicleService.getVehicles({ limit: 100, all: 'true' });
      if (res.data?.success) {
        setVehicles(res.data.vehicles);
      }
    } catch (err) {
      toast.error('Failed to load fleet');
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Load bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const params = bookingStatusFilter !== 'ALL' ? { status: bookingStatusFilter } : {};
      const res = await adminService.getAllBookings(params);
      if (res.data?.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      toast.error('Failed to load customer bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  // Load users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await adminService.getAllUsers();
      if (res.data?.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to load user accounts');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'vehicles') fetchVehicles();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, bookingStatusFilter]);

  // Handle Booking Status Update
  const handleUpdateBookingStatus = async (bookingId, targetStatus) => {
    try {
      const res = await adminService.updateBookingStatus(bookingId, targetStatus);
      if (res.data?.success) {
        toast.success(`Booking status changed to ${targetStatus}`);
        fetchBookings();
        fetchDashboardStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Handle Save / Edit Vehicle
  const handleOpenAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleFormData(initialVehicleForm);
    setVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (veh) => {
    setEditingVehicle(veh);
    setVehicleFormData({
      make: veh.make,
      model: veh.model,
      year: veh.year,
      category: veh.category,
      description: veh.description,
      imagesText: (veh.images || []).join('\n'),
      pricePerDay: veh.pricePerDay,
      fuelType: veh.fuelType,
      transmission: veh.transmission,
      seats: veh.seats,
      registrationNumber: veh.registrationNumber,
      location: veh.location,
      isActive: veh.isActive
    });
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    setSavingVehicle(true);

    const imageUrls = vehicleFormData.imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      make: vehicleFormData.make.trim(),
      model: vehicleFormData.model.trim(),
      year: Number(vehicleFormData.year),
      category: vehicleFormData.category,
      description: vehicleFormData.description.trim(),
      images: imageUrls.length > 0 ? imageUrls : [initialVehicleForm.imagesText],
      pricePerDay: Number(vehicleFormData.pricePerDay),
      fuelType: vehicleFormData.fuelType,
      transmission: vehicleFormData.transmission,
      seats: Number(vehicleFormData.seats),
      registrationNumber: vehicleFormData.registrationNumber.trim().toUpperCase(),
      location: vehicleFormData.location.trim(),
      isActive: vehicleFormData.isActive
    };

    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle._id, payload);
        toast.success('Vehicle updated successfully');
      } else {
        await vehicleService.createVehicle(payload);
        toast.success('New vehicle added to fleet');
      }
      setVehicleModalOpen(false);
      fetchVehicles();
      fetchDashboardStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleDeleteVehicle = async (vehId) => {
    if (!window.confirm('Are you sure you want to delete or deactivate this vehicle?')) return;
    try {
      const res = await vehicleService.deleteVehicle(vehId);
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchVehicles();
        fetchDashboardStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Administration Console
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            DriveEase Fleet Management
          </h1>
        </div>

        <button
          onClick={handleOpenAddVehicle}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Vehicle
        </button>
      </div>

      {/* 1. Summary Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-brand-50 text-brand-600 shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Total Fleet</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalVehicles}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">{stats.activeVehicles} Active Vehicles</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Active Bookings</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.activeBookingsCount}</p>
              <p className="text-[11px] text-amber-600 font-semibold">{stats.pendingBookingsCount} Awaiting Approval</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Registered Customers</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalCustomers}</p>
              <p className="text-[11px] text-slate-400 font-medium">Verified Profiles</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Completed Revenue</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">{stats.completedBookingsCount} Completed Rentals</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Tabs Navigation */}
      <div className="border-b border-slate-200 flex gap-8">
        {[
          { id: 'bookings', label: 'Booking Management' },
          { id: 'vehicles', label: 'Vehicle Inventory' },
          { id: 'users', label: 'Customer Accounts' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BOOKING MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Filter by Status:
            </p>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bookingStatusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loadingBookings ? (
            <LoadingSpinner text="Loading bookings..." />
          ) : bookings.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="py-4 px-6">ID & Vehicle</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Dates & Days</th>
                      <th className="py-4 px-6">Total Price</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {bookings.map((b) => {
                      const veh = b.vehicle || {};
                      const u = b.user || {};
                      const pickupStr = new Date(b.pickupDate).toISOString().split('T')[0];
                      const returnStr = new Date(b.returnDate).toISOString().split('T')[0];

                      return (
                        <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-mono text-slate-400 block text-[10px]">
                              #{b._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="font-bold text-slate-900 text-sm block">
                              {veh.make} {veh.model}
                            </span>
                            <span className="text-slate-400 text-[11px]">{veh.registrationNumber}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-slate-500 block text-[11px]">{u.email}</span>
                            <span className="text-slate-400 block text-[11px]">{u.phone}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold block">
                              {pickupStr} to {returnStr}
                            </span>
                            <span className="text-slate-400 text-[11px]">{b.numberOfDays} Rental Days</span>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                            ₹{b.totalPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b._id, 'CONFIRMED')}
                                    className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-[11px] transition-colors"
                                    title="Confirm Booking"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b._id, 'REJECTED')}
                                    className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-[11px] transition-colors"
                                    title="Reject Booking"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {b.status === 'CONFIRMED' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b._id, 'COMPLETED')}
                                    className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-bold text-[11px] transition-colors"
                                    title="Complete Rental"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b._id, 'CANCELLED')}
                                    className="px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold text-[11px] transition-colors"
                                    title="Cancel"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}

                              {['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status) && (
                                <span className="text-slate-400 text-[11px] italic">Archived</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 text-sm">
              No bookings found with status "{bookingStatusFilter}".
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VEHICLE INVENTORY */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          {loadingVehicles ? (
            <LoadingSpinner text="Loading fleet inventory..." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="py-4 px-6">Vehicle</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Specifications</th>
                      <th className="py-4 px-6">Daily Rate</th>
                      <th className="py-4 px-6">Reg Number</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {vehicles.map((v) => (
                      <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                v.images && v.images.length > 0
                                  ? v.images[0]
                                  : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
                              }
                              alt={v.model}
                              className="w-12 h-9 rounded-lg object-cover bg-slate-100"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block text-sm">
                                {v.make} {v.model}
                              </span>
                              <span className="text-slate-400 text-[11px]">{v.year}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold">{v.category}</td>
                        <td className="py-4 px-6 text-slate-500">
                          {v.fuelType} • {v.transmission} • {v.seats} Seats
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ₹{v.pricePerDay.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-600 uppercase">
                          {v.registrationNumber}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={v.isActive ? 'ACTIVE' : 'INACTIVE'} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditVehicle(v)}
                              className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Vehicle"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete / Deactivate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOMER ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {loadingUsers ? (
            <LoadingSpinner text="Loading customer accounts..." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Phone</th>
                      <th className="py-4 px-6">Total Bookings</th>
                      <th className="py-4 px-6">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 block text-sm">{u.name}</span>
                          <span className="text-slate-400 text-[11px]">{u.email}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{u.phone}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {u.bookingsCount || 0}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
                Fleet Catalog
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                {editingVehicle ? 'Edit Vehicle Information' : 'Add New Vehicle to Fleet'}
              </h3>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Maruti Suzuki, Hyundai, Tata"
                    value={vehicleFormData.make}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, make: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Swift, Creta, Thar"
                    value={vehicleFormData.model}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Year</label>
                  <input
                    type="number"
                    min="2000"
                    max="2030"
                    value={vehicleFormData.year}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={vehicleFormData.category}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Daily Price (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={vehicleFormData.pricePerDay}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, pricePerDay: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Fuel Type</label>
                  <select
                    value={vehicleFormData.fuelType}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Transmission</label>
                  <select
                    value={vehicleFormData.transmission}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, transmission: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Seats</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={vehicleFormData.seats}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, seats: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. KA-01-AB-1234"
                    value={vehicleFormData.registrationNumber}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location Hub</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore Central, MG Road"
                    value={vehicleFormData.location}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Image URLs (One per line)
                </label>
                <textarea
                  rows="2"
                  value={vehicleFormData.imagesText}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, imagesText: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-brand-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={vehicleFormData.description}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, description: e.target.value })}
                  placeholder="Vehicle description, features, engine specs..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={vehicleFormData.isActive}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700">
                  Vehicle is active and available for customer bookings
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVehicle}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
                >
                  {savingVehicle ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
