import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add additional tailwind classes to index.css
document.documentElement.classList.add("bg-gradient-to-b", "from-ocean-lighter/10", "to-white", "min-h-screen");

createRoot(document.getElementById("root")!).render(<App />);
