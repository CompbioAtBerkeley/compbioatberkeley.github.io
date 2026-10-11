import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import RouteMetadata from "./components/RouteMetadata";
import {
  ConceptFrame,
  ConceptReviewHome,
} from "./concepts/ConceptReview";
import About from "./pages/About";
import Calendar from "./pages/Calendar";
import Collaborations from "./pages/Collaborations";
import Contact from "./pages/Contact";
import Newsletters from "./pages/Newsletters";
import NewsletterIssue from "./pages/NewsletterIssue";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Officers from "./pages/Officers";
import Privacy from "./pages/Privacy";
import SignUp from "./pages/SignUp";

const ResearchEditorial = lazy(
  () => import("./concepts/research-editorial/ResearchEditorial"),
);
const LabNotebook = lazy(
  () => import("./concepts/lab-notebook/LabNotebook"),
);
const BioNetwork = lazy(
  () => import("./concepts/bio-network/BioNetwork"),
);

const queryClient = new QueryClient();
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
const defaultTheme =
  typeof document === "undefined"
    ? "system"
    : document.documentElement.dataset.defaultTheme ?? "system";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const StandardSite = () => (
  <div className="flex min-h-[100dvh] flex-col">
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
    <Navigation />
    <main id="main-content" className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/newsletter" element={<Newsletters />} />
        <Route path="/newsletter/:slug" element={<NewsletterIssue />} />
        <Route path="/collaborations" element={<Collaborations />} />
        <Route path="/officers" element={<Officers />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

const ConceptLoading = () => (
  <div className="concept-loading" role="status" aria-live="polite">
    <div className="concept-loading-line concept-loading-line-wide" />
    <div className="concept-loading-line" />
    <span>Loading design direction</span>
  </div>
);

const ConceptSite = () => (
  <Routes>
    <Route path="/concepts" element={<ConceptReviewHome />} />
    <Route
      path="/concepts/research-editorial"
      element={
        <ConceptFrame activeId="research-editorial">
          <Suspense fallback={<ConceptLoading />}>
            <ResearchEditorial />
          </Suspense>
        </ConceptFrame>
      }
    />
    <Route
      path="/concepts/lab-notebook"
      element={
        <ConceptFrame activeId="lab-notebook">
          <Suspense fallback={<ConceptLoading />}>
            <LabNotebook />
          </Suspense>
        </ConceptFrame>
      }
    />
    <Route
      path="/concepts/bio-network"
      element={
        <ConceptFrame activeId="bio-network">
          <Suspense fallback={<ConceptLoading />}>
            <BioNetwork />
          </Suspense>
        </ConceptFrame>
      }
    />
    <Route path="*" element={<ConceptReviewHome />} />
  </Routes>
);

const AppRoutes = () => {
  const location = useLocation();
  return location.pathname.startsWith("/concepts") ? (
    <ConceptSite />
  ) : (
    <StandardSite />
  );
};

export const AppContent = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme={defaultTheme}
    enableSystem
    disableTransitionOnChange
    storageKey="compbio-theme"
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <RouteMetadata />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

const App = () => (
  <BrowserRouter
    basename={routerBasename}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <AppContent />
  </BrowserRouter>
);

export default App;
