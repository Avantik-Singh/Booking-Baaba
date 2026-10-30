"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, User, Phone, ShieldCheck, Eye, EyeOff, Loader2, } from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation, useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";
export function RegisterDialog({ open, onOpenChange, onLoginSuccess, onOpenSignIn, }) {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
    const [loginUser] = useLoginMutation();
    const dispatch = useAppDispatch();
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter your full name");
            return;
        }
        if (!phone.trim()) {
            toast.error("Please enter your mobile number");
            return;
        }
        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        try {
            const parts = name.trim().split(" ");
            const firstName = parts[0] || "Traveler";
            const lastName = parts.slice(1).join(" ") || "User";
            // 1. RTK Query call to Spring Boot POST /api/auth/register
            await registerUser({
                firstName,
                lastName,
                email: email.trim(),
                phoneNumber: phone.trim(),
                password,
            }).unwrap();
            const newUser = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
            };
            // 2. Automatically log them in to acquire JWT token
            try {
                const loginRes = await loginUser({
                    email: email.trim(),
                    password,
                }).unwrap();
                dispatch(setCredentials({
                    user: {
                        firstName,
                        lastName,
                        email: email.trim(),
                        phoneNumber: phone.trim(),
                    },
                    token: loginRes.token,
                }));
            }
            catch {
                // If auto-login fails, they can still sign in manually
            }
            if (typeof window !== "undefined") {
                localStorage.setItem("bb_user", JSON.stringify(newUser));
            }
            if (onLoginSuccess) {
                onLoginSuccess(newUser);
            }
            toast.success(`Account created successfully! Welcome to Booking Baba, ${newUser.name}.`);
            onOpenChange(false);
        }
        catch (err) {
            const apiErr = err;
            const rawMsg = typeof apiErr?.data === "string"
                ? apiErr.data
                : apiErr?.data?.message || apiErr?.data?.error;
            if (rawMsg && rawMsg.toLowerCase().includes("already exists")) {
                toast.error("An account with this email already exists. Please sign in instead!");
            }
            else if (rawMsg) {
                toast.error(rawMsg);
            }
            else if (apiErr?.status === "FETCH_ERROR") {
                toast.error("Cannot reach Spring Boot server. Please make sure your backend is running on http://localhost:8080.");
            }
            else {
                toast.error("Registration failed. Please check your information and try again.");
            }
        }
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 p-6 text-white text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"/>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center font-black text-sm">
              B
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-200">
              New Member Registration
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-amber-300"/>
            <span>Create Account</span>
          </DialogTitle>
          <p className="text-xs text-indigo-100 font-medium mt-1">
            Register to save traveler details, view reservations &amp; enjoy
            faster checkout
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <Input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="pl-9 h-10 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-indigo-500" required disabled={isRegistering}/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mobile (+91)
                </Label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <Input type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 h-10 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-indigo-500" required disabled={isRegistering}/>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <Input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-10 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-indigo-500" required disabled={isRegistering}/>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Create Password
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-9 h-10 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-indigo-500" required disabled={isRegistering}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" disabled={isRegistering}>
                  {showPassword ? (<EyeOff className="w-4 h-4"/>) : (<Eye className="w-4 h-4"/>)}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>
              <span>
                By registering, you agree to Booking Baba&apos;s Terms of
                Service &amp; Privacy Policy.
              </span>
            </div>

            <Button type="submit" disabled={isRegistering} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2">
              {isRegistering ? (<>
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  <span>Creating Account...</span>
                </>) : (<span>Create Account &amp; Start Booking</span>)}
            </Button>

            {/* Link to Separate Sign In Dialog */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <button type="button" onClick={() => {
            onOpenChange(false);
            onOpenSignIn?.();
        }} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>);
}
