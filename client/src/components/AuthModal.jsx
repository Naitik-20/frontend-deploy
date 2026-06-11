import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';

const GOOGLE_CLIENT_ID = '307840657202-rmj51fb9pgeon9metedllj7t3ivqdhmf.apps.googleusercontent.com';

const initialLogin = { identifier: '', password: '' };
const initialRegister = {
  name: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: '',
  petName: '',
  petType: '',
  acceptedTerms: false,
};
const initialForgot = {
  email: '',
  otp: '',
  password: '',
  confirmPassword: '',
};
const initialSignupVerification = { email: '', otp: '' };

export default function AuthModal({ isOpen, onClose, onLoginSuccess, backendUrl }) {
  const [view, setView] = useState('login');
  const [forgotStep, setForgotStep] = useState('email');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginData, setLoginData] = useState(initialLogin);
  const [regData, setRegData] = useState(initialRegister);
  const [forgotData, setForgotData] = useState(initialForgot);
  const [signupVerification, setSignupVerification] = useState(initialSignupVerification);
  const googleButtonRef = useRef(null);

  const isRegister = view === 'register';
  const isForgot = view === 'forgot';
  const isSignupVerification = view === 'verifySignup';

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setLoading(false);
      setView('login');
      setForgotStep('email');
      setShowPass(false);
      setLoginData(initialLogin);
      setRegData(initialRegister);
      setForgotData(initialForgot);
      setSignupVerification(initialSignupVerification);
    }

    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const finishLogin = (data, message) => {
    if (data.token) localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    onLoginSuccess(data.user);
    setSuccess(message);
    setTimeout(onClose, 900);
  };

  const requestJson = async (path, body) => {
    const res = await fetch(`${backendUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  const handleGoogleCredential = async (response) => {
    if (isRegister && !regData.acceptedTerms) {
      setError('Please accept the terms before Google signup.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await requestJson('/api/auth/google', { credential: response.credential });
      finishLogin(data, isRegister ? 'Google signup successful.' : 'Google login successful.');
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || isForgot || isSignupVerification) return;

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;
      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth || 320,
        text: isRegister ? 'signup_with' : 'signin_with',
        shape: 'pill',
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, [isOpen, isForgot, isSignupVerification, isRegister, regData.acceptedTerms]);

  if (!isOpen) return null;

  const switchView = (nextView) => {
    setView(nextView);
    setError('');
    setSuccess('');
    setForgotStep('email');
    setShowPass(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let data = await requestJson('/api/auth/login', loginData);

      if (!data.token) {
        data = await requestJson('/api/wholesalers/login', {
          email: loginData.identifier,
          password: loginData.password,
        });
      }

      finishLogin(data, 'Logged in successfully.');
    } catch (err) {
      try {
        const wholesalerData = await requestJson('/api/wholesalers/login', {
          email: loginData.identifier,
          password: loginData.password,
        });
        finishLogin(wholesalerData, 'Logged in successfully.');
      } catch {
        setError(err.message || 'Invalid email/mobile or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (regData.password !== regData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!regData.acceptedTerms) {
      setError('Please accept the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      const data = await requestJson('/api/auth/register', regData);
      setSignupVerification({ email: data.email || regData.email, otp: '' });
      setRegData(initialRegister);
      setSuccess(data.message || 'Signup successful. Check your email for OTP.');
      setView('verifySignup');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const verifySignupEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await requestJson('/api/auth/verify-email', signupVerification);
      setSuccess(data.message || 'Email verified. You can login now.');
      setSignupVerification(initialSignupVerification);
      setLoginData({ ...initialLogin, identifier: signupVerification.email });
      setTimeout(() => switchView('login'), 900);
    } catch (err) {
      setError(err.message || 'Could not verify email.');
    } finally {
      setLoading(false);
    }
  };

  const resendSignupOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await requestJson('/api/auth/verify-email/resend', {
        email: signupVerification.email,
      });
      setSuccess(data.message || 'Verification OTP sent again.');
    } catch (err) {
      setError(err.message || 'Could not resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await requestJson('/api/auth/forgot-password/send-otp', {
        email: forgotData.email,
      });
      setSuccess(data.message || 'OTP sent to your email.');
      setForgotStep('otp');
    } catch (err) {
      setError(err.message || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await requestJson('/api/auth/forgot-password/verify-otp', {
        email: forgotData.email,
        otp: forgotData.otp,
      });
      setSuccess(data.message || 'OTP verified.');
      setForgotStep('reset');
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (forgotData.password !== forgotData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await requestJson('/api/auth/forgot-password/reset', forgotData);
      setSuccess(data.message || 'Password reset successfully.');
      setForgotData(initialForgot);
      setForgotStep('email');
      setTimeout(() => switchView('login'), 900);
    } catch (err) {
      setError(err.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-backdrop" onClick={onClose} />
      <div className="auth-modal" role="dialog" aria-label="Authentication">
        <button className="auth-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <aside className="auth-brand-panel">
          <div className="auth-brand-logo">Dr</div>
          <h2>Dr. Snoopy</h2>
          <p>Trusted care, simple shopping, happy homes.</p>
          <ul>
            {['Fast checkout', 'Order tracking', 'Pet care updates', 'Secure login'].map((item) => (
              <li key={item}><Check size={14} /> {item}</li>
            ))}
          </ul>
        </aside>

        <main className="auth-form-panel">
          {!isForgot && !isSignupVerification ? (
            <div className="auth-tabs">
              <button className={view === 'login' ? 'active' : ''} onClick={() => switchView('login')}>
                Login
              </button>
              <button className={view === 'register' ? 'active' : ''} onClick={() => switchView('register')}>
                Signup
              </button>
            </div>
          ) : (
            <button className="auth-back-btn" onClick={() => switchView('login')}>
              <ArrowLeft size={15} /> Back to login
            </button>
          )}

          <h3>{isSignupVerification ? 'Verify your email' : isForgot ? 'Reset Password' : isRegister ? 'Create your account' : 'Welcome back'}</h3>
          <p className="auth-sub">
            {isSignupVerification
              ? `Enter the OTP sent to ${signupVerification.email}.`
              : isForgot
              ? 'Use your email to receive and verify an OTP.'
              : isRegister
                ? 'Signup with your pet details for faster checkout.'
                : 'Login with email or mobile number.'}
          </p>

          {error && <div className="auth-alert auth-error">{error}</div>}
          {success && <div className="auth-alert auth-success">{success}</div>}

          {!isForgot && !isSignupVerification && (
            <>
              {isRegister && (
                <label className="auth-terms auth-terms-top">
                  <input
                    type="checkbox"
                    checked={regData.acceptedTerms}
                    onChange={(e) => setRegData({ ...regData, acceptedTerms: e.target.checked })}
                  />
                  <span>I accept the terms and privacy policy</span>
                </label>
              )}
              <div className="auth-google-wrap" ref={googleButtonRef} />
              <div className="auth-separator"><span>or</span></div>
            </>
          )}

          {view === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <AuthField
                icon={<Mail size={16} />}
                label="Email/Mobile"
                placeholder="Email or mobile number"
                value={loginData.identifier}
                onChange={(value) => setLoginData({ ...loginData, identifier: value })}
              />
              <PasswordField
                label="Password"
                placeholder="Your password"
                value={loginData.password}
                showPass={showPass}
                setShowPass={setShowPass}
                onChange={(value) => setLoginData({ ...loginData, password: value })}
              />
              <button className="auth-submit-btn" disabled={loading} type="submit">
                {loading ? <span className="auth-spinner" /> : <><ArrowRight size={16} /> Login</>}
              </button>
              <button type="button" className="auth-link-btn" onClick={() => switchView('forgot')}>
                Forgot Password?
              </button>
            </form>
          )}

          {view === 'verifySignup' && (
            <form className="auth-form" onSubmit={verifySignupEmail}>
              <AuthField
                icon={<ShieldCheck size={16} />}
                label="Email Verification OTP"
                placeholder="6 digit OTP"
                value={signupVerification.otp}
                onChange={(value) => setSignupVerification({ ...signupVerification, otp: value })}
                inputMode="numeric"
              />
              <button className="auth-submit-btn" disabled={loading} type="submit">
                {loading ? <span className="auth-spinner" /> : 'Verify Email'}
              </button>
              <button type="button" className="auth-link-btn" onClick={resendSignupOtp} disabled={loading}>
                Resend OTP
              </button>
            </form>
          )}

          {view === 'register' && (
            <form className="auth-form" onSubmit={handleRegister}>
              <AuthField icon={<User size={16} />} label="Full Name" placeholder="Your full name" value={regData.name} onChange={(value) => setRegData({ ...regData, name: value })} />
              <AuthField icon={<Phone size={16} />} label="Mobile Number" placeholder="10 digit mobile number" value={regData.mobile} onChange={(value) => setRegData({ ...regData, mobile: value })} inputMode="tel" />
              <AuthField icon={<Mail size={16} />} label="Email Address" placeholder="you@example.com" value={regData.email} onChange={(value) => setRegData({ ...regData, email: value })} type="email" />
              <PasswordField label="Password" placeholder="Create a password" value={regData.password} showPass={showPass} setShowPass={setShowPass} onChange={(value) => setRegData({ ...regData, password: value })} />
              <PasswordField label="Confirm Password" placeholder="Confirm your password" value={regData.confirmPassword} showPass={showPass} setShowPass={setShowPass} onChange={(value) => setRegData({ ...regData, confirmPassword: value })} />
              <AuthField icon={<ShieldCheck size={16} />} label="Pet Name" placeholder="Your pet name" value={regData.petName} onChange={(value) => setRegData({ ...regData, petName: value })} />
              <label className="auth-field">
                <span className="auth-label">Pet Type</span>
                <select
                  className="auth-input auth-select"
                  value={regData.petType}
                  onChange={(e) => setRegData({ ...regData, petType: e.target.value })}
                  required
                >
                  <option value="">Select pet type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Fish">Fish</option>
                  <option value="Small Pet">Small Pet</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <button className="auth-submit-btn" disabled={loading} type="submit">
                {loading ? <span className="auth-spinner" /> : <><ArrowRight size={16} /> Signup</>}
              </button>
            </form>
          )}

          {view === 'forgot' && forgotStep === 'email' && (
            <form className="auth-form" onSubmit={sendOtp}>
              <AuthField icon={<Mail size={16} />} type="email" label="Email" placeholder="you@example.com" value={forgotData.email} onChange={(value) => setForgotData({ ...forgotData, email: value })} />
              <button className="auth-submit-btn" disabled={loading} type="submit">
                {loading ? <span className="auth-spinner" /> : 'Send OTP'}
              </button>
            </form>
          )}

          {view === 'forgot' && forgotStep === 'otp' && (
            <form className="auth-form" onSubmit={verifyOtp}>
              <AuthField icon={<ShieldCheck size={16} />} label="Verify OTP" placeholder="6 digit OTP" value={forgotData.otp} onChange={(value) => setForgotData({ ...forgotData, otp: value })} inputMode="numeric" />
              <button className="auth-submit-btn" disabled={loading} type="submit">
                {loading ? <span className="auth-spinner" /> : 'Verify OTP'}
              </button>
              <button type="button" className="auth-link-btn" onClick={sendOtp} disabled={loading}>
                Resend OTP
              </button>
            </form>
          )}

          {view === 'forgot' && forgotStep === 'reset' && (
            <form className="auth-form" onSubmit={resetPassword}>
              <PasswordField label="Reset Password" placeholder="New password" value={forgotData.password} showPass={showPass} setShowPass={setShowPass} onChange={(value) => setForgotData({ ...forgotData, password: value })} />
              <PasswordField label="Confirm Password" placeholder="Confirm new password" value={forgotData.confirmPassword} showPass={showPass} setShowPass={setShowPass} onChange={(value) => setForgotData({ ...forgotData, confirmPassword: value })} />
              <button className="auth-submit-btn" disabled={loading} type="submit">
                {loading ? <span className="auth-spinner" /> : 'Reset Password'}
              </button>
            </form>
          )}
        </main>
      </div>

      <style>{`
        .auth-backdrop { position: fixed; inset: 0; background: rgba(24, 61, 45, 0.58); z-index: 3000; backdrop-filter: blur(8px); }
        .auth-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 3001; width: min(920px, 94vw); max-height: 92vh; overflow: hidden; display: flex; background: #fffdf8; border-radius: 18px; box-shadow: 0 30px 80px rgba(24, 61, 45, 0.28); border: 1px solid rgba(246, 164, 0, 0.18); }
        .auth-close-btn { position: absolute; top: 14px; right: 14px; z-index: 2; width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(23, 75, 54, 0.12); background: rgba(255,255,255,0.92); color: #174b36; display: grid; place-items: center; cursor: pointer; }
        .auth-close-btn:hover { background: #f6a400; color: #fff; }
        .auth-brand-panel { width: 320px; flex-shrink: 0; min-height: 590px; padding: 44px 32px; display: flex; flex-direction: column; justify-content: flex-end; background: linear-gradient(180deg, rgba(23, 75, 54, 0.25), rgba(23, 75, 54, 0.9)), url('https://images.unsplash.com/photo-1552053831-71594a27632d?w=700&q=85') center/cover; color: #fff; }
        .auth-brand-logo { width: 48px; height: 48px; border-radius: 50%; background: #f6a400; display: grid; place-items: center; font-weight: 900; margin-bottom: 14px; border: 3px solid rgba(255,255,255,.75); }
        .auth-brand-panel h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 34px; margin: 0 0 8px; }
        .auth-brand-panel p { margin: 0 0 18px; color: rgba(255,255,255,.82); line-height: 1.6; }
        .auth-brand-panel ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
        .auth-brand-panel li { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; color: rgba(255,255,255,.9); }
        .auth-form-panel { flex: 1; padding: 38px; overflow-y: auto; }
        .auth-tabs { display: grid; grid-template-columns: 1fr 1fr; background: #f5efe7; padding: 4px; border-radius: 999px; margin-bottom: 24px; }
        .auth-tabs button { border: 0; background: transparent; color: #6d776f; border-radius: 999px; padding: 10px; font-weight: 900; cursor: pointer; }
        .auth-tabs button.active { background: #fff; color: #174b36; box-shadow: 0 8px 20px rgba(24, 61, 45, 0.08); }
        .auth-back-btn, .auth-link-btn { border: 0; background: transparent; color: #174b36; font-weight: 900; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 0; }
        .auth-form-panel h3 { font-family: Georgia, 'Times New Roman', serif; color: #173d2b; font-size: 32px; margin: 0 0 8px; }
        .auth-sub { color: #66786d; margin: 0 0 18px; line-height: 1.55; font-size: 14px; }
        .auth-alert { padding: 11px 14px; border-radius: 8px; font-size: 13px; font-weight: 800; margin-bottom: 14px; }
        .auth-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
        .auth-success { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
        .auth-google-wrap { min-height: 42px; width: 100%; display: grid; place-items: center; margin-bottom: 14px; }
        .auth-google-wrap > div { width: 100% !important; }
        .auth-separator { display: flex; align-items: center; gap: 12px; color: #a08d7b; font-size: 12px; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; }
        .auth-separator::before, .auth-separator::after { content: ''; height: 1px; background: #eadfd0; flex: 1; }
        .auth-form { display: grid; gap: 14px; }
        .auth-field { display: grid; gap: 6px; }
        .auth-label { font-size: 13px; font-weight: 900; color: #173d2b; }
        .auth-input-wrap { display: flex; align-items: center; border: 1.5px solid #eadfd0; background: #fbf7f0; border-radius: 8px; color: #9a8877; }
        .auth-input-wrap:focus-within { border-color: #f6a400; background: #fff; box-shadow: 0 0 0 3px rgba(246,164,0,.14); }
        .auth-input-wrap svg { margin-left: 13px; flex-shrink: 0; }
        .auth-input { width: 100%; border: 0; outline: 0; background: transparent; padding: 12px 13px; font-size: 14px; color: #173d2b; }
        .auth-select { border: 1.5px solid #eadfd0; background: #fbf7f0; border-radius: 8px; }
        .auth-pass-toggle { border: 0; background: transparent; color: #9a8877; padding: 12px; cursor: pointer; display: grid; place-items: center; }
        .auth-terms { display: flex; align-items: center; gap: 9px; color: #52665a; font-size: 13px; font-weight: 700; }
        .auth-terms-top { margin-bottom: 14px; }
        .auth-terms input { width: 16px; height: 16px; accent-color: #f6a400; }
        .auth-submit-btn { width: 100%; border: 0; border-radius: 999px; background: #f6a400; color: #fff; padding: 13px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 10px 24px rgba(246,164,0,.26); }
        .auth-submit-btn:hover:not(:disabled) { background: #df9200; transform: translateY(-1px); }
        .auth-submit-btn:disabled, .auth-link-btn:disabled { opacity: .65; cursor: not-allowed; }
        .auth-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: authSpin .7s linear infinite; }
        @keyframes authSpin { to { transform: rotate(360deg); } }
        @media (max-width: 760px) {
          .auth-modal { flex-direction: column; }
          .auth-brand-panel { width: 100%; min-height: 170px; padding: 24px; }
          .auth-brand-panel ul { display: none; }
          .auth-brand-panel h2 { font-size: 24px; }
          .auth-form-panel { padding: 24px 20px; }
          .auth-form-panel h3 { font-size: 26px; }
        }
      `}</style>
    </>
  );
}

function AuthField({ icon, label, value, onChange, type = 'text', placeholder, inputMode }) {
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <span className="auth-input-wrap">
        {icon}
        <input
          className="auth-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={inputMode}
          required
        />
      </span>
    </label>
  );
}

function PasswordField({ label, value, onChange, placeholder, showPass, setShowPass }) {
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <span className="auth-input-wrap">
        <Lock size={16} />
        <input
          className="auth-input"
          type={showPass ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={6}
        />
        <button type="button" className="auth-pass-toggle" onClick={() => setShowPass(!showPass)} aria-label="Toggle password visibility">
          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </span>
    </label>
  );
}
