import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function WholesalerResetPasswordPage({ backendUrl }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/wholesalers/password-reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      setMessage('Password reset successfully. Please login with your new password.');
      setTimeout(() => navigate('/shop'), 1400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="wholesaler-reset-page">
      <form className="wholesaler-reset-card" onSubmit={handleSubmit}>
        <div className="reset-icon-wrap">
          <ShieldCheck size={26} />
        </div>
        <div className="reset-copy">
          <div className="reset-brand">Dr. Snoopy Wholesale</div>
          <h1>Set Your Password</h1>
          <p>Create a secure password to activate your wholesaler login.</p>
        </div>

        {error && <div className="reset-alert reset-error">{error}</div>}
        {message && <div className="reset-alert reset-success">{message}</div>}

        <div className="reset-field">
          <label className="reset-label">New Password</label>
          <div className="reset-input-wrap">
            <Lock size={17} className="reset-input-icon" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="reset-input"
              placeholder="Enter new password"
              minLength={6}
              required
            />
            <button type="button" className="reset-pass-toggle" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="reset-field">
          <label className="reset-label">Confirm Password</label>
          <div className="reset-input-wrap">
            <Lock size={17} className="reset-input-icon" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="reset-input"
              placeholder="Re-enter password"
              minLength={6}
              required
            />
          </div>
        </div>

        <div className="reset-hint">Use at least 6 characters. You will be redirected to login after saving.</div>

        <button type="submit" className="reset-submit-btn" disabled={loading}>
          {loading ? <span className="reset-spinner" /> : <><ArrowRight size={17} /> Save Password</>}
        </button>
      </form>

      <style>{`
        .wholesaler-reset-page {
          min-height: calc(100vh - 270px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 20px;
          background:
            radial-gradient(circle at 18% 15%, rgba(247, 147, 30, 0.12), transparent 30%),
            linear-gradient(180deg, #f8fbff 0%, #eef5fc 100%);
        }

        .wholesaler-reset-card {
          width: min(480px, 100%);
          background: #ffffff;
          border: 1px solid #dbe6f3;
          border-radius: 8px;
          box-shadow: 0 22px 55px rgba(10, 88, 164, 0.13);
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .reset-icon-wrap {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #eaf4ff;
          color: var(--primary-color);
          border: 1px solid #cfe3f8;
        }

        .reset-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reset-brand {
          color: var(--primary-color);
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .wholesaler-reset-card h1 {
          font-size: 30px;
          line-height: 1.12;
          margin: 0;
          color: #0f2540;
        }

        .wholesaler-reset-card p {
          color: var(--text-medium);
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
        }

        .reset-alert {
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.45;
        }

        .reset-error {
          background: #fff1f1;
          color: #c01b1b;
          border: 1px solid #ffc9c9;
        }

        .reset-success {
          background: #ecfdf3;
          color: #08703f;
          border: 1px solid #a9efc5;
        }

        .reset-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reset-label {
          color: #17324d;
          font-size: 13px;
          font-weight: 800;
        }

        .reset-input-wrap {
          min-height: 48px;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid #cddced;
          border-radius: 8px;
          transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .reset-input-wrap:focus-within {
          background: #ffffff;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(10, 88, 164, 0.11);
        }

        .reset-input-icon {
          margin-left: 14px;
          color: #6b86a3;
          flex-shrink: 0;
        }

        .reset-input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          padding: 12px 12px;
          color: #10243d;
          font-size: 15px;
          font-weight: 600;
        }

        .reset-input::placeholder {
          color: #9aacbf;
          font-weight: 500;
        }

        .reset-pass-toggle {
          width: 42px;
          height: 46px;
          border: 0;
          background: transparent;
          color: #6b86a3;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 180ms ease;
        }

        .reset-pass-toggle:hover {
          color: var(--primary-color);
        }

        .reset-hint {
          margin-top: -4px;
          color: #6b7f95;
          font-size: 12px;
          line-height: 1.5;
        }

        .reset-submit-btn {
          min-height: 50px;
          border: 0;
          border-radius: 8px;
          background: var(--secondary-color);
          color: #ffffff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 12px 24px rgba(247, 147, 30, 0.25);
          transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .reset-submit-btn:hover:not(:disabled) {
          background: var(--secondary-hover);
          transform: translateY(-1px);
          box-shadow: 0 15px 30px rgba(247, 147, 30, 0.3);
        }

        .reset-submit-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
        }

        .reset-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.38);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: resetSpin 0.75s linear infinite;
        }

        @keyframes resetSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 560px) {
          .wholesaler-reset-page {
            padding: 36px 14px;
            align-items: flex-start;
          }

          .wholesaler-reset-card {
            padding: 26px 20px;
          }

          .wholesaler-reset-card h1 {
            font-size: 26px;
          }
        }
      `}</style>
    </main>
  );
}
