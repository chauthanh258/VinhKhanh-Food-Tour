'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/i18n';

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ email: string; fullName: string } | null>(null);
  const [name, setName] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const router = useRouter();
  const { token, logout } = useUserStore();
  const t = useTranslation();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };
  
  const fetchProfile = async () => {
    try {
      if (!token) {
        router.push('/login');
        return;
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setName(data.data.fullName || '');
      } else {
        logout();
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showMessage('error', t.profile.nameRequired);
    
    setSavingName(true);
    try {
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName: name })
      });
      
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        showMessage('success', t.profile.nameUpdated);
      } else {
        showMessage('error', data.message || t.profile.updateFailed);
      }
    } catch (err) {
      showMessage('error', t.profile.errorOccurred);
    } finally {
      setSavingName(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return showMessage('error', t.profile.passwordMinLength);
    if (newPassword !== confirmPassword) return showMessage('error', t.profile.passwordMismatch);
    
    setSavingPassword(true);
    try {
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (data.success) {
        showMessage('success', t.profile.passwordUpdated);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showMessage('error', data.message || t.profile.passwordChangeFailed);
      }
    } catch (err) {
      showMessage('error', t.profile.errorOccurred);
    } finally {
      setSavingPassword(false);
    }
  };
  
  if (loading) return <div className="h-dvh bg-black flex items-center justify-center text-zinc-500">{t.profile.loading}</div>;
  
  return (
    <div className="h-screen bg-black text-white px-6 pt-12 pb-24 overflow-y-auto hide-scrollbar">
      <div className="max-w-lg mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t.profile.title}</h1>
          <p className="text-zinc-500 text-sm font-medium">{t.profile.subtitle}</p>
        </div>
        
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
        
        {/* Profile Info Form */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold">{t.profile.sectionPersonalInfo}</h2>
          </div>
          
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">{t.profile.emailLabel}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-zinc-600" />
                </div>
                <input 
                  type="email" 
                  value={profile?.email || ''} 
                  disabled 
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/50 border border-white/5 rounded-2xl text-zinc-500 cursor-not-allowed text-sm font-medium"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">{t.profile.nameLabel}</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-3.5 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm font-medium"
                placeholder={t.profile.namePlaceholder}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={savingName || name === profile?.fullName}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-500 text-white font-bold tracking-wider hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-orange-500/20 text-xs"
            >
              {savingName ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {t.profile.saveChanges}
            </button>
          </form>
        </div>
        
        {/* Change Password Form */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold">{t.profile.sectionSecurity}</h2>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">{t.profile.currentPasswordLabel}</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                className="w-full px-4 py-3.5 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm font-medium"
                placeholder={t.profile.currentPasswordPlaceholder}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">{t.profile.newPasswordLabel}</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full px-4 py-3.5 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm font-medium"
                placeholder={t.profile.newPasswordPlaceholder}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">{t.profile.confirmPasswordLabel}</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full px-4 py-3.5 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm font-medium"
                placeholder={t.profile.confirmPasswordPlaceholder}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-zinc-800 text-white font-bold tracking-wider hover:bg-zinc-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 border border-white/5 text-xs"
            >
              {savingPassword ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              {t.profile.changePassword}
            </button>
          </form>
        </div>
        <div className="h-10"></div>
      </div>
    </div>
  );
}
