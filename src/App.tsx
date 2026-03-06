import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
//
import LoginAdmin from "./pages/admin/LoginAdmin";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import PortfolioAdmin from "./pages/admin/Portfolio";
import Services from "./pages/admin/Services";
import Pricing from "./pages/admin/Pricing";
import Testimonials from "./pages/admin/Testimonials";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import FAQ from "./pages/admin/FAQ";
import Settings from "./pages/admin/settings";
import WorkProcess from "./pages/admin/WorkProcess";
import WhyChoose from "./pages/admin/WhyChoose";
import Problems from "./pages/admin/problems";

import Bookings from "./pages/admin/bookings";


import { SettingsProvider } from "./conteks/SettingsConteks";

const queryClient = new QueryClient();

const App = () => (
  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <SettingsProvider>
        <Routes>
          
          <Route path="/" element={<Index />} />
           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/admin/login" element={<LoginAdmin />} />
           <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
          >

          
          <Route path="/admin/dashboard" element={<Dashboard />} />
          
          <Route path="portfolio" element={<PortfolioAdmin />} />
           <Route path="services" element={<Services />} />
            <Route path="pricing" element={<Pricing />} /> 
            <Route path="Testimonials" element={<Testimonials/>} /> 
            <Route path="FAQ" element={<FAQ/>} /> 
             <Route path="settings" element={<Settings/>} /> 
             <Route path="work-process" element={<WorkProcess />} />
            <Route path="why-choose" element={<WhyChoose />} />
            <Route path="problems" element={<Problems />} />
            {/*<Route path="bookings" element={<Bookings/>} /> */}
            
          </Route>
            
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
        </SettingsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
