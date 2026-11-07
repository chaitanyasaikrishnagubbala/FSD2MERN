import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  Star,
  ArrowRight,
  Car,
  ChevronRight,
  Shield
} from 'lucide-react';
import { vehicleService } from '../services/api';
import VehicleCard from '../components/common/VehicleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = [
  { name: 'SUV', count: '12+ models', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sedan', count: '8+ models', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80' },
  { name: 'Hatchback', count: '10+ models', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Motorcycle', count: '6+ models', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80' },
  { name: 'Luxury', count: '4+ models', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80' }
];

const TESTIMONIALS = [
  {
    name: 'Ananya Verma',
    role: 'Product Designer, Bangalore',
    rating: 5,
    comment:
      'Booking the Hyundai Creta through DriveEase was seamless. The car was spotless, delivered right on schedule, and the transparent pricing with zero surprise charges made the weekend trip stress-free!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Vikramaditya Rao',
    role: 'Software Architect, Hyderabad',
    rating: 5,
    comment:
      'We booked the Mahindra Thar for a Coorg road trip. The booking confirmation was instant, the vehicle was in pristine mechanical condition, and 24/7 roadside assistance gave us complete peace of mind.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Pooja Hegde',
    role: 'Freelance Filmmaker, Mumbai',
    rating: 5,
    comment:
      'Super intuitive interface! Checking date-wise availability and calculating the breakdown before booking is genuinely useful. DriveEase is miles ahead of traditional rental agencies.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(tomorrowStr);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await vehicleService.getVehicles({ limit: 4, sort: 'year_desc' });
        if (res.data?.success) {
          setFeaturedVehicles(res.data.vehicles);
        }
      } catch (err) {
        console.error('Failed to load featured vehicles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (pickupDate) params.append('pickupDate', pickupDate);
    if (returnDate) params.append('returnDate', returnDate);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="relative min-h-[640px] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85"
            alt="Hero Luxury Ride"
            className="w-full h-full object-cover object-center opacity-35 scale-105 animate-pulse duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Next-Gen Self-Drive Car Rentals
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Find Your <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Perfect Ride.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Rent verified, sanitized, and fully insured cars & motorcycles with instant date confirmation and zero paperwork hassles.
          </p>

          {/* Quick Search Card */}
          <div className="mt-12 max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/20 text-left">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Pickup Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={pickupDate}
                    onChange={(e) => {
                      setPickupDate(e.target.value);
                      if (e.target.value >= returnDate) {
                        const nextD = new Date(e.target.value);
                        nextD.setDate(nextD.getDate() + 1);
                        setReturnDate(nextD.toISOString().split('T')[0]);
                      }
                    }}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Return Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={pickupDate || todayStr}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full h-12 flex items-center justify-center gap-2 px-6 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all shadow-lg shadow-brand-500/25"
                >
                  <Search className="w-4 h-4" />
                  Find Vehicles
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Featured Vehicles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Popular Selections
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Featured Vehicles
            </h2>
          </div>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group"
          >
            View all vehicles
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching featured fleet..." />
        ) : featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No featured vehicles found. Please run the database seed script.
          </div>
        )}
      </section>

      {/* 3. Vehicle Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Explore By Type
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Choose Your Category
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Whether for city commutes, family getaways, or cross-country road trips, we have the ideal machine for you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/vehicles?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-60 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-bold text-white leading-tight">{cat.name}</h3>
                <p className="text-xs text-brand-300 font-medium mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="bg-slate-100/70 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              How DriveEase Works
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              From selection to engine start in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Select Your Vehicle & Dates</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Filter by transmission, seats, or fuel type. Pick your rental interval and get instant date-wise availability confirmation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book with Transparent Rates</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                No hidden damage fees or surprise surges. The price you see is strictly verified and calculated securely on our backend.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Drive Away & Explore</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Pick up your sanitized vehicle at your chosen city hub. Enjoy unlimited freedom with comprehensive roadside assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose DriveEase */}
      <section id="why-driveease" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              The DriveEase Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 mb-6 leading-tight">
              Commercial Grade Quality, Tailored for Total Freedom.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              We eliminate the friction of traditional car rentals. Our fleet undergoes periodic 40-point safety inspections, ensuring your journey is as dependable as it is exhilarating.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Verified Fleet</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Every car is sanitized, verified by engineers, and covered with bumper-to-bumper insurance.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">24/7 Roadside Assistance</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Pan-India emergency towing, tire service, and immediate on-road assistance round the clock.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Flexible Cancellation Policy</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Plans changed? Cancel any eligible pending or confirmed booking directly from your customer dashboard.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="DriveEase Fleet In Action"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stat Pill */}
            <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 hidden sm:block">
              <p className="text-3xl font-extrabold text-brand-400">99.8%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Booking Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section id="testimonials" className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Real Experiences
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">
              What Our Drivers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-700/60">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-600" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 p-8 sm:p-14 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Ready to Hit the Open Road?
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed">
              Explore our full inventory of hatchbacks, luxury sedans, and rugged 4x4s. Book your next adventure in minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              to="/vehicles"
              className="px-6 py-3.5 rounded-xl font-bold text-brand-900 bg-white hover:bg-slate-100 transition-all text-center shadow-md active:scale-95"
            >
              Browse All Vehicles
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-brand-800/80 hover:bg-brand-800 border border-brand-400/30 transition-all text-center active:scale-95"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
