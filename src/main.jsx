import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.jsx";

import MyDay from "./Pages/MyDay.jsx";
import DoFirst from "./Pages/DoFirst.jsx";
import Schedule from "./Pages/Schedule.jsx";
import Delegate from "./Pages/Delegate.jsx";
import DontDo from "./Pages/DontDo.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<MyDay />}></Route>
      <Route path="/do-First" element={<DoFirst />}></Route>
      <Route path="/schedule" element={<Schedule />}></Route>
      <Route path="/delegate" element={<Delegate />}></Route>
      <Route path="/dontdo" element={<DontDo />}></Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
