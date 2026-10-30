"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ticket, Menu, LogIn, UserPlus, LogOut, Sun, Moon, Shield, User as UserIcon, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { MyTripsDialog } from "@/components/booking/my-trips";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { RegisterDialog } from "@/components/auth/register-dialog";
import { ProfileDialog } from "@/components/user/profile-dialog";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { AdminManagementDialog } from "@/components/admin/admin-management-dialog";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
function isAuthUser(value) {
    return (typeof value === "object" &&
        value !== null &&
        "name" in value &&
        typeof value.name === "string" &&
        "email" in value &&
        typeof value.email === "string" &&
        (!("phone" in value) || typeof value.phone === "string"));
}
export function Navbar() {
    const [tripsOpen, setTripsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [theme, setTheme] = useState("light");
    const dispatch = useAppDispatch();
    const reduxUser = useAppSelector((state) => state.auth.user);
    const reduxAuth = useAppSelector((state) => state.auth.isAuthenticated);
    useEffect(() => {
        try {
            const stored = localStorage.getItem("bb_user");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (isAuthUser(parsed)) {
                        setCurrentUser(parsed);
                    }
                    else {
                        localStorage.removeItem("bb_user");
                    }
                }
                catch {
                    localStorage.removeItem("bb_user");
                }
            }
            const savedTheme = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                setTheme("dark");
                document.documentElement.classList.add("dark");
                document.documentElement.setAttribute("data-theme", "dark");
            }
            else {
                setTheme("light");
                document.documentElement.classList.remove("dark");
                document.documentElement.removeAttribute("data-theme");
            }
        }
        catch {
            // fallback
        }
    }, []);
    const toggleTheme = () => {
        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            setTheme("light");
            toast.info("Switched to Light mode");
        }
        else {
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
            toast.info("Switched to Dark mode");
        }
    };
    const openSignIn = () => {
        setRegisterOpen(false);
        setSignInOpen(true);
    };
    const openRegister = () => {
        setSignInOpen(false);
        setRegisterOpen(true);
    };
    const handleLogout = () => {
        setCurrentUser(null);
        dispatch(logout());
        try {
            localStorage.removeItem("bb_user");
        }
        catch {
            // ignore
        }
        toast.info("Signed out successfully.");
    };
    const activeUser = reduxUser || currentUser;
    const isUserLoggedIn = reduxAuth || !!activeUser;
    const displayName = reduxUser?.firstName ||
        currentUser?.name ||
        activeUser?.email?.split("@")[0] ||
        "User";
    return (<header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-slate-900/85 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl tracking-tighter">B</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Booking Baba
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-0.5">
                Har Safar, Ek Jagah
              </p>
            </div>
          </Link>
        </div>

        {/* Secondary Links & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* My Trips */}
          <Button variant="ghost" size="sm" onClick={() => setTripsOpen(true)} className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm rounded-lg cursor-pointer">
            <Ticket className="w-4 h-4 text-amber-500"/>
            <span className="hidden sm:inline">My Trips</span>
          </Button>

          {/* Admin Management Button */}
          <Button variant="ghost" size="sm" onClick={() => setAdminOpen(true)} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm rounded-lg cursor-pointer" title="Fleet & Route Operations">
            <Shield className="w-4 h-4 text-indigo-500"/>
            <span className="hidden sm:inline">Admin</span>
          </Button>

          {/* Real-time Notifications Bell */}
          <NotificationBell />

          {/* Theme Toggle Button */}
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm rounded-xl px-2.5 h-9 border border-slate-200/90 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 shadow-2xs cursor-pointer transition-colors" title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"} aria-label="Toggle theme">
            {theme === "dark" ? (<Sun className="w-4 h-4 text-amber-500 fill-amber-500"/>) : (<Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400"/>)}
          </Button>

          {/* User Auth Section */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            {isUserLoggedIn ? (<div className="flex items-center gap-2">
                <button type="button" onClick={() => setProfileOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer" title="Click to view & edit profile">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                    {displayName}
                  </span>
                </button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-slate-800 h-8 px-2 rounded-lg cursor-pointer" title="Sign out">
                  <LogOut className="w-3.5 h-3.5 mr-1"/> Sign Out
                </Button>
              </div>) : (<div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={openSignIn} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm rounded-xl cursor-pointer">
                  <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400"/>
                  <span>Sign In</span>
                </Button>

                <Button size="sm" onClick={openRegister} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-sm shadow-indigo-600/20 cursor-pointer transition-transform hover:scale-[1.02]">
                  <UserPlus className="w-4 h-4"/>
                  <span>Register</span>
                </Button>
              </div>)}
          </div>

          {/* Mobile menu sheet */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                <Menu className="h-5 w-5"/>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <SheetHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
                  <SheetTitle className="text-left font-bold text-indigo-600 dark:text-indigo-400">
                    Booking Baba
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2 text-xs border-slate-200 dark:border-slate-700" onClick={() => {
            setTripsOpen(true);
            setMobileMenuOpen(false);
        }}>
                    <Ticket className="w-4 h-4 text-amber-500"/> My Trips
                  </Button>

                  <Button variant="outline" className="w-full justify-start gap-2 text-xs border-slate-200 dark:border-slate-700" onClick={() => {
            setAdminOpen(true);
            setMobileMenuOpen(false);
        }}>
                    <Shield className="w-4 h-4 text-indigo-500"/> Admin Transport Management
                  </Button>

                  {isUserLoggedIn ? (<div className="p-3 bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {displayName}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {activeUser?.email}
                          </p>
                        </div>
                      </div>

                      <Button variant="secondary" size="sm" onClick={() => {
                setProfileOpen(true);
                setMobileMenuOpen(false);
            }} className="w-full text-xs font-medium justify-center h-8 gap-1.5">
                        <UserIcon className="w-3.5 h-3.5"/> My Profile
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
            }} className="w-full text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 justify-center h-8">
                        <LogOut className="w-3.5 h-3.5 mr-1"/> Sign Out
                      </Button>
                    </div>) : (<div className="grid grid-cols-2 gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => {
                openSignIn();
                setMobileMenuOpen(false);
            }} className="w-full text-xs font-bold rounded-xl border-slate-200 dark:border-slate-700 dark:text-slate-200">
                        <LogIn className="w-3.5 h-3.5 mr-1"/> Sign In
                      </Button>
                      <Button size="sm" onClick={() => {
                openRegister();
                setMobileMenuOpen(false);
            }} className="w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm">
                        <UserPlus className="w-3.5 h-3.5 mr-1"/> Register
                      </Button>
                    </div>)}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <MyTripsDialog open={tripsOpen} onOpenChange={setTripsOpen}/>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen}/>
      <AdminManagementDialog open={adminOpen} onOpenChange={setAdminOpen}/>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} onLoginSuccess={(u) => setCurrentUser(u)} onOpenRegister={openRegister}/>
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} onLoginSuccess={(u) => setCurrentUser(u)} onOpenSignIn={openSignIn}/>
    </header>);
}
