import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { myrouter } from "./Routing/AppRouter";
import AuthContextProvider from "./Context/AuthContextprovider/AuthContextprovider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <Toaster position="top-right" />
          <RouterProvider router={myrouter} />
        </HeroUIProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  </StrictMode>
);