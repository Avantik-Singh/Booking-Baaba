import { create } from "zustand";
import { getSeatLayoutById } from "@/lib/services/seat-service";
import { calculateFare } from "@/lib/utils/calculate-fare";
import { generateBookingReference, saveBookingLocally, } from "@/lib/services/booking-service";
import { getStationById, getAirportById, getCityById, getOperatorById, } from "@/lib/services/route-service";
import faresData from "@/lib/mock-data/fares.json";
import { store } from "@/store";
import { bookingApi } from "@/store/api/bookingApi";
import { passengerApi } from "@/store/api/passengerApi";
import { paymentApi } from "@/store/api/paymentApi";
import { notificationApi } from "@/store/api/notificationApi";
export const useBookingStore = create((set, get) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    currentStep: "seats",
    setCurrentStep: (step) => set({ currentStep: step }),
    transportMode: "train",
    selectedService: null,
    selectedClassOrFamily: "",
    baseFarePerPassenger: 0,
    selectedJourneyDate: "",
    seatLayout: null,
    selectedSeatIds: [],
    toggleSeatSelection: (seat, maxSeats) => {
        if (seat.status === "occupied" || seat.status === "blocked")
            return;
        const currentSelected = get().selectedSeatIds;
        if (currentSelected.includes(seat.id)) {
            set({ selectedSeatIds: currentSelected.filter((id) => id !== seat.id) });
        }
        else {
            if (currentSelected.length >= maxSeats) {
                // Replace or enforce limit: keep latest maxSeats - 1 and add new
                const updated = [...currentSelected.slice(1), seat.id];
                set({ selectedSeatIds: updated });
            }
            else {
                set({ selectedSeatIds: [...currentSelected, seat.id] });
            }
        }
    },
    autoSelectSeats: () => {
        const state = get();
        if (!state.seatLayout)
            return;
        const available = state.seatLayout.seats.filter((s) => s.status !== "occupied" && s.status !== "blocked");
        const chosen = available.slice(0, state.passengerCount).map((s) => s.id);
        set({ selectedSeatIds: chosen });
    },
    boardingPointId: undefined,
    droppingPointId: undefined,
    setBoardingPoint: (id) => set({ boardingPointId: id }),
    setDroppingPoint: (id) => set({ droppingPointId: id }),
    passengerCount: 1,
    passengers: [],
    setPassengers: (passengers) => set({ passengers }),
    contactEmail: "",
    contactPhone: "",
    setContactInfo: (email, phone) => set({ contactEmail: email, contactPhone: phone }),
    selectedExtras: [],
    toggleExtra: (extra) => {
        const current = get().selectedExtras;
        const exists = current.some((e) => e.id === extra.id);
        if (exists) {
            set({ selectedExtras: current.filter((e) => e.id !== extra.id) });
        }
        else {
            set({ selectedExtras: [...current, extra] });
        }
    },
    couponCode: "",
    discountAmount: 0,
    applyCoupon: (code) => {
        const upperCode = code.trim().toUpperCase();
        const discounts = faresData.discounts;
        const discountObj = discounts[upperCode];
        if (discountObj) {
            const state = get();
            const currentTotal = state.baseFarePerPassenger * state.passengerCount;
            if (currentTotal >= discountObj.minimumSpend) {
                set({
                    couponCode: upperCode,
                    discountAmount: discountObj.discountAmount,
                });
                return true;
            }
        }
        return false;
    },
    removeCoupon: () => set({ couponCode: "", discountAmount: 0 }),
    confirmedBooking: null,
    startBooking: ({ transportMode, service, selectedClassOrFamily, baseFare, seatLayoutId, passengerCount, journeyDate, }) => {
        const layout = seatLayoutId
            ? getSeatLayoutById(seatLayoutId) || null
            : null;
        // Initialize blank passengers based on count
        const initialPassengers = Array.from({ length: passengerCount }, (_, i) => ({
            id: `p-${i + 1}`,
            firstName: "",
            lastName: "",
            age: undefined,
            gender: "M",
        }));
        // Auto select first boarding & dropping point for buses
        let initialBoarding = undefined;
        let initialDropping = undefined;
        if ("boardingPoints" in service && service.boardingPoints.length > 0) {
            initialBoarding = service.boardingPoints[0].id;
        }
        if ("droppingPoints" in service && service.droppingPoints.length > 0) {
            initialDropping = service.droppingPoints[0].id;
        }
        set({
            isOpen: true,
            currentStep: layout ? "seats" : "passengers",
            transportMode,
            selectedService: service,
            selectedClassOrFamily,
            baseFarePerPassenger: baseFare,
            selectedJourneyDate: journeyDate || new Date().toISOString().split("T")[0],
            seatLayout: layout,
            selectedSeatIds: [],
            passengerCount,
            passengers: initialPassengers,
            boardingPointId: initialBoarding,
            droppingPointId: initialDropping,
            selectedExtras: [],
            couponCode: "",
            discountAmount: 0,
            confirmedBooking: null,
        });
    },
    nextStep: () => {
        const stepOrder = [
            "seats",
            "passengers",
            "review",
            "confirmation",
        ];
        const current = get().currentStep;
        const currentIndex = stepOrder.indexOf(current);
        if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
            if (current === "review") {
                get().completeBooking();
                return;
            }
            set({ currentStep: stepOrder[currentIndex + 1] });
        }
    },
    prevStep: () => {
        const stepOrder = [
            "seats",
            "passengers",
            "review",
            "confirmation",
        ];
        const current = get().currentStep;
        const currentIndex = stepOrder.indexOf(current);
        if (currentIndex > 0) {
            // If we don't have a seat layout and we are at passengers, don't go back to seats
            if (current === "passengers" && !get().seatLayout)
                return;
            set({ currentStep: stepOrder[currentIndex - 1] });
        }
    },
    completeBooking: () => {
        const state = get();
        const service = state.selectedService;
        const ref = generateBookingReference(state.transportMode);
        // Calculate seat premiums
        let seatPremiums = 0;
        const seatLabels = [];
        if (state.seatLayout) {
            state.selectedSeatIds.forEach((sId) => {
                const found = state.seatLayout?.seats.find((s) => s.id === sId);
                if (found) {
                    seatPremiums += found.price || 0;
                    seatLabels.push(found.label);
                }
            });
        }
        const fare = calculateFare({
            transportMode: state.transportMode,
            baseFarePerPassenger: state.baseFarePerPassenger,
            passengerCount: state.passengerCount,
            seatPremiumsTotal: seatPremiums,
            selectedExtras: state.selectedExtras,
            discountAmount: state.discountAmount,
        });
        let serviceName = "";
        let serviceNumber = "";
        let operatorName = "";
        let originName = "";
        let destinationName = "";
        let departureTime = "";
        let arrivalTime = "";
        if (state.transportMode === "train") {
            const train = service;
            serviceName = train.trainName;
            serviceNumber = train.trainNumber;
            operatorName = "Indian Railways";
            const st1 = getStationById(train.originStationId);
            const st2 = getStationById(train.destinationStationId);
            originName = st1 ? `${st1.city} (${st1.code})` : train.originStationId;
            destinationName = st2
                ? `${st2.city} (${st2.code})`
                : train.destinationStationId;
            departureTime = train.departureTime;
            arrivalTime = train.arrivalTime;
        }
        else if (state.transportMode === "flight") {
            const flight = service;
            serviceName = `${flight.airlineName} ${flight.flightNumber}`;
            serviceNumber = flight.flightNumber;
            operatorName = flight.airlineName;
            const ap1 = getAirportById(flight.originAirportId);
            const ap2 = getAirportById(flight.destinationAirportId);
            originName = ap1
                ? `${ap1.city} (${ap1.iataCode})`
                : flight.originAirportId;
            destinationName = ap2
                ? `${ap2.city} (${ap2.iataCode})`
                : flight.destinationAirportId;
            departureTime = flight.departureTime;
            arrivalTime = flight.arrivalTime;
        }
        else {
            const bus = service;
            serviceName = bus.serviceName;
            const op = getOperatorById(bus.operatorId);
            operatorName = op ? op.name : "Intercity Bus";
            const c1 = getCityById(bus.originCityId);
            const c2 = getCityById(bus.destinationCityId);
            originName = c1 ? c1.name : bus.originCityId;
            destinationName = c2 ? c2.name : bus.destinationCityId;
            departureTime = bus.departureTime;
            arrivalTime = bus.arrivalTime;
        }
        const bookingRecord = {
            id: `booking-${Date.now()}`,
            bookingReference: ref,
            transportMode: state.transportMode,
            serviceId: service.id,
            serviceName,
            serviceNumber,
            operatorName,
            routeId: service.routeId,
            originName,
            destinationName,
            departureTime,
            arrivalTime,
            journeyDate: state.selectedJourneyDate || new Date().toISOString().split("T")[0],
            travelClass: state.selectedClassOrFamily,
            passengerCount: state.passengerCount,
            passengers: state.passengers.map((p, i) => ({
                ...p,
                seatId: state.selectedSeatIds[i],
                seatLabel: seatLabels[i],
            })),
            passengerIds: state.passengers.map((p) => p.id),
            selectedSeatIds: state.selectedSeatIds,
            selectedSeatLabels: seatLabels,
            boardingPointId: state.boardingPointId,
            droppingPointId: state.droppingPointId,
            selectedExtras: state.selectedExtras,
            fare,
            status: "confirmed",
            createdAt: new Date().toISOString(),
            demoData: true,
        };
        saveBookingLocally(bookingRecord);
        // Sync booking with Spring Boot backend
        try {
            const numericServiceId = parseInt(service.id.replace(/\D/g, ""), 10) || 1;
            store
                .dispatch(bookingApi.endpoints.createBooking.initiate({
                userId: 1,
                transportId: numericServiceId,
                transportType: state.transportMode.toUpperCase(),
                seatCount: state.passengerCount,
                amount: fare.totalAmount,
            }))
                .unwrap()
                .then((res) => {
                console.log("Spring Boot booking created via Redux Toolkit:", res);
                // 1. Sync all passengers to PostgreSQL
                state.passengers.forEach((p, i) => {
                    store.dispatch(passengerApi.endpoints.addPassenger.initiate({
                        firstName: p.firstName || "Passenger",
                        lastName: p.lastName || `${i + 1}`,
                        age: p.age || 25,
                        gender: p.gender || "Other",
                        seatNumber: seatLabels[i] || `S${i + 1}`,
                        bookingId: res.id,
                    }));
                });
                // 2. Sync payment transaction to PostgreSQL
                store.dispatch(paymentApi.endpoints.processPayment.initiate({
                    bookingId: res.id,
                    amount: fare.totalAmount,
                    paymentMethod: "UPI",
                }));
                // 3. Create Notification in PostgreSQL
                store.dispatch(notificationApi.endpoints.createNotification.initiate({
                    userId: 1,
                    email: state.contactEmail || "customer@example.com",
                    message: `Booking #${res.id} for ${serviceName} (${state.transportMode}) confirmed! Total Paid: ₹${fare.totalAmount}`,
                }));
            })
                .catch((err) => {
                console.warn("Backend booking sync notice:", err);
            });
        }
        catch (e) {
            console.warn("Booking backend dispatch error:", e);
        }
        set({ confirmedBooking: bookingRecord, currentStep: "confirmation" });
        return bookingRecord;
    },
    resetBooking: () => {
        set({
            isOpen: false,
            currentStep: "seats",
            selectedService: null,
            selectedJourneyDate: "",
            selectedSeatIds: [],
            passengers: [],
            confirmedBooking: null,
        });
    },
}));
