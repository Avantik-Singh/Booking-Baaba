import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export const RESULTS_PATH = "/results";
export function useGoToResults() {
    const navigate = useNavigate();
    const location = useLocation();
    return useCallback(() => {
        const elem = document.getElementById("search-results-section");
        if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
            return;
        }
        navigate(RESULTS_PATH);
    }, [location.pathname, navigate]);
}
