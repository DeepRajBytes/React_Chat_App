import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Homepage, Chatpage } from "./Pages";
import ChatProvider from "./context/ChatProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Homepage />} />
      <Route path="/chat" element={<Chatpage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <ChatProvider navigate={router.navigate}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ChatProvider>
  </ChakraProvider>
);
