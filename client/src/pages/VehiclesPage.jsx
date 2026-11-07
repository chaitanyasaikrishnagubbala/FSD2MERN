import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Car,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { vehicleService } from '../services/api';
import VehicleCard from '../components/common/VehicleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const VehiclesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State synced with URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'year_desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Response state
  const [vehicles, setVehicles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch vehicles on filter changes
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 9,
          sort,
          ...(search && { search }),
          ...(category && { category }),
          ...(fuelType && { fuelType }),
          ...(transmission && { transmission }),
          ...(maxPrice && { maxPrice })
        };

        const res = await vehicleService.getVehicles(params);
        if (res.data?.success) {
          setVehicles(res.data.vehicles);
          setTotalCount(res.data.total);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();

    // Sync URL search params
    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    if (category) newParams.set('category', category);
    if (fuelType) newParams.set('fuelType', fuelType);
    if (transmission) newParams.set('transmission', transmission);
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    if (sort !== 'year_desc') newParams.set('sort', sort);
    if (page > 1) newParams.set('page', page.toString());
    setSearchParams(newParams, { replace: true });
  }, [search, category, fuelType, transmission, maxPrice, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setFuelType('');
    setTransmission('');
    setMaxPrice('');
    setSort('year_desc');
    setPage(1);
  };

  const hasActiveFilters = search || category || fuelType || transmission || maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            DriveEase Fleet
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Browse All Available Vehicles
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Showing <span className="font-bold text-slate-800">{vehicles.length}</span> of{' '}
            <span className="font-bold text-slate-800">{totalCount}</span> verified vehicles ready for rental.
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Filters {hasActiveFilters && '(Active)'}
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <span className="text-slate-400 text-xs font-medium">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none text-xs"
            >
              <option value="year_desc">Latest Model Year</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Make & Model A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4 text-brand-600" />
                Filter Fleet
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Search Make / Model
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Swift, Thar, Creta..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Vehicle Category
              </label>
              <div className="space-y-1.5">
                {['', 'Hatchback', 'Sedan', 'SUV', 'Motorcycle', 'Luxury'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      category === cat
                        ? 'bg-brand-50 text-brand-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat === '' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Transmission
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'All', value: '' },
                  { label: 'Manual', value: 'Manual' },
                  { label: 'Auto', value: 'Automatic' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setTransmission(item.value);
                      setPage(1);
                    }}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      transmission === item.value
                        ? 'border-brand-600 bg-brand-50 text-brand-600 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Fuel Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'All Fuels', value: '' },
                  { label: 'Petrol', value: 'Petrol' },
                  { label: 'Diesel', value: 'Diesel' },
                  { label: 'Hybrid', value: 'Hybrid' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setFuelType(item.value);
                      setPage(1);
                    }}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                      fuelType === item.value
                        ? 'border-brand-600 bg-brand-50 text-brand-600 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Max Daily Rate</span>
                <span className="text-brand-600 font-extrabold">
                  {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice || '10000'}
                onChange={(e) => {
                  setMaxPrice(e.target.value === '10000' ? '' : e.target.value);
                  setPage(1);
                }}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹1,000</span>
                <span>₹10,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end md:hidden">
            <div className="w-5/6 max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="font-bold text-slate-900 text-base">Filter Vehicles</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  <option value="">All Categories</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  <option value="">Any Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-brand-600 rounded-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Grid & Content */}
        <div className="md:col-span-3 space-y-8">
          {loading ? (
            <LoadingSpinner text="Loading vehicle fleet..." size="lg" />
          ) : vehicles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-200">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm font-semibold text-slate-700 px-4">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No vehicles match your criteria</h3>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                Try widening your price range, clearing filters, or searching with another keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
