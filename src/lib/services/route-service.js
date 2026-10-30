import stationsData from "@/lib/mock-data/stations.json";
import airportsData from "@/lib/mock-data/airports.json";
import citiesData from "@/lib/mock-data/cities.json";
import routesData from "@/lib/mock-data/routes.json";
import destinationsData from "@/lib/mock-data/destinations.json";
import operatorsData from "@/lib/mock-data/operators.json";
export const stations = stationsData;
export const airports = airportsData;
export const cities = citiesData;
export const routes = routesData;
export const destinations = destinationsData;
export const operators = operatorsData;
export function getStationById(id) {
    return stations.find((s) => s.id === id);
}
export function getAirportById(id) {
    return airports.find((a) => a.id === id);
}
export function getCityById(id) {
    return cities.find((c) => c.id === id);
}
export function getOperatorById(id) {
    return operators.find((op) => op.id === id);
}
export function findRoute(transportMode, originId, destinationId) {
    return routes.find((r) => r.transportMode === transportMode && r.originId === originId && r.destinationId === destinationId);
}
export function getPopularRoutes() {
    return routes.slice(0, 8);
}
