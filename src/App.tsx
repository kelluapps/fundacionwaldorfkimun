import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import CampanaCarpinteria from "./pages/CampanaCarpinteria.tsx";
import Arbol from "./pages/Arbol.tsx";
import Contacto from "./pages/Contacto.tsx";
import Gracias from "./pages/Gracias.tsx";
import GraciasSocio from "./pages/GraciasSocio.tsx";
import AdminCampanas from "./pages/AdminCampanas.tsx";
import AdminCampanaEdit from "./pages/AdminCampanaEdit.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminApi from "./pages/AdminApi.tsx";
import AdminPreview from "./pages/AdminPreview.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/donar" element={<CampanaCarpinteria />} />
          <Route path="/socios" element={<Arbol />} />
          {/* Redirecciones legacy */}
          <Route path="/campanas" element={<Navigate to="/donar" replace />} />
          <Route path="/campanas/carpinteria" element={<Navigate to="/donar" replace />} />
          <Route path="/campanas/anfiteatro" element={<Navigate to="/donar" replace />} />
          <Route path="/arbol" element={<Navigate to="/socios" replace />} />
          <Route path="/hazte-socio" element={<Navigate to="/socios" replace />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/gracias-socio" element={<GraciasSocio />} />
          <Route path="/admin" element={<Navigate to="/admin/campanas" replace />} />
          <Route path="/admin/campanas" element={<AdminCampanas />} />
          <Route path="/admin/campanas/:id" element={<AdminCampanaEdit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
