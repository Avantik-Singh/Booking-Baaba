"use client";
import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useGetBusesQuery, useCreateBusMutation, useDeleteBusMutation, useGetTrainsQuery, useCreateTrainMutation, useDeleteTrainMutation, useGetFlightsQuery, useCreateFlightMutation, useDeleteFlightMutation, } from "@/store/api/transportApi";
import { Bus, Train, Plane, Plus, Trash2, Loader2, Search, ArrowRight, MapPin, IndianRupee, Users, Sparkles, ChevronUp, } from "lucide-react";
import { toast } from "sonner";
export function AdminManagementDialog({ open, onOpenChange, }) {
    const [activeTab, setActiveTab] = useState("buses");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    // Bus state & hooks
    const { data: buses = [], isLoading: loadingBuses } = useGetBusesQuery(undefined, {
        skip: !open,
    });
    const [createBus, { isLoading: creatingBus }] = useCreateBusMutation();
    const [deleteBus] = useDeleteBusMutation();
    const [busNumber, setBusNumber] = useState("");
    const [busName, setBusName] = useState("");
    const [busSource, setBusSource] = useState("");
    const [busDest, setBusDest] = useState("");
    const [busFare, setBusFare] = useState("");
    const [busSeats, setBusSeats] = useState("40");
    // Train state & hooks
    const { data: trains = [], isLoading: loadingTrains } = useGetTrainsQuery(undefined, {
        skip: !open,
    });
    const [createTrain, { isLoading: creatingTrain }] = useCreateTrainMutation();
    const [deleteTrain] = useDeleteTrainMutation();
    const [trainNumber, setTrainNumber] = useState("");
    const [trainName, setTrainName] = useState("");
    const [trainSource, setTrainSource] = useState("");
    const [trainDest, setTrainDest] = useState("");
    const [trainFare, setTrainFare] = useState("");
    const [trainSeats, setTrainSeats] = useState("120");
    // Flight state & hooks
    const { data: flights = [], isLoading: loadingFlights } = useGetFlightsQuery(undefined, {
        skip: !open,
    });
    const [createFlight, { isLoading: creatingFlight }] = useCreateFlightMutation();
    const [deleteFlight] = useDeleteFlightMutation();
    const [flightNumber, setFlightNumber] = useState("");
    const [airline, setAirline] = useState("");
    const [flightSource, setFlightSource] = useState("");
    const [flightDest, setFlightDest] = useState("");
    const [flightFare, setFlightFare] = useState("");
    const [flightSeats, setFlightSeats] = useState("180");
    // Filtered lists
    const filteredBuses = useMemo(() => {
        if (!searchQuery.trim())
            return buses;
        const q = searchQuery.toLowerCase();
        return buses.filter((b) => b.name?.toLowerCase().includes(q) ||
            b.number?.toLowerCase().includes(q) ||
            b.busSource?.toLowerCase().includes(q) ||
            b.busDestination?.toLowerCase().includes(q));
    }, [buses, searchQuery]);
    const filteredTrains = useMemo(() => {
        if (!searchQuery.trim())
            return trains;
        const q = searchQuery.toLowerCase();
        return trains.filter((t) => t.trainName?.toLowerCase().includes(q) ||
            t.trainNumber?.toLowerCase().includes(q) ||
            t.trainSource?.toLowerCase().includes(q) ||
            t.trainDestination?.toLowerCase().includes(q));
    }, [trains, searchQuery]);
    const filteredFlights = useMemo(() => {
        if (!searchQuery.trim())
            return flights;
        const q = searchQuery.toLowerCase();
        return flights.filter((f) => f.flightAirline?.toLowerCase().includes(q) ||
            f.Number?.toLowerCase().includes(q) ||
            f.flightSource?.toLowerCase().includes(q) ||
            f.flightDestination?.toLowerCase().includes(q));
    }, [flights, searchQuery]);
    // Handlers
    const handleAddBus = async (e) => {
        e.preventDefault();
        if (!busNumber || !busName || !busSource || !busDest || !busFare) {
            toast.error("Please fill in all required route parameters.");
            return;
        }
        try {
            await createBus({
                busNumber,
                busName,
                source: busSource,
                destination: busDest,
                fare: parseFloat(busFare),
                availableSeats: parseInt(busSeats, 10) || 40,
            }).unwrap();
            toast.success(`Service ${busNumber} (${busName}) registered successfully!`);
            setBusNumber("");
            setBusName("");
            setBusSource("");
            setBusDest("");
            setBusFare("");
            setShowAddForm(false);
        }
        catch {
            toast.error("Failed to register bus route. Please verify backend connection.");
        }
    };
    const handleDeleteBus = async (id, name) => {
        try {
            await deleteBus(id).unwrap();
            toast.success(`Service ${name || `#${id}`} decommissioned.`);
        }
        catch {
            toast.error("Failed to decommission service.");
        }
    };
    const handleAddTrain = async (e) => {
        e.preventDefault();
        if (!trainNumber || !trainName || !trainSource || !trainDest || !trainFare) {
            toast.error("Please fill in all required train schedule parameters.");
            return;
        }
        try {
            await createTrain({
                trainNumber,
                trainName,
                source: trainSource,
                destination: trainDest,
                fare: parseFloat(trainFare),
                availableSeats: parseInt(trainSeats, 10) || 120,
            }).unwrap();
            toast.success(`Train schedule ${trainNumber} (${trainName}) created successfully!`);
            setTrainNumber("");
            setTrainName("");
            setTrainSource("");
            setTrainDest("");
            setTrainFare("");
            setShowAddForm(false);
        }
        catch {
            toast.error("Failed to create train schedule.");
        }
    };
    const handleDeleteTrain = async (id, name) => {
        try {
            await deleteTrain(id).unwrap();
            toast.success(`Train schedule ${name || `#${id}`} removed.`);
        }
        catch {
            toast.error("Failed to remove train schedule.");
        }
    };
    const handleAddFlight = async (e) => {
        e.preventDefault();
        if (!flightNumber || !airline || !flightSource || !flightDest || !flightFare) {
            toast.error("Please fill in all required aviation schedule parameters.");
            return;
        }
        try {
            await createFlight({
                flightNumber,
                airline,
                source: flightSource,
                destination: flightDest,
                fare: parseFloat(flightFare),
                totalSeats: parseInt(flightSeats, 10) || 180,
                flightAvailableSeats: parseInt(flightSeats, 10) || 180,
            }).unwrap();
            toast.success(`Flight route ${flightNumber} (${airline}) registered successfully!`);
            setFlightNumber("");
            setAirline("");
            setFlightSource("");
            setFlightDest("");
            setFlightFare("");
            setShowAddForm(false);
        }
        catch {
            toast.error("Failed to register flight route.");
        }
    };
    const handleDeleteFlight = async (id, num) => {
        try {
            await deleteFlight(id).unwrap();
            toast.success(`Flight schedule ${num || `#${id}`} removed.`);
        }
        catch {
            toast.error("Failed to remove flight schedule.");
        }
    };
    const totalServices = buses.length + trains.length + flights.length;
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl shadow-2xl border-border/80">
        <DialogHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-amber-300"/>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Fleet & Route Operations
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Live inventory dispatch, route cataloging, and automated fare management.
                </DialogDescription>
              </div>
            </div>

            {/* Live Operational Indicator */}
            <div className="flex items-center gap-2 self-start sm:self-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              Network Live
            </div>
          </div>

          {/* Operational Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 bg-muted/40 border border-border/70 rounded-xl">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                Total Services
              </span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">
                {totalServices}
              </span>
            </div>

            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 rounded-xl">
              <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Bus className="w-3.5 h-3.5"/> Buses
              </span>
              <span className="text-xl font-bold text-indigo-950 dark:text-indigo-200 mt-0.5 block">
                {buses.length}
              </span>
            </div>

            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Train className="w-3.5 h-3.5"/> Rail Routes
              </span>
              <span className="text-xl font-bold text-emerald-950 dark:text-emerald-200 mt-0.5 block">
                {trains.length}
              </span>
            </div>

            <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 rounded-xl">
              <span className="text-[11px] font-medium text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <Plane className="w-3.5 h-3.5"/> Flights
              </span>
              <span className="text-xl font-bold text-sky-950 dark:text-sky-200 mt-0.5 block">
                {flights.length}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs & Controls */}
        <Tabs defaultValue="buses" value={activeTab} onValueChange={(val) => {
            setActiveTab(val);
            setShowAddForm(false);
        }} className="w-full mt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-[380px] p-1 bg-muted/60 rounded-xl border border-border/60">
              <TabsTrigger value="buses" className="text-xs font-semibold gap-1.5 rounded-lg">
                <Bus className="w-3.5 h-3.5"/> Buses ({buses.length})
              </TabsTrigger>
              <TabsTrigger value="trains" className="text-xs font-semibold gap-1.5 rounded-lg">
                <Train className="w-3.5 h-3.5"/> Trains ({trains.length})
              </TabsTrigger>
              <TabsTrigger value="flights" className="text-xs font-semibold gap-1.5 rounded-lg">
                <Plane className="w-3.5 h-3.5"/> Flights ({flights.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {/* Quick Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground"/>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter routes..." className="pl-8 h-9 text-xs rounded-xl border-border/80"/>
              </div>

              {/* Toggle Create Form */}
              <Button variant={showAddForm ? "secondary" : "default"} size="sm" onClick={() => setShowAddForm(!showAddForm)} className="h-9 px-3 rounded-xl text-xs font-semibold gap-1.5">
                {showAddForm ? (<>
                    <ChevronUp className="w-3.5 h-3.5"/> Close Form
                  </>) : (<>
                    <Plus className="w-3.5 h-3.5"/> New Schedule
                  </>)}
              </Button>
            </div>
          </div>

          {/* BUS TAB */}
          <TabsContent value="buses" className="space-y-4 focus-visible:outline-none">
            {showAddForm && (<form onSubmit={handleAddBus} className="p-5 border border-indigo-200/60 dark:border-indigo-900/40 rounded-2xl bg-gradient-to-b from-indigo-50/40 to-transparent dark:from-indigo-950/10 space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/40 pb-2">
                  <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                    <Bus className="w-4 h-4 text-indigo-600 dark:text-indigo-400"/>
                    Configure New Bus Route
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200">
                    Live Dispatch
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Service / Registration No.</Label>
                    <Input placeholder="e.g. DL-01-A-1234" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Operator Brand</Label>
                    <Input placeholder="e.g. Zingbus Express" value={busName} onChange={(e) => setBusName(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Total Capacity (Seats)</Label>
                    <Input type="number" value={busSeats} onChange={(e) => setBusSeats(e.target.value)} className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Origin City</Label>
                    <Input placeholder="e.g. Delhi" value={busSource} onChange={(e) => setBusSource(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Destination City</Label>
                    <Input placeholder="e.g. Jaipur" value={busDest} onChange={(e) => setBusDest(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Base Fare Per Seat (₹)</Label>
                    <Input type="number" placeholder="750" value={busFare} onChange={(e) => setBusFare(e.target.value)} required className="rounded-xl"/>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="rounded-xl text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creatingBus} size="sm" className="rounded-xl text-xs font-semibold gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
                    {creatingBus ? (<Loader2 className="w-3.5 h-3.5 animate-spin"/>) : (<Plus className="w-3.5 h-3.5"/>)}
                    Publish Service
                  </Button>
                </div>
              </form>)}

            {/* List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
                <span>Active Fleet Inventory ({filteredBuses.length})</span>
                {searchQuery && <span>Matching &ldquo;{searchQuery}&rdquo;</span>}
              </div>

              {loadingBuses ? (<div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary"/>
                  <p className="text-xs font-medium">Loading fleet schedules...</p>
                </div>) : filteredBuses.length === 0 ? (<div className="py-12 text-center border border-dashed rounded-2xl bg-muted/20 space-y-2">
                  <Bus className="w-8 h-8 mx-auto text-muted-foreground/40"/>
                  <p className="text-sm font-semibold text-foreground">No Bus Routes Found</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                ? "No active routes matched your search keywords."
                : "No bus schedules have been created yet. Click 'New Schedule' to publish one."}
                  </p>
                </div>) : (<div className="divide-y divide-border/60 border border-border/80 rounded-2xl overflow-hidden bg-card/60">
                  {filteredBuses.map((b) => (<div key={b.bId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {b.name || "Intercity Bus"}
                          </span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 font-mono">
                            {b.number}
                          </Badge>
                          <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                            Active
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500"/>
                            {b.busSource}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/60"/>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-500"/>
                            {b.busDestination}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/60">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-bold text-foreground justify-end">
                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground"/>
                            {b.BusFare}
                            <span className="text-[10px] text-muted-foreground font-normal">/seat</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground justify-end">
                            <Users className="w-3 h-3"/>
                            {b.BusAvailableSeats} Seats Available
                          </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBus(b.bId, b.name)} className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl" title="Decommission service">
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>))}
                </div>)}
            </div>
          </TabsContent>

          {/* TRAIN TAB */}
          <TabsContent value="trains" className="space-y-4 focus-visible:outline-none">
            {showAddForm && (<form onSubmit={handleAddTrain} className="p-5 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl bg-gradient-to-b from-emerald-50/40 to-transparent dark:from-emerald-950/10 space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                    <Train className="w-4 h-4 text-emerald-600 dark:text-emerald-400"/>
                    Configure New Rail Schedule
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200">
                    Express Dispatch
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Train Number</Label>
                    <Input placeholder="e.g. 12001" value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Express Service Name</Label>
                    <Input placeholder="e.g. Vande Bharat Express" value={trainName} onChange={(e) => setTrainName(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Available Berths</Label>
                    <Input type="number" value={trainSeats} onChange={(e) => setTrainSeats(e.target.value)} className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Origin Station</Label>
                    <Input placeholder="e.g. New Delhi (NDLS)" value={trainSource} onChange={(e) => setTrainSource(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Destination Station</Label>
                    <Input placeholder="e.g. Varanasi (BSB)" value={trainDest} onChange={(e) => setTrainDest(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Standard Fare (₹)</Label>
                    <Input type="number" placeholder="1450" value={trainFare} onChange={(e) => setTrainFare(e.target.value)} required className="rounded-xl"/>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="rounded-xl text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creatingTrain} size="sm" className="rounded-xl text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                    {creatingTrain ? (<Loader2 className="w-3.5 h-3.5 animate-spin"/>) : (<Plus className="w-3.5 h-3.5"/>)}
                    Publish Rail Schedule
                  </Button>
                </div>
              </form>)}

            {/* List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
                <span>Active Rail Network ({filteredTrains.length})</span>
                {searchQuery && <span>Matching &ldquo;{searchQuery}&rdquo;</span>}
              </div>

              {loadingTrains ? (<div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary"/>
                  <p className="text-xs font-medium">Loading rail schedules...</p>
                </div>) : filteredTrains.length === 0 ? (<div className="py-12 text-center border border-dashed rounded-2xl bg-muted/20 space-y-2">
                  <Train className="w-8 h-8 mx-auto text-muted-foreground/40"/>
                  <p className="text-sm font-semibold text-foreground">No Train Schedules Found</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                ? "No train routes matched your search keywords."
                : "No train schedules active right now. Click 'New Schedule' to add one."}
                  </p>
                </div>) : (<div className="divide-y divide-border/60 border border-border/80 rounded-2xl overflow-hidden bg-card/60">
                  {filteredTrains.map((t) => (<div key={t.trainId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {t.trainName || "Express Train"}
                          </span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 font-mono">
                            #{t.trainNumber}
                          </Badge>
                          <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                            Active
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500"/>
                            {t.trainSource}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/60"/>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-500"/>
                            {t.trainDestination}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/60">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-bold text-foreground justify-end">
                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground"/>
                            {t.trainFare}
                            <span className="text-[10px] text-muted-foreground font-normal">/berth</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground justify-end">
                            <Users className="w-3 h-3"/>
                            {t.trainAvailableSeats} Available
                          </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTrain(t.trainId, t.trainName)} className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl" title="Remove train schedule">
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>))}
                </div>)}
            </div>
          </TabsContent>

          {/* FLIGHT TAB */}
          <TabsContent value="flights" className="space-y-4 focus-visible:outline-none">
            {showAddForm && (<form onSubmit={handleAddFlight} className="p-5 border border-sky-200/60 dark:border-sky-900/40 rounded-2xl bg-gradient-to-b from-sky-50/40 to-transparent dark:from-sky-950/10 space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between border-b border-sky-100 dark:border-sky-900/40 pb-2">
                  <h4 className="text-sm font-bold text-sky-950 dark:text-sky-200 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-sky-600 dark:text-sky-400"/>
                    Configure New Aviation Route
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-sky-100/50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200">
                    Aviation Dispatch
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Flight Code / Number</Label>
                    <Input placeholder="e.g. 6E-204" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Airline Carrier</Label>
                    <Input placeholder="e.g. IndiGo Airlines" value={airline} onChange={(e) => setAirline(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Aircraft Capacity</Label>
                    <Input type="number" value={flightSeats} onChange={(e) => setFlightSeats(e.target.value)} className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Origin Airport (IATA)</Label>
                    <Input placeholder="e.g. DEL (Indira Gandhi Intl)" value={flightSource} onChange={(e) => setFlightSource(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Destination Airport (IATA)</Label>
                    <Input placeholder="e.g. BOM (Chhatrapati Shivaji)" value={flightDest} onChange={(e) => setFlightDest(e.target.value)} required className="rounded-xl"/>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Economy Base Fare (₹)</Label>
                    <Input type="number" placeholder="4500" value={flightFare} onChange={(e) => setFlightFare(e.target.value)} required className="rounded-xl"/>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="rounded-xl text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creatingFlight} size="sm" className="rounded-xl text-xs font-semibold gap-1.5 bg-sky-600 hover:bg-sky-700 text-white">
                    {creatingFlight ? (<Loader2 className="w-3.5 h-3.5 animate-spin"/>) : (<Plus className="w-3.5 h-3.5"/>)}
                    Publish Aviation Route
                  </Button>
                </div>
              </form>)}

            {/* List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
                <span>Active Commercial Flights ({filteredFlights.length})</span>
                {searchQuery && <span>Matching &ldquo;{searchQuery}&rdquo;</span>}
              </div>

              {loadingFlights ? (<div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary"/>
                  <p className="text-xs font-medium">Loading flight schedules...</p>
                </div>) : filteredFlights.length === 0 ? (<div className="py-12 text-center border border-dashed rounded-2xl bg-muted/20 space-y-2">
                  <Plane className="w-8 h-8 mx-auto text-muted-foreground/40"/>
                  <p className="text-sm font-semibold text-foreground">No Flights Found</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                ? "No flight routes matched your search keywords."
                : "No aviation schedules active. Click 'New Schedule' to add one."}
                  </p>
                </div>) : (<div className="divide-y divide-border/60 border border-border/80 rounded-2xl overflow-hidden bg-card/60">
                  {filteredFlights.map((f) => (<div key={f.flightId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {f.flightAirline || "Airline Carrier"}
                          </span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 font-mono">
                            {f.Number}
                          </Badge>
                          <Badge className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20">
                            Scheduled
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-sky-500"/>
                            {f.flightSource}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/60"/>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-500"/>
                            {f.flightDestination}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/60">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-bold text-foreground justify-end">
                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground"/>
                            {f.flightFare}
                            <span className="text-[10px] text-muted-foreground font-normal">/seat</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground justify-end">
                            <Users className="w-3 h-3"/>
                            {f.flightAvailableSeats} Seats
                          </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFlight(f.flightId, f.Number)} className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl" title="Remove flight schedule">
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>))}
                </div>)}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>);
}
