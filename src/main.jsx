import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import AppLayout from "./routes/AppLayout";
import Home from "./routes/Home";
import ReportForm from "./routes/Report";
import Cases from "./routes/Cases";
import Youth from "./routes/Youth";
import Methodology from "./routes/Methodology";
import GetInvolved from "./routes/GetInvolved";
import Privacy from "./routes/Privacy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "report", element: <ReportForm /> },
      { path: "cases", element: <Cases /> },
      { path: "youth", element: <Youth /> },
      { path: "methodology", element: <Methodology /> },
      { path: "get-involved", element: <GetInvolved /> },
      { path: "privacy", element: <Privacy /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);