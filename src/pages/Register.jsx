import React, { useState } from "react";
// 🚨 Ensure the folder name casing (Config vs config) matches your sidebar exactly
import { auth, db } from "../Config/firebase"; 
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
import Cookies from "js-cookie";
import { Mail, Phone, Lock, User, Chrome, ArrowRight, CheckCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [authMode, setAuthMode] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  // Helper to save session for 2 hours with security flags
  const saveUserSession = (user) => {
    const sessionData = { 
      uid: user.uid, 
      email: user.email, 
      name: user.displayName, 
      photoURL: user.photoURL,
      token: user.accessToken 
    };
    Cookies.set("user_session", JSON.stringify(sessionData), { 
      expires: 2 / 24,
      sameSite: 'lax',
      secure: true 
    });
  };

  // 1. Email Registration
  const handleRegister = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update Firebase Profile
      await updateProfile(result.user, { 
        displayName: data.name, 
        photoURL: preview 
      });

      // Save to Firestore
      await setDoc(doc(db, "users", result.user.uid), { 
        uid: result.user.uid, 
        name: data.name, 
        email: data.email, 
        photoURL: preview, 
        createdAt: new Date() 
      });

      saveUserSession(result.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Google Auth
  const handleGoogleAuth = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Save/Merge to Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
      }, { merge: true });

      saveUserSession(result.user);
      navigate("/");
    } catch (err) {
      setError("Google Registration failed.");
    }
  };

  // 3. Phone Auth
  const onPhoneSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      const formatPhone = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(data.otp);
      
      // Save Phone user to Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        phone: result.user.phoneNumber,
        createdAt: new Date(),
      }, { merge: true });

      saveUserSession(result.user);
      navigate("/");
    } catch (err) {
      setError("Invalid OTP.");
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800">Join <span className="text-red-600">CineBook</span></h2>
          <p className="text-gray-500 mt-2">Create your account to get started</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

        {!otpSent && (
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button type="button" onClick={() => setAuthMode("email")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${authMode === "email" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}>Email</button>
            <button type="button" onClick={() => setAuthMode("phone")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${authMode === "phone" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}>Phone</button>
          </div>
        )}

        {authMode === "email" ? (
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <label className="relative cursor-pointer group">
                <img 
                  src={preview || "https://i.pravatar.cc/150"} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 group-hover:border-red-200 transition" 
                  alt="Avatar" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-full transition text-white text-[10px] font-bold">UPLOAD</div>
                <input type="file" onChange={handleImage} className="hidden" accept="image/*" />
              </label>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input {...register("name", { required: true })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition" placeholder="Full Name" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input {...register("email", { required: true })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition" placeholder="Email" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="password" {...register("password", { required: true, minLength: 6 })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition" placeholder="Password" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"} <ArrowRight size={18} />
            </button>
          </form>
        ) : !otpSent ? (
          <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input {...register("phone", { required: true })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" placeholder="+1 234 567 890" />
            </div>
            <div id="recaptcha-container"></div>
            <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition shadow-lg disabled:opacity-50">
              {loading ? "Sending..." : "Send OTP Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(verifyOtp)} className="space-y-4 text-center">
             <CheckCircle className="mx-auto text-green-500 w-12 h-12 mb-2" />
             <input {...register("otp", { required: true })} className="w-full text-center text-2xl tracking-[1em] py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" placeholder="000000" maxLength={6} />
             <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-xl">
               Verify & Register
             </button>
          </form>
        )}

        {!otpSent && (
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">Or continue with</span></div>
            </div>
            <button type="button" onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 py-3 rounded-2xl font-bold hover:bg-gray-50 transition">
              <Chrome className="text-red-500 w-5 h-5" /> Google
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-gray-500 text-sm font-medium">
          Already a member? <Link to="/login" className="text-red-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;