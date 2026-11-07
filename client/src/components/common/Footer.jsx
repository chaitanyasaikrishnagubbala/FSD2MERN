import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Drive<span className="text-brand-500">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Experience effortless self-drive mobility. DriveEase provides well-maintained, verified,
              and fully insured vehicles with guaranteed availability across major Indian metropolitan hubs.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 bg-brand-950/60 border border-brand-900/60 py-2 px-3 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
              <span>100% Verified Fleet & Transparent Billing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/vehicles" className="hover:text-white transition-colors">
                  All Vehicles
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#why-driveease" className="hover:text-white transition-colors">
                  Why DriveEase
                </a>
              </li>
              <li>
                <a href="/#testimonials" className="hover:text-white transition-colors">
                  Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/vehicles?category=SUV" className="hover:text-white transition-colors">
                  SUVs & 4x4s
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Sedan" className="hover:text-white transition-colors">
                  Executive Sedans
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Hatchback" className="hover:text-white transition-colors">
                  City Hatchbacks
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Motorcycle" className="hover:text-white transition-colors">
                  Cruiser Motorcycles
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Luxury" className="hover:text-white transition-colors">
                  Luxury Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Support & Hub
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Tech Park Blvd, Bangalore Central, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+91 (800) 456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>support@driveease.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DriveEase Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Built for B.Tech FSD-2 Laboratory Project Evaluation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
