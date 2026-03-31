"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bookmark,
  Camera,
  Check,
  Heart,
  ImagePlus,
  Lock,
  Pencil,
  Trash2,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
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

function ResetPasswordModal({
  isOpen,
  onClose,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  onReset: (currentPassword: string, newPassword: string) => Promise<boolean>;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    const didReset = await onReset(currentPassword, newPassword);
    setIsSubmitting(false);

    if (!didReset) {
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[2.5rem] border border-current/10 bg-background p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Reset Password</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-current/5"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="space-y-4 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <Lock size={32} />
            </div>
            <p className="font-bold text-green-500">Password Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-2xl border border-transparent bg-current/5 px-5 py-4 font-medium outline-none transition-all focus:border-current/10 focus:bg-background"
                placeholder="Current password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-transparent bg-current/5 px-5 py-4 font-medium outline-none transition-all focus:border-current/10 focus:bg-background"
                placeholder="New password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-transparent bg-current/5 px-5 py-4 font-medium outline-none transition-all focus:border-current/10 focus:bg-background"
                placeholder="Confirm new password"
              />
            </div>
            {error ? <p className="text-xs font-bold text-red-500">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-full bg-foreground py-4 font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
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

  if (!isOpen) return null;

  const handleChoiceChange = (value: "yes" | "no") => {
    setConfirmation(value);
    if (value === "no") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[2.5rem] border border-current/10 bg-background p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-red-500">Delete Account</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-current/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium leading-relaxed text-foreground/70">
            All data will be deleted and can never be recovered. Please confirm
            before continuing.
          </p>
          <div className="space-y-3 rounded-3xl border border-red-500/10 bg-red-500/5 p-5">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="delete-account-confirmation"
                checked={confirmation === "yes"}
                onChange={() => handleChoiceChange("yes")}
                className="h-4 w-4 accent-red-500"
              />
              <span className="font-medium">Yes, delete my account permanently</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
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
          className={`w-full rounded-full py-4 font-bold transition-all ${
            confirmation === "yes"
              ? "bg-red-500 text-white hover:scale-[1.02] active:scale-[0.98]"
              : "cursor-not-allowed bg-current/10 text-foreground/30"
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-4xl border border-current/10 bg-background p-4 shadow-2xl space-y-5 sm:rounded-[2.5rem] sm:p-8 sm:space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold sm:text-2xl">Edit Card</h3>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-current/5"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr] sm:gap-6"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="relative mx-auto aspect-4/5 w-full max-w-55 overflow-hidden rounded-3xl border border-current/10 bg-current/5 sm:max-w-none sm:aspect-3/4 sm:rounded-4xl">
              <Image src={form.image} alt={form.name} fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-current/10 px-4 py-3 text-sm font-bold transition-all hover:bg-current/5"
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
                className="w-full rounded-2xl border border-transparent bg-current/5 px-4 py-3.5 font-medium outline-none transition-all focus:border-current/10 focus:bg-background sm:px-5 sm:py-4"
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
                className="w-full rounded-2xl border border-transparent bg-current/5 px-4 py-3.5 font-medium outline-none transition-all focus:border-current/10 focus:bg-background sm:px-5 sm:py-4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-2xl border border-transparent bg-current/5 px-4 py-3.5 font-medium outline-none transition-all focus:border-current/10 focus:bg-background sm:px-5 sm:py-4"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full border border-current/10 px-6 py-3.5 font-bold transition-all hover:bg-current/5 sm:w-auto sm:py-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-foreground py-3.5 font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98] sm:py-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUserName, changePassword, deleteAccount } = useAuth();
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
  const [draftName, setDraftName] = useState(user?.name || "Collector");
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

  const handleSaveName = () => {
    const trimmedName = draftName.trim();
    if (!trimmedName) return;

    void updateUserName(trimmedName).then((didUpdate) => {
      if (didUpdate) {
        setIsEditingName(false);
      }
    });
  };

  const STATS = [
    { label: "Saved Items", value: savedCount, icon: Bookmark, color: "text-blue-500" },
    { label: "Liked Cards", value: likedCount, icon: Heart, color: "text-pink-500" },
    { label: "Cards for Sale", value: forSaleCount, icon: BarChart3, color: "text-green-500" },
    {
      label: "Total Profit",
      value: `$${cards.reduce((total, card) => total + card.price, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="max-w-4xl space-y-10">
      <div className="flex flex-col items-start gap-8 border-b border-current/5 pb-10 md:flex-row md:items-center">
        <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-4 border-current/5 bg-foreground text-background">
            {avatar ? (
              <Image src={avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <User size={64} />
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
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
                  className="rounded-2xl border border-transparent bg-current/5 px-4 py-2 text-2xl font-bold tracking-tight outline-none transition-all focus:border-current/10 focus:bg-background"
                />
                <button
                  onClick={handleSaveName}
                  className="rounded-full border border-current/10 p-2 transition-all hover:bg-current/5"
                  aria-label="Save name"
                >
                  <Check size={16} />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold tracking-tight">
                  {user?.name || "Collector"}{" "}
                  <span className="ml-2 text-lg font-normal text-foreground/30">
                    #{(user?.email || "collector").split("@")[0]}
                  </span>
                </h2>
                <button
                  onClick={() => {
                    setDraftName(user?.name || "Collector");
                    setIsEditingName(true);
                  }}
                  className="rounded-full border border-current/10 p-2 transition-all hover:bg-current/5"
                  aria-label="Edit name"
                >
                  <Pencil size={16} />
                </button>
              </>
            )}
          </div>
          <p className="font-medium text-foreground/60">{user?.email || "No email"}</p>
          <div className="flex gap-2 pt-2">
            <span className="rounded-full bg-green-500 px-2 py-1 text-[9px] font-bold uppercase tracking-widest">
              Verified
            </span>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Your Cards</h3>
            <p className="text-sm text-foreground/50">
              Edit card details or remove cards from your collection.
            </p>
          </div>
          <span className="rounded-full bg-current/5 px-4 py-2 text-sm font-bold">
            {cards.length}
          </span>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <div key={card.id} className="space-y-4 rounded-4xl border border-current/10 bg-background p-4">
                <div className="relative aspect-3/4 overflow-hidden rounded-3xl bg-current/5">
                  <Image src={card.image} alt={card.name} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">
                    {card.category}
                  </p>
                  <h4 className="text-lg font-bold">{card.name}</h4>
                  <p className="text-sm text-foreground/60">
                    Asking Price:{" "}
                    <span className="font-bold text-foreground">
                      ${card.price.toLocaleString()}
                    </span>
                  </p>
                  {forSaleCards.some((listedCard) => listedCard.id === card.id) ? (
                    <p className="text-xs font-bold uppercase tracking-wider text-green-500">
                      For Sale
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-current/10 px-4 py-3 text-sm font-bold transition-all hover:bg-current/5"
                  >
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteCollectionCard(card.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-500/10 px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-500/5"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-4xl border border-current/10 p-10 text-center text-foreground/40">
            No cards found in your collection yet.
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold">Your Activity</h3>
          <p className="text-sm text-foreground/50">
            Saved cards, likes, listings, and overall collection movement.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="space-y-4 rounded-3xl border border-current/10 p-6">
                <div className={`w-fit rounded-2xl bg-current/5 p-3 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-foreground/40">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Account Settings</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <button
              onClick={() => setIsResetOpen(true)}
              className="w-full rounded-2.5xl border border-current/5 p-5 text-left transition-all hover:bg-current/5"
            >
              <div className="flex items-center gap-4">
                <Lock size={20} />
                <span className="font-bold">Reset Password</span>
              </div>
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="w-full rounded-2.5xl border border-red-500/10 p-5 text-left text-red-500 transition-all hover:bg-red-500/5"
            >
              <div className="flex items-center gap-4">
                <Trash2 size={20} />
                <span className="font-bold">Delete Account</span>
              </div>
            </button>
          </div>
        </div>

        <ResetPasswordModal
          isOpen={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          onReset={changePassword}
        />
        <DeleteAccountModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={() => {
            void deleteAccount();
          }}
        />
      </div>

      <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />
    </div>
  );
}
