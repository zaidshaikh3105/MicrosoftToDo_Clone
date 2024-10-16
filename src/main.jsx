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
import Important from "./Pages/Important.jsx";
import Planned from "./Pages/Planned.jsx";
import AssignedToMe from "./Pages/AssignedToMe.jsx";
import Tasks from "./Pages/Tasks.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<MyDay />}></Route>
      <Route path="/important" element={<Important />}></Route>
      <Route path="/planned" element={<Planned />}></Route>
      <Route path="/assigned_to_me" element={<AssignedToMe />}></Route>
      <Route path="/tasks" element={<Tasks />}></Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
