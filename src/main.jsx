import React from "react";
import ReactDOM from "react-dom/client";
import MealPlannerApp from "./MealPlannerApp.jsx";
import "./index.css";          // Tailwind / estilos base

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MealPlannerApp />
  </React.StrictMode>
);
