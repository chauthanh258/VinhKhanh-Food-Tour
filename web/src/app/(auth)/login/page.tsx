"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Chrome, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

function GoogleLoginButton({ isLoading, onLoginSuccess }: { isLoading: boolean; onLoginSuccess: () => void }) {
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async () => {
      onLoginSuccess();
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  return (
    <button
      onClick={() => loginWithGoogle()}
      disabled={isLoading}
      className="w-full h-14 bg-zinc-100 hover:bg-white disabled:bg-zinc-300 text-black rounded-2xl transition-all font-semibold flex items-center justify-center gap-3 border border-zinc-200"
    >
      <Chrome className="w-5 h-5" />
      Tiếp tục với Google
    </button>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useUserStore();
  const router = useRouter();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      
      if (result.success) {
        setAuth(result.data.user, result.data.token);
        router.push("/");
      } else {
        alert(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
      setIsLoading(true);
      try {
        // In a real app, send the token to your backend
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ idToken: tokenResponse.access_token }),
        // });
        // const result = await response.json();
        
        // Mock successful Google login
        setAuth(
          { id: "1", email: "google-user@example.com", fullName: "Google User", role: "USER", language: "vi", isOnboarded: false },
          "mock-google-token"
        );
        // router.push("/");
        console.log("Google login success");
        console.log(tokenResponse);
      } catch (error) {
        console.error("Google login failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
          Chào mừng trở lại
        </h1>
        <p className="text-zinc-400">
          Đăng nhập để tiếp tục khám phá ẩm thực Quận 4
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-zinc-500 group-focus-within:text-orange-400 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-600"
              placeholder="ten@vi-du.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-zinc-300">Mật khẩu</label>
            <Link href="/forgot-password"  className="text-xs text-orange-400 hover:text-orange-300">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-zinc-500 group-focus-within:text-orange-400 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-12 text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-600"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed rounded-2xl transition-all font-semibold flex items-center justify-center gap-2 text-lg shadow-[0_4px_20px_rgba(249,115,22,0.3)] mt-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Đăng nhập <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-950 px-3 text-zinc-500">Hoặc tiếp tục với</span>
        </div>
      </div>

      <button
        onClick={() => loginWithGoogle()}
        disabled={isLoading}
        className="w-full h-14 bg-zinc-100 hover:bg-white disabled:bg-zinc-300 text-black rounded-2xl transition-all font-semibold flex items-center justify-center gap-3 border border-zinc-200"
      >
        <Chrome className="w-5 h-5" /> 
        Tiếp tục với Google
      </button> */}

      <p className="text-center text-zinc-500 mt-4">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
