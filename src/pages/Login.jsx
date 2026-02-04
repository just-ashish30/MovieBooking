import React, { useState } from "react";
// 🚨 FIX: Ensure this matches your folder name exactly (Config vs config)
import { auth } from "../config/firebase"; 
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Mail, Phone, Lock, Chrome, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  /**
   * Saves session to cookies for 2 hours
   * includes security flags to prevent Tracking Prevention blocks
   */
  const saveUserSession = (user) => {
    const sessionData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      token: user.accessToken,
    };
    
    Cookies.set("user_session", JSON.stringify(sessionData), { 
      expires: 2 / 24, // 2 hours
      sameSite: 'lax',
      secure: true 
    });
  };

  const handleEmailLogin = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      saveUserSession(result.user);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      saveUserSession(result.user);
      navigate("/");
    } catch (err) {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  const onPhoneSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      // Initialize invisible reCAPTCHA
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 
        size: 'invisible' 
      });
      const formatPhone = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Please check the number.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(data.otp);
      saveUserSession(result.user);
      navigate("/");
    } catch (err) {
      setError("Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-red-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Login to your CineBook account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 flex items-center gap-2">
            <span className="font-bold">!</span> {error}
          </div>
        )}

        {/* Auth Mode Switcher */}
        {!otpSent && (
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => {setAuthMode("email"); setError("");}} 
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${authMode === "email" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Email
            </button>
            <button 
              type="button"
              onClick={() => {setAuthMode("phone"); setError("");}} 
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${authMode === "phone" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Phone
            </button>
          </div>
        )}

        {/* Forms Container */}
        <div className="space-y-5">
          {authMode === "email" ? (
            <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  {...register("email", { required: true })} 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all" 
                  placeholder="Email Address" 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  {...register("password", { required: true })} 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all" 
                  placeholder="Password" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          ) : !otpSent ? (
            <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-5">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  {...register("phone", { required: true })} 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" 
                  placeholder="+1 234 567 890" 
                />
              </div>
              <div id="recaptcha-container"></div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(verifyOtp)} className="space-y-6 text-center">
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500 w-10 h-10" />
              </div>
              <input 
                {...register("otp", { required: true })} 
                className="w-full text-center text-3xl tracking-[0.5em] font-black py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" 
                placeholder="000000" 
                maxLength={6} 
              />
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-xl disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <button 
                type="button" 
                onClick={() => setOtpSent(false)} 
                className="text-xs font-bold text-gray-400 hover:text-gray-600 underline"
              >
                Change Number
              </button>
            </form>
          )}

          {/* Divider & Social */}
          {!otpSent && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="px-4 bg-white text-gray-400 font-bold">Or login with</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleAuth} 
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
              >
                <Chrome className="text-red-500 w-5 h-5" /> Continue with Google
              </button>
            </>
          )}
        </div>

        <p className="mt-10 text-center text-gray-500 font-medium">
          New here? <Link to="/register" className="text-red-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;