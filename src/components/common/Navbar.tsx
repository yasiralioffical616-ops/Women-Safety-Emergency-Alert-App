import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertCircle, Menu, X, User, LogOut, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark (Single text element with discreet icon) */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#173B6C] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 text-teal-300" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#173B6C]">
              Aman Safar
            </span>
          </Link>

          {/* Zone 2: Navigation Links (4-6 clean text links) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link
              to="/"
              className={`hover:text-[#173B6C] transition-colors ${
                isActive('/') ? 'text-[#0F766E] font-bold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/sos"
              className={`hover:text-red-600 flex items-center gap-1 transition-colors ${
                isActive('/sos') ? 'text-red-600 font-bold' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              SOS Alert
            </Link>
            <Link
              to="/contacts"
              className={`hover:text-[#173B6C] transition-colors ${
                isActive('/contacts') ? 'text-[#0F766E] font-bold' : ''
              }`}
            >
              Trusted Contacts
            </Link>
            <Link
              to="/community-map"
              className={`hover:text-[#173B6C] transition-colors ${
                isActive('/community-map') ? 'text-[#0F766E] font-bold' : ''
              }`}
            >
              Safety Map
            </Link>
            <Link
              to="/safety-tips"
              className={`hover:text-[#173B6C] transition-colors ${
                isActive('/safety-tips') ? 'text-[#0F766E] font-bold' : ''
              }`}
            >
              Safety Tips
            </Link>
            <Link
              to="/checkin"
              className={`hover:text-[#173B6C] transition-colors ${
                isActive('/checkin') ? 'text-[#0F766E] font-bold' : ''
              }`}
            >
              Check-In
            </Link>
          </nav>

          {/* Zone 3: 1-2 Primary Actions & User Status */}
          <div className="flex items-center gap-3">
            {/* Quick Emergency SOS button */}
            <Link
              to="/sos"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#173B6C] text-white flex items-center justify-center text-[11px] font-bold uppercase">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate font-semibold">
                    {user.full_name.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 truncate">{user.full_name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      User Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Profile & Settings
                    </Link>
                    <Link
                      to="/live-location"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Live Location Sharing
                    </Link>
                    <Link
                      to="/history"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Emergency History
                    </Link>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-[#0F766E] hover:bg-teal-50 font-semibold border-t border-slate-100"
                      >
                        Admin Control Center
                      </Link>
                    ) : (
                      <button
                        onClick={loginAsDemoAdmin}
                        className="w-full text-left px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 border-t border-slate-100 flex items-center justify-between"
                      >
                        <span>Switch to Demo Admin</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={loginAsDemoUser}
                        className="w-full text-left px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Switch to Demo User</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0d655e] rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Dashboard
          </Link>
          <Link
            to="/sos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-red-600 hover:text-red-700 flex items-center justify-between"
          >
            <span>One-Tap SOS Emergency</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </Link>
          <Link
            to="/contacts"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Trusted Contacts
          </Link>
          <Link
            to="/live-location"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Live Location Sharing
          </Link>
          <Link
            to="/checkin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Safety Check-In
          </Link>
          <Link
            to="/community-map"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Community Safety Map
          </Link>
          <Link
            to="/report-place"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Report Unsafe Location
          </Link>
          <Link
            to="/safety-tips"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-[#0F766E]"
          >
            Safety Tips & Urdu Guides
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-teal-700 bg-teal-50 px-3 rounded-lg"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Demo Mode Roles:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  loginAsDemoUser();
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 font-medium"
              >
                User
              </button>
              <button
                onClick={() => {
                  loginAsDemoAdmin();
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-teal-100 text-teal-800 rounded hover:bg-teal-200 font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
