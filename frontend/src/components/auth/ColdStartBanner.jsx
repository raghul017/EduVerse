import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import api from "../../utils/api.js";

function ColdStartBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let cancelled = false;

        const checkServerStatus = async () => {
            try {
                const { data } = await api.get("/health/status", {
                    timeout: 8000,
                });
                if (cancelled) return;

                if (data.coldStart) {
                    setMessage(
                        "Our server just woke up from sleep mode. The first request may take a few extra seconds — please try again if you see an error.",
                    );
                    setShowBanner(true);
                } else {
                    setShowBanner(false);
                }
            } catch {
                // Server is still booting or unreachable
                if (cancelled) return;
                setMessage(
                    "Our server is warming up (free hosting sleeps after inactivity). Please wait a moment and try again if you get an error.",
                );
                setShowBanner(true);
            }
        };

        checkServerStatus();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!showBanner) return null;

    return (
        <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
            <AlertTriangle
                size={18}
                className="text-amber-400 mt-0.5 shrink-0"
            />
            <p className="text-amber-200 text-[13px] leading-relaxed">
                {message}
            </p>
        </div>
    );
}

export default ColdStartBanner;
