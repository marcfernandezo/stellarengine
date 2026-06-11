import { Menu } from "@/components/hud/menu";
import { Universe } from "@/components/Universe";
import { useState } from "react";

type AppState = "Menu" | "Running" | "Paused";

// App.tsx
export default function App() {
    const [state, setState] = useState<AppState>("Menu");

    return (
        <main style={{ width: "100vw", height: "100vh" }}>
            {state === "Menu" && (
                <Menu onStart={() => setState("Running")} />
            )}

            {(state === "Running" || state === "Paused") && (
                <Universe />
            )}
        </main>
    )
}