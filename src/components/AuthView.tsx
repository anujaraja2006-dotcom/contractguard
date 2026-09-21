import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateHome: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  onNavigateHome,
  initialMode = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialMode);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign Up Form State
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Password Strength Calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const passwordStrengthScore = calculatePasswordStrength(signupPassword);
  const getStrengthLabel = (score: number) => {
    if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score === 2 || score === 3)
      return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }
    if (!validateEmail(loginEmail.trim())) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Look up existing registered users in localStorage
      let registeredUsers: UserProfile[] = [];
      try {
        const stored = localStorage.getItem('contractly_registered_users');
        if (stored) registeredUsers = JSON.parse(stored);
      } catch {
        // ignore
      }

      const existingUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
      );

      const authenticatedUser: UserProfile = existingUser || {
        id: `usr-${Date.now()}`,
        name: loginEmail.includes('anuj')
          ? 'Anuj Raja'
          : loginEmail.split('@')[0].replace(/[._]/g, ' '),
        email: loginEmail.trim(),
        role: 'Admin',
        companyId: 'comp-1',
        departmentId: 'dept-1',
        preferredLanguage: 'en',
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR',
      };

      // Store auth session
      try {
        localStorage.setItem('contractly_session_user', JSON.stringify(authenticatedUser));
        localStorage.setItem('contractly_session_token', `jwt-sim-${Date.now()}`);
        if (rememberMe) {
          localStorage.setItem('contractly_remembered_email', loginEmail.trim());
        } else {
          localStorage.removeItem('contractly_remembered_email');
        }
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      onLoginSuccess(authenticatedUser);
    }, 600);
  };

  // Handle Sign Up Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupFullName.trim()) {
      setSignupError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setSignupError('Please enter your email address.');
      return;
    }
    if (!validateEmail(signupEmail.trim())) {
      setSignupError('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError('Password must contain at least 8 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setSignupError('You must agree to the Terms & Privacy Policy to create an account.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: signupFullName.trim(),
        email: signupEmail.trim(),
        role: 'Admin',
        companyId: 'comp-1',
        departmentId: 'dept-1',
        preferredLanguage: 'en',
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR',
      };

      // Persist in registered users list and session
      try {
        let registeredUsers: UserProfile[] = [];
        const stored = localStorage.getItem('contractly_registered_users');
        if (stored) registeredUsers = JSON.parse(stored);
        registeredUsers.push(newUser);
        localStorage.setItem('contractly_registered_users', JSON.stringify(registeredUsers));

        localStorage.setItem('contractly_session_user', JSON.stringify(newUser));
        localStorage.setItem('contractly_session_token', `jwt-sim-${Date.now()}`);
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      onLoginSuccess(newUser);
    }, 700);
  };

  // Demo Login Quick Fill
  const handleDemoFill = (roleName: 'Admin' | 'Manager' | 'Employee') => {
    const email =
      roleName === 'Admin'
        ? 'anujaraja2006@gmail.com'
        : roleName === 'Manager'
        ? 'manager@contractly.in'
        : 'employee@contractly.in';
    setLoginEmail(email);
    setLoginPassword('Contractly@2026');
    setLoginError(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Top back navigation button */}
      <div className="max-w-6xl w-full mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit Encrypted Authentication</span>
        </div>
      </div>

      {/* Main Two-Column Container */}
      <div className="max-w-6xl w-full mx-auto bg-white rounded-[2rem] border border-stone-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* Left Side — Aesthetic Visual Column */}
        <div className="lg:col-span-6 relative p-8 sm:p-12 flex flex-col justify-between overflow-hidden bg-[#161B18] text-white">
          {/* Ambient Background Image with Editorial Natural Lighting */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
              alt="Professional working calmly on laptop with business documents"
              className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141816]/95 via-[#1A211D]/75 to-[#161B18]/65"></div>
            {/* Subtle organic light radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.15),transparent_60%)]"></div>
          </div>

          {/* Top Branding Pill inside Left Visual */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-emerald-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Contract Suite</span>
            </div>
          </div>

          {/* Bottom Editorial Statement & Floating Badges */}
          <div className="relative z-10 space-y-6 max-w-md pt-32 lg:pt-0">
            {/* Overlay Statement requested by user */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                PROACTIVE ASSURANCE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F7F5F0] leading-tight">
                “Stay ahead of every contract renewal.”
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
                Never risk auto-renewals, surprise penalties, or missed renegotiation windows.
                Empower your organization with multi-tier automated alerts.
              </p>
            </div>

            {/* Trust markers */}
            <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Missed Deadlines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Tier Escalations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>23 Indian Languages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SOC2 &amp; ISO Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Authentication Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          {/* Logo & Brand Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#243029] flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1C1E]">
                  CONTRACTLY
                </span>
                <span className="ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold border border-stone-200">
                  Portal
                </span>
              </div>
            </div>

            {/* Main Heading & Supporting Text */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1C1E] tracking-tight">
              Welcome to Contractly
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
              Manage your contracts, deadlines, and renewals — all in one place.
            </p>
          </div>

          {/* Tab Switcher: LOGIN | SIGN UP */}
          <div className="flex border-b border-stone-200 mb-7">
            <button
              onClick={() => {
                setTab('login');
                setSignupError(null);
              }}
              className={`pb-3 px-4 text-sm font-bold tracking-wider uppercase transition-all cursor-pointer relative ${
                tab === 'login'
                  ? 'text-[#243029] border-b-2 border-[#243029]'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setLoginError(null);
              }}
              className={`pb-3 px-4 text-sm font-bold tracking-wider uppercase transition-all cursor-pointer relative ${
                tab === 'signup'
                  ? 'text-[#243029] border-b-2 border-[#243029]'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              SIGN UP
            </button>
          </div>

          {/* ===================== LOGIN FORM ===================== */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-[#243029] focus:ring-2 focus:ring-[#243029]/15 text-stone-900 text-sm sm:text-base outline-none transition-all placeholder:text-stone-400"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 focus:border-[#243029] focus:ring-2 focus:ring-[#243029]/15 text-stone-900 text-sm sm:text-base outline-none transition-all placeholder:text-stone-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Controls: Remember me + Forgot password */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#243029] border-stone-300 focus:ring-[#243029]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert('Password reset link sent to your registered email address.')
                  }
                  className="font-semibold text-stone-600 hover:text-[#243029] underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#243029] hover:bg-[#1A231E] text-white text-sm sm:text-base font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>

              {/* Switch to Sign Up */}
              <div className="text-center text-xs sm:text-sm text-stone-600 pt-2">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="font-bold text-[#243029] hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </div>

              {/* 1-Click Fast Demo Credentials Pill */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-stone-400" />
                  <span>1-Click Test Credentials</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('Admin')}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Demo Admin (Anuj Raja)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('Manager')}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Dept Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('Employee')}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Responsible Staff
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ===================== SIGN UP FORM ===================== */}
          {tab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {signupError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{signupError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <UserIcon className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#243029] focus:ring-2 focus:ring-[#243029]/15 text-stone-900 text-sm outline-none transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#243029] focus:ring-2 focus:ring-[#243029]/15 text-stone-900 text-sm outline-none transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 focus:border-[#243029] focus:ring-2 focus:ring-[#243029]/15 text-stone-900 text-sm outline-none transition-all placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showSignupPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {signupPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Strength:</span>
                      <span
                        className={`font-bold ${
                          getStrengthLabel(passwordStrengthScore).text
                        }`}
                      >
                        {getStrengthLabel(passwordStrengthScore).label}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 transition-all duration-300 ${
                            step <= passwordStrengthScore
                              ? getStrengthLabel(passwordStrengthScore).color
                              : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Password must contain at least 8 characters with numbers and symbols.
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type={showSignupConfirmPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 focus:border-[#243029] focus:ring-2 focus:ring-[#243029]/15 text-stone-900 text-sm outline-none transition-all placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {signupConfirmPassword.length > 0 && (
                  <div className="mt-1 text-[11px]">
                    {signupPassword === signupConfirmPassword ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Checkbox: Terms & Privacy Policy */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#243029] border-stone-300 focus:ring-[#243029] mt-0.5"
                  />
                  <span>
                    I agree to the{' '}
                    <span className="font-semibold text-stone-900 underline">Terms of Service</span>{' '}
                    and{' '}
                    <span className="font-semibold text-stone-900 underline">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              {/* Primary Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#243029] hover:bg-[#1A231E] text-white text-sm sm:text-base font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                {isSubmitting ? (
                  <span>PROVISIONING ACCOUNT...</span>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="text-center text-xs sm:text-sm text-stone-600 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-bold text-[#243029] hover:underline cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
