"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store";
import { useUpdateUserMutation, useGetUserByIdQuery } from "@/store/api/userApi";
import { updateUserProfile } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { User, Phone, Mail, Loader2, CheckCircle2 } from "lucide-react";
export function ProfileDialog({ open, onOpenChange }) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const userId = user?.id || 1;
    const { data: dbUser, isLoading: isFetching } = useGetUserByIdQuery(userId, {
        skip: !open || !userId,
    });
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    useEffect(() => {
        if (dbUser) {
            setFirstName(dbUser.firstName || "");
            setLastName(dbUser.lastName || "");
            setEmail(dbUser.email || "");
            setPhoneNumber(dbUser.phoneNumber || "");
        }
        else if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
            setPhoneNumber(user.phoneNumber || "");
        }
    }, [dbUser, user, open]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !email.trim()) {
            toast.error("First name and email are required.");
            return;
        }
        try {
            const updated = await updateUser({
                id: userId,
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                },
            }).unwrap();
            dispatch(updateUserProfile({
                firstName: updated.firstName || firstName,
                lastName: updated.lastName || lastName,
                email: updated.email || email,
                phoneNumber: updated.phoneNumber || phoneNumber,
            }));
            toast.success("Profile updated successfully!");
            onOpenChange(false);
        }
        catch (err) {
            const errorMsg = err?.data?.message ||
                "Could not update profile. Please try again.";
            toast.error(errorMsg);
        }
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-primary">
            <User className="w-5 h-5"/>
            <DialogTitle className="text-xl font-bold">My Profile</DialogTitle>
          </div>
          <DialogDescription>
            View and manage your personal account information and travel preferences.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (<div className="flex flex-col items-center justify-center py-8 space-y-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary"/>
            <p className="text-sm">Loading your account details...</p>
          </div>) : (<form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold">
                  First Name
                </Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Rahul" required/>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold">
                  Last Name
                </Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Sharma"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground"/>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="name@example.com" required/>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber" className="text-xs font-semibold">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground"/>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="pl-9" placeholder="+91 98765 43210"/>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="gap-2">
                {isUpdating ? (<>
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    Saving...
                  </>) : (<>
                    <CheckCircle2 className="w-4 h-4"/>
                    Save Changes
                  </>)}
              </Button>
            </DialogFooter>
          </form>)}
      </DialogContent>
    </Dialog>);
}
