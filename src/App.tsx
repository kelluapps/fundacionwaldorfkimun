import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Campanas from "./pages/Campanas.tsx";
import CampanaAnfiteatro from "./pages/CampanaAnfiteatro.tsx";
import CampanaCarpinteria from "./pages/CampanaCarpinteria.tsx";
import Arbol from "./pages/Arbol.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campanas" element={<Campanas />} />
          <Route path="/campanas/anfiteatro" element={<CampanaAnfiteatro />} />
          <Route path="/campanas/carpinteria" element={<CampanaCarpinteria />} />
          <Route path="/arbol" element={<Arbol />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
