"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { User, Bell, Lock, Trash2, Heart, Bookmark, BarChart3, TrendingUp, Camera, X } from "lucide-react";
import { useState, useRef } from "react";

function ResetPasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-background border border-current/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Reset Password</h3>
          <button onClick={onClose} className="p-2 hover:bg-current/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <Lock size={32} />
            </div>
            <p className="font-bold text-green-500">Password Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">New Password</label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-current/5 border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-background focus:border-current/10 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">Confirm New Password</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-current/5 border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-background focus:border-current/10 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs font-bold text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-foreground text-background py-4 rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const STATS = [
    { label: "Saved Items", value: 12, icon: Bookmark, color: "text-blue-500" },
    { label: "Liked Cards", value: 45, icon: Heart, color: "text-pink-500" },
    { label: "Cards for Sale", value: 8, icon: BarChart3, color: "text-green-500" },
    { label: "Total Profit", value: "$4,250", icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <div className="max-w-4xl space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-current/5 pb-10">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          <div className="w-24 h-24 rounded-xl bg-foreground text-background flex items-center justify-center overflow-hidden border-4 border-current/5">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={64} />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
            <Camera className="text-white" size={24} />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {user?.name || "Root Admin"} <span className="text-foreground/30 font-normal text-lg ml-2">#rootadmin80</span>
          </h2>
          <p className="text-foreground/60 font-medium">{user?.email || "root@gmail.com"}</p>
          <div className="flex gap-2 pt-2">
            <span className="px-2 py-1 rounded-full bg-green-500 text-[9px] font-bold uppercase tracking-widest">Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-6 rounded-3xl border border-current/10 space-y-4">
              <div className={`p-3 rounded-2xl bg-current/5 w-fit ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground/40 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Account Settings</h3>
          <div className="space-y-3">
            {/* <button className="w-full flex items-center justify-between p-5 rounded-2.5xl border border-current/5 hover:bg-current/5 transition-all text-left">
              <div className="flex items-center gap-4">
                <Bell size={20} />
                <span className="font-bold">Notifications</span>
              </div>
              <span className="text-xs font-bold text-foreground/30">Enabled</span>
            </button> */}
            <button 
              onClick={() => setIsResetOpen(true)}
              className="w-full flex items-center justify-between p-5 rounded-2.5xl border border-current/5 hover:bg-current/5 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <Lock size={20} />
                <span className="font-bold">Reset Password</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-5 rounded-2.5xl border border-red-500/10 hover:bg-red-500/5 transition-all text-left text-red-500">
              <div className="flex items-center gap-4">
                <Trash2 size={20} />
                <span className="font-bold">Delete Account</span>
              </div>
            </button>
          </div>
        </div>

        <ResetPasswordModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />

        {/* <div className="p-8 rounded-[2.5rem] bg-current/5 border border-current/5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Estimated Portfolio Value</h3>
            <p className="text-foreground/60 leading-relaxed text-sm">
              Your collection has grown by 12% in the last 30 days. You have 3 cards that are currently high in demand.
            </p>
          </div>
          <div className="pt-6">
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Total Value</p>
            <p className="text-3xl font-bold tracking-tighter">$95,000</p>
            <button className="mt-6 w-full bg-foreground text-background py-4 rounded-full font-bold transition-all">
              View Detailed Analytics
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
