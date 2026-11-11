import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AuthUser } from '../types';

import { cloudLogin, cloudRegister, cloudGetProfile } from '../utils/cloudStorage';

interface SignScreenProps {
  onContinue: (user?: AuthUser) => void;
  onBackToSplash?: () => void;
}

export const SignScreen: React.FC<SignScreenProps> = ({
  onContinue,
  onBackToSplash,
}) => {
  const [tabMode, setTabMode] = useState<'signin' | 'signup'>('signin');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'Producer' | 'AV Director' | 'Host' | 'VIP Coordinator'>('Producer');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & modal states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isEnteringCustomGoogle, setIsEnteringCustomGoogle] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<string>('Connected to Cloud Storage');

  // Check existing cloud session on mount
  useEffect(() => {
    let isMounted = true;
    cloudGetProfile().then((res) => {
      if (isMounted && res.success && res.user) {
        setCloudStatus(`Active Cloud Session: ${res.user.email}`);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Form Validation
  const validateForm = (): boolean => {
    setErrorMessage(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. director@event.com)');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Security passcode must be at least 6 characters long');
      return false;
    }

    if (tabMode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter');
        return false;
      }
    }

    return true;
  };

  // Direct authentication & advancement to Event Setup
  const handleAuthSuccess = (user: AuthUser) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onContinue(user);
    }, 350);
  };

  // Real Cloud Authentication Form submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (tabMode === 'signup') {
        const res = await cloudRegister(name, email, password, role);
        if (!res.success || !res.user) {
          setErrorMessage(res.error || 'Failed to create cloud account.');
          setIsSubmitting(false);
          return;
        }
        handleAuthSuccess(res.user);
      } else {
        const res = await cloudLogin(email, password);
        if (!res.success || !res.user) {
          setErrorMessage(res.error || 'Invalid credentials in Cloud Storage.');
          setIsSubmitting(false);
          return;
        }
        handleAuthSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to communicate with Cloud Storage.');
      setIsSubmitting(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleAccountSelect = (selectedEmail: string, selectedName: string) => {
    setShowGoogleModal(false);
    const googleUser: AuthUser = {
      name: selectedName,
      email: selectedEmail,
      role,
      provider: 'google',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedName)}&backgroundColor=ea580c`,
      token: `G-OAUTH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      signedInAt: new Date().toISOString(),
    };
    handleAuthSuccess(googleUser);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#120E0C] text-[#FAF8F5] flex flex-col justify-between font-sans px-4 py-6 sm:py-8 pb-16 touch-pan-y">
      {/* Background Ambient Lighting in Claude Terracotta Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#D96B27]/14 blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#EA580C]/10 blur-[130px]" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] rounded-full bg-[#3B82F6]/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,6,5,0.75)_100%)]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-[#2A221D]">
        {/* Brand Lockup with the uploaded original Gemini logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#1C1714] border border-[#D96B27]/40 flex items-center justify-center p-0.5 shadow-md shadow-black/40 overflow-hidden">
            <img
              src="/assets/aistudio/utsavam_circle_logo.png"
              alt="Utsavam AI Logo"
              className="w-full h-full rounded-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Utsavam AI • Event Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/40">
                PRO CONSOLE
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Verified Access • Powered by Gemini
            </p>
          </div>
        </div>

        {/* Replay 3D Intro Animation */}
        {onBackToSplash && (
          <button
            onClick={onBackToSplash}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1C1714] border border-stone-800 text-stone-300 hover:text-[#FF7A3D] hover:border-[#D96B27] transition-all"
            title="Replay the 3D starting animation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D96B27]" />
            <span className="hidden sm:inline">Replay Intro</span>
          </button>
        )}
      </header>

      {/* Main Authentication Card Arena */}
      <main className="relative z-20 flex-1 flex items-center justify-center my-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Card Container */}
          <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 backdrop-blur-xl">
            {/* Header Badge */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1C1714] to-[#251D18] border border-[#D96B27]/40 shadow-xl shadow-[#D96B27]/25 mb-3 p-1 relative group overflow-hidden">
                <img
                  src="/assets/aistudio/utsavam_circle_logo.png"
                  alt="Utsavam AI Logo"
                  className="w-full h-full rounded-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#EA580C] border border-[#181310] flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                {tabMode === 'signin' ? 'Sign In to Event Studio' : 'Create Producer Account'}
              </h1>
              <p className="text-xs text-stone-400 mt-1 mb-2">
                Enter your credentials or continue with Google to access event setup
              </p>
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#120E0C] border border-[#2E241E] text-[11px] text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-emerald-300 font-semibold">Real Cloud Storage Active</span>
                <span className="text-stone-500">•</span>
                <span className="text-stone-400">PBKDF2 SHA-256</span>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Official Google Sign-In Button */}
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] border border-stone-300"
              >
                {/* Official Google multi-color G SVG icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="h-[1px] flex-1 bg-[#2A221D]" />
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  or sign in with password
                </span>
                <div className="h-[1px] flex-1 bg-[#2A221D]" />
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[#100D0B] rounded-xl border border-[#2A221C] mb-5">
              <button
                type="button"
                onClick={() => {
                  setTabMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tabMode === 'signin'
                    ? 'bg-gradient-to-r from-[#D96B27] to-[#EA580C] text-white shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTabMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tabMode === 'signup'
                    ? 'bg-gradient-to-r from-[#D96B27] to-[#EA580C] text-white shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* Role Clearance Selector */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center justify-between">
                <span>Console Role</span>
                <span className="text-[10px] text-[#FF7A3D] font-mono">CLEARANCE</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Producer' as const, label: 'Lead Producer' },
                  { id: 'AV Director' as const, label: 'Tech & AV Lead' },
                  { id: 'Host' as const, label: 'Event Host' },
                  { id: 'VIP Coordinator' as const, label: 'VIP Registry' },
                ].map((item) => {
                  const active = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`py-1.5 px-2.5 rounded-xl text-left border text-xs font-medium transition-all ${
                        active
                          ? 'bg-[#D96B27]/20 border-[#D96B27] text-white shadow-sm'
                          : 'bg-[#120E0C] border-[#2A221C] text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A3D] shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email/Passcode Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Full Name for Sign Up */}
              {tabMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Producer Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Director Quantrom"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Work Email / Staff ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@celebration.ai"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-stone-300">
                    Security Passcode
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security token"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Sign Up */}
              {tabMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Confirm Security Passcode
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter security token"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Remember session checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#100D0B] border-stone-800 text-[#D96B27] focus:ring-[#D96B27]"
                  />
                  <span className="text-xs text-stone-400">Remember session</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure TLS</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D96B27] via-[#EA580C] to-[#F59E0B] hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#D96B27]/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>{tabMode === 'signin' ? 'Sign In & Enter Event Setup' : 'Register & Enter Event Setup'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Guest / Direct Entry Option */}
            <div className="mt-5 pt-4 border-t border-[#2A221D] text-center">
              <button
                type="button"
                onClick={() => {
                  handleAuthSuccess({
                    name: 'Event Organizer',
                    email: 'organizer@utsavam.ai',
                    role: 'Producer',
                    provider: 'email',
                    token: 'GUEST-SESSION-' + Date.now(),
                    signedInAt: new Date().toISOString(),
                  });
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#120E0C] border border-[#2E241E] hover:border-[#D96B27] text-xs text-stone-300 hover:text-white transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF7A3D]" />
                <span>Continue as Guest Organizer</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Google Account Selector Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-white text-stone-900 rounded-3xl p-6 shadow-2xl overflow-hidden relative"
            >
              <div className="text-center mb-5">
                <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-stone-900">Choose Google account</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  to continue to UTSAVAM AI Event Studio
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleGoogleAccountSelect('quantromxx@gmail.com', 'Quantrom Director')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-stone-200 hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    Q
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-stone-900 block truncate">
                      Quantrom Director
                    </span>
                    <span className="text-xs text-stone-500 block truncate">
                      quantromxx@gmail.com
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#D96B27] bg-[#D96B27]/10 px-2 py-0.5 rounded-full font-bold">
                    SELECT
                  </span>
                </button>

                {!isEnteringCustomGoogle ? (
                  <button
                    type="button"
                    onClick={() => setIsEnteringCustomGoogle(true)}
                    className="w-full py-2.5 px-3 rounded-xl border border-dashed border-stone-300 hover:border-stone-400 text-xs text-stone-600 font-medium text-center transition-colors"
                  >
                    + Enter another Google email
                  </button>
                ) : (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="any-name@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (customGoogleEmail.includes('@')) {
                            handleGoogleAccountSelect(customGoogleEmail, customGoogleEmail.split('@')[0]);
                          }
                        }}
                        className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEnteringCustomGoogle(false)}
                        className="px-3 py-1.5 bg-stone-200 text-stone-700 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors border-t border-stone-100"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto pt-3 text-center border-t border-[#2A221D]/60">
        <p className="text-[11px] text-stone-500">
          UTSAVAM AI – Smart Event Management Platform • Verified Console Access • Ready for Event Setup
        </p>
      </footer>
    </div>
  );
};
