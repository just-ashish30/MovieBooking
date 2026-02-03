import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebase"
import { doc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, User, Chrome, ArrowRight, CheckCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [authMode, setAuthMode] = useState("email"); // 'email' or 'phone'
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

  // --- 1. Email Registration ---
  const handleRegister = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(result.user, {
        displayName: data.name,
        photoURL: preview || null,
      });
      // Create user document in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        photoURL: preview || null,
        createdAt: new Date(),
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Google Authentication ---
  const handleGoogleAuth = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Create user document in Firestore if it doesn't exist
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
      }, { merge: true });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  // --- 3. Phone Authentication ---
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const onPhoneSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formatPhone = `+${data.phone.replace(/\D/g, '')}`;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(data.otp);
      // Create user document in Firestore for phone auth users
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        phone: result.user.phoneNumber,
        photoURL: result.user.photoURL || null,
        createdAt: new Date(),
      }, { merge: true });
      navigate("/");
    } catch (err) {
      setError("Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800">Join <span className="text-red-600">CineBook</span></h2>
          <p className="text-gray-500 mt-2">Start your cinematic journey today</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

        {/* Tab Switcher */}
        {!otpSent && (
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button 
              type="button"
              onClick={() => {setAuthMode("email"); setError("");}}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${authMode === "email" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
            >
              Email
            </button>
            <button 
              type="button"
              onClick={() => {setAuthMode("phone"); setError("");}}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${authMode === "phone" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
            >
              Phone
            </button>
          </div>
        )}

        {/* --- EMAIL FORM --- */}
        {authMode === "email" && (
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <label className="relative cursor-pointer group">
                <img src={preview || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 group-hover:border-red-200 transition" alt="Avatar" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-full transition text-white text-[10px] font-bold">UPLOAD</div>
                <input type="file" onChange={handleImage} className="hidden" accept="image/*" />
              </label>
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input {...register("name", { required: "Name is required" })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="Full Name" />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input {...register("email", { required: "Required" })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Email Address" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="password" {...register("password", { required: "Min 8 chars", minLength: 8 })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Password" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200 disabled:opacity-70">
              {loading ? "Creating..." : "Create Account"} <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* --- PHONE FORM --- */}
        {authMode === "phone" && !otpSent && (
          <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input {...register("phone", { required: "Enter with country code" })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="+1 123 456 7890" />
            </div>
            <div id="recaptcha-container"></div>
            <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition shadow-lg disabled:opacity-70">
              {loading ? "Sending..." : "Send OTP Code"}
            </button>
          </form>
        )}

        {/* --- OTP VERIFICATION --- */}
        {otpSent && (
          <form onSubmit={handleSubmit(verifyOtp)} className="space-y-4 text-center">
            <CheckCircle className="mx-auto text-green-500 w-12 h-12 mb-2" />
            <p className="text-gray-600 font-medium">Enter the 6-digit code sent to your phone</p>
            <input {...register("otp", { required: true })} className="w-full text-center text-2xl tracking-[1em] py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="000000" maxLength={6} />
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition disabled:opacity-70">
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </form>
        )}

        {/* Social Login */}
        {!otpSent && (
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">Or continue with</span></div>
            </div>

            <button type="button" onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 py-3 rounded-2xl font-bold hover:bg-gray-50 transition">
              <Chrome className="text-red-500 w-5 h-5" />
              Google
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-gray-500 text-sm">
          Already a member? <Link to="/login" className="text-red-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;