"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useGetNotificationsQuery, useDeleteNotificationMutation, } from "@/store/api/notificationApi";
import { Bell, Trash2, CheckCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const { data: notifications = [], isLoading, refetch } = useGetNotificationsQuery(undefined, {
        pollingInterval: 15000, // Poll for fresh alerts every 15 seconds
    });
    const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
    const count = notifications.length;
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await deleteNotification(id).unwrap();
            toast.success("Notification dismissed");
        }
        catch {
            toast.error("Failed to dismiss notification");
        }
    };
    const formatDate = (dateStr) => {
        if (!dateStr)
            return "Just now";
        try {
            const d = new Date(dateStr);
            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
                " · " +
                d.toLocaleDateString([], { month: "short", day: "numeric" });
        }
        catch {
            return dateStr;
        }
    };
    return (<Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="relative inline-flex items-center justify-center rounded-lg h-9 w-9 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" aria-label="Notifications">
        <Bell className="w-5 h-5"/>
        {count > 0 && (<span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-pulse">
            {count > 9 ? "9+" : count}
          </span>)}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 sm:w-96 p-0 shadow-lg border border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-primary"/>
            <h4 className="font-semibold text-sm">Notifications</h4>
          </div>
          {count > 0 && (<span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
              {count} {count === 1 ? "alert" : "alerts"}
            </span>)}
        </div>

        <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
          {isLoading ? (<div className="py-8 flex flex-col items-center justify-center text-muted-foreground space-y-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary"/>
              <p className="text-xs">Fetching alerts...</p>
            </div>) : count === 0 ? (<div className="py-10 text-center text-muted-foreground space-y-2 px-4">
              <CheckCircle className="w-8 h-8 mx-auto text-muted-foreground/40"/>
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground/80">
                You will receive alerts here when you book or cancel travel.
              </p>
            </div>) : (notifications.map((notif) => (<div key={notif.id} className="p-3.5 hover:bg-muted/30 transition-colors flex items-start justify-between gap-3 group">
                <div className="space-y-1 text-left flex-1">
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center text-[10px] text-muted-foreground space-x-1 pt-0.5">
                    <Clock className="w-3 h-3"/>
                    <span>{formatDate(notif.createdAt)}</span>
                  </div>
                </div>

                <Button variant="ghost" size="icon" onClick={(e) => handleDelete(notif.id, e)} className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-70 group-hover:opacity-100 transition-opacity" title="Dismiss notification" disabled={isDeleting}>
                  <Trash2 className="w-3.5 h-3.5"/>
                </Button>
              </div>)))}
        </div>
      </PopoverContent>
    </Popover>);
}
