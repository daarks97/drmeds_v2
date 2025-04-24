import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TopNavigation from "./components/TopNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import QuestionModal from "./components/avaliacoes/QuestionModal";
import PerformanceModal from "./components/avaliacoes/PerformanceModal";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";

// Páginas públicas
import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Onboarding from "./pages/onboarding";

// Páginas privadas
import Index from "./pages/index";
import Home from "./pages/home";
import PlannerPage from "./pages/planner";
import MeuCaderno from "./pages/meuCaderno";
import TemaEditor from "./pages/temaEditor";
import Avaliacoes from "./pages/avaliacoes/index";
import AvaliacaoQuestoes from "./pages/avaliacoes/questoes";
import AvaliacaoSlug from "./pages/avaliacoes/[slug]";
import UserProfile from "./pages/userProfile";
import NotFound from "./pages/notFound";

const queryClient = new QueryClient();

const App = () => (
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionContextProvider>
);

const MainLayout = () => {
  const location = useLocation();
  const isAuthRoute = ["/", "/login", "/register", "/cadastro", "/onboarding"].includes(location.pathname);

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <main className="pt-16 p-8">
          <Routes>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/planejamento" element={<PlannerPage />} />
            <Route path="/perfil" element={<UserProfile />} />
            <Route path="/meu-caderno" element={<MeuCaderno />} />
            <Route path="/meu-caderno/tema/:id" element={<TemaEditor />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
            <Route path="/avaliacoes/:provaSlug" element={<AvaliacaoQuestoes />} />
            <Route path="/avaliacoes/:slug" element={<AvaliacaoSlug />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Modais globais */}
        <QuestionModal />
        <PerformanceModal />
      </div>
    </ProtectedRoute>
  );
};

export default App;
