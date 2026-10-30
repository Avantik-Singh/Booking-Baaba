"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";

export function SignInDialog({
  open,
  onOpenChange,
  onLoginSuccess,
  onOpenRegister,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    try {
      // RTK Query login mutation to Spring Boot /api/auth/login
      const response = await login({
        email: email.trim(),
        password,
      }).unwrap();
      const userName = email.includes("@") ? email.split("@")[0] : "Traveler";
      const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
      const loggedUser = {
        name: displayName,
        email: email.trim(),
        phone: "9876543210",
      };
      // Store in Redux State
      dispatch(
        setCredentials({
          user: {
            email: email.trim(),
            firstName: displayName,
          },
          token: response.token,
        }),
      );
      if (onLoginSuccess) {
        onLoginSuccess(loggedUser);
      }
      toast.success(`Welcome back, ${displayName}! You are signed in.`);
      onOpenChange(false);
    } catch (err) {
      const apiErr = err;
      const rawMsg =
        typeof apiErr?.data === "string"
          ? apiErr.data
          : apiErr?.data?.message || apiErr?.data?.error;
      if (rawMsg && rawMsg.toLowerCase().includes("user not found")) {
        toast.error(
          "Account not found with this email. Please register first!",
        );
      } else if (rawMsg && rawMsg.toLowerCase().includes("password")) {
        toast.error("Incorrect password. Please verify and try again.");
      } else if (rawMsg) {
        toast.error(rawMsg);
      } else if (apiErr?.status === "FETCH_ERROR") {
        toast.error(
          "Cannot reach Spring Boot server. Please make sure your backend is running on http://localhost:8080.",
        );
      } else {
        toast.error("Could not sign in. Please verify your credentials.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 text-white text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center font-black text-sm">
              B
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-200">
              Booking Baba Member
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <LogIn className="w-6 h-6 text-amber-300" />
            <span>Sign In</span>
          </DialogTitle>
          <p className="text-xs text-indigo-100 font-medium mt-1">
            Access your booked tickets, seat reservations, and traveler profiles
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-indigo-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Password reset OTP sent to registered mobile.")
                  }
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 h-11 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-indigo-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Backend...</span>
                </>
              ) : (
                <span>Sign In to Booking Baba</span>
              )}
            </Button>

            {/* Link to Separate Register Dialog */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenRegister?.();
                  }}
                  className="font-bold text-indigo-600 dark:text-blue-900 hover:underline cursor-pointer"
                >
                  Create an account (Register)
                </button>
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
