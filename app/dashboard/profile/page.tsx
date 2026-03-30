"use client";

import Image from "next/image";
import { useAuth } from "@/lib/hooks/use-auth";
import { User, Lock, Trash2, Heart, Bookmark, BarChart3, TrendingUp, Camera, X, Pencil, ImagePlus, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Card, CATEGORIES } from "@/lib/mock/cards";
import {
  COLLECTION_STORAGE_EVENT,
  deleteCollectionCard,
  getCapturedCards,
  getForSaleCards,
  getLikedCards,
  getSavedCards,
  updateCollectionCard,
} from "@/lib/store/collection-store";

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

function DeleteAccountModal({
  isOpen,
  onClose,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [confirmation, setConfirmation] = useState<"yes" | "no" | "">("");

  useEffect(() => {
    if (isOpen) {
      setConfirmation("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChoiceChange = (value: "yes" | "no") => {
    setConfirmation(value);
    if (value === "no") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-background border border-current/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-red-500">Delete Account</h3>
          <button onClick={onClose} className="p-2 hover:bg-current/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground/70 leading-relaxed">
            All data will be deleted and can never be recovered. Please confirm before continuing.
          </p>
          <div className="space-y-3 rounded-3xl border border-red-500/10 bg-red-500/5 p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="delete-account-confirmation"
                checked={confirmation === "yes"}
                onChange={() => handleChoiceChange("yes")}
                className="h-4 w-4 accent-red-500"
              />
              <span className="font-medium">Yes, delete my account permanently</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="delete-account-confirmation"
                checked={confirmation === "no"}
                onChange={() => handleChoiceChange("no")}
                className="h-4 w-4 accent-foreground"
              />
              <span className="font-medium">No, keep my account</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          disabled={confirmation !== "yes"}
          onClick={onDelete}
          className={`w-full py-4 rounded-full font-bold transition-all ${
            confirmation === "yes"
              ? "bg-red-500 text-white hover:scale-[1.02] active:scale-[0.98]"
              : "bg-current/10 text-foreground/30 cursor-not-allowed"
          }`}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

function EditCardModal({
  card,
  onClose,
}: {
  card: Card | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Card | null>(card);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(card);
  }, [card]);

  if (!card || !form) return null;

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateCollectionCard(card.id, {
      name: form.name,
      price: form.price,
      category: form.category,
      image: form.image,
    });
    onClose();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextImage = reader.result;
      if (typeof nextImage === "string") {
        setForm((current) => (current ? { ...current, image: nextImage } : current));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-background border border-current/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Edit Card</h3>
          <button onClick={onClose} className="p-2 hover:bg-current/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          <div className="space-y-4">
            <div className="relative aspect-3/4 rounded-4xl overflow-hidden border border-current/10 bg-current/5">
              <Image src={form.image} alt={form.name} fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-current/10 hover:bg-current/5 transition-all text-sm font-bold"
            >
              <ImagePlus size={16} />
              <span>Change Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">Card Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-current/5 border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-background focus:border-current/10 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">Asking Price</label>
              <input
                required
                min={0}
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-current/5 border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-background focus:border-current/10 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-current/5 border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-background focus:border-current/10 transition-all font-medium"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-foreground text-background py-4 rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all">
                Save Changes
              </button>
              <button type="button" onClick={onClose} className="px-6 py-4 rounded-full border border-current/10 font-bold hover:bg-current/5 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUserName, deleteAccount } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [forSaleCount, setForSaleCount] = useState(0);
  const [forSaleCards, setForSaleCards] = useState<Card[]>([]);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncProfile = () => {
      setCards(getCapturedCards());
      setSavedCount(getSavedCards().length);
      setLikedCount(getLikedCards().length);
      const listedCards = getForSaleCards();
      setForSaleCards(listedCards);
      setForSaleCount(listedCards.length);
    };

    syncProfile();
    window.addEventListener(COLLECTION_STORAGE_EVENT, syncProfile);
    return () => window.removeEventListener(COLLECTION_STORAGE_EVENT, syncProfile);
  }, []);

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

  useEffect(() => {
    setDraftName(user?.name || "Root Admin");
  }, [user?.name]);

  const handleSaveName = () => {
    const trimmedName = draftName.trim();
    if (!trimmedName) return;
    updateUserName(trimmedName);
    setIsEditingName(false);
  };

  const STATS = [
    { label: "Saved Items", value: savedCount, icon: Bookmark, color: "text-blue-500" },
    { label: "Liked Cards", value: likedCount, icon: Heart, color: "text-pink-500" },
    { label: "Cards for Sale", value: forSaleCount, icon: BarChart3, color: "text-green-500" },
    { label: "Total Profit", value: `$${cards.reduce((total, card) => total + card.price, 0).toLocaleString()}`, icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <div className="max-w-4xl space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-current/5 pb-10">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
        <div className="w-24 h-24 rounded-xl bg-foreground text-background flex items-center justify-center overflow-hidden border-4 border-current/5">
          {avatar ? (
            <Image src={avatar} alt="Avatar" fill className="object-cover" />
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
          <div className="flex flex-wrap items-center gap-3">
            {isEditingName ? (
              <>
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="bg-current/5 border border-transparent rounded-2xl px-4 py-2 text-2xl font-bold tracking-tight outline-none focus:bg-background focus:border-current/10 transition-all"
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 rounded-full border border-current/10 hover:bg-current/5 transition-all"
                  aria-label="Save name"
                >
                  <Check size={16} />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold tracking-tight">
                  {user?.name || "Root Admin"} <span className="text-foreground/30 font-normal text-lg ml-2">#rootadmin80</span>
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 rounded-full border border-current/10 hover:bg-current/5 transition-all"
                  aria-label="Edit name"
                >
                  <Pencil size={16} />
                </button>
              </>
            )}
          </div>
          <p className="text-foreground/60 font-medium">{user?.email || "root@gmail.com"}</p>
          <div className="flex gap-2 pt-2">
            <span className="px-2 py-1 rounded-full bg-green-500 text-[9px] font-bold uppercase tracking-widest">Verified</span>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Your Cards</h3>
            <p className="text-sm text-foreground/50">Edit card details or remove cards from your collection.</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-current/5 text-sm font-bold">
            {cards.length} cards
          </span>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="rounded-4xl border border-current/10 p-4 space-y-4 bg-background">
                <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-current/5">
                    <Image src={card.image} alt={card.name} fill className="object-cover" />
                  </div>
                <div className="space-y-1">
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">{card.category}</p>
                <h4 className="font-bold text-lg">{card.name}</h4>
                <p className="text-foreground/60 text-sm">
                    Asking Price: <span className="font-bold text-foreground">${card.price.toLocaleString()}</span>
                  </p>
                  {forSaleCards.some((listedCard) => listedCard.id === card.id) && (
                    <p className="text-xs font-bold uppercase tracking-wider text-green-500">For Sale</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-current/10 hover:bg-current/5 transition-all text-sm font-bold"
                  >
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteCollectionCard(card.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-red-500/10 text-red-500 hover:bg-red-500/5 transition-all text-sm font-bold"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-4xl border border-current/10 text-center text-foreground/40">
            No cards found in your collection yet.
          </div>
        )}
      </section>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button 
              onClick={() => setIsResetOpen(true)}
              className="w-full flex items-center justify-between p-5 rounded-2.5xl border border-current/5 hover:bg-current/5 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <Lock size={20} />
                <span className="font-bold">Reset Password</span>
              </div>
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="w-full flex items-center justify-between p-5 rounded-2.5xl border border-red-500/10 hover:bg-red-500/5 transition-all text-left text-red-500"
            >
              <div className="flex items-center gap-4">
                <Trash2 size={20} />
                <span className="font-bold">Delete Account</span>
              </div>
            </button>
          </div>
        </div>

        <ResetPasswordModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
        <DeleteAccountModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={deleteAccount}
        />
      </div>

      <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />
    </div>
  );
}
