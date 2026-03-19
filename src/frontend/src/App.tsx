import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { motion } from "motion/react";
import React, { useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import BlogSection from "./components/BlogSection";
import ComparisonTable from "./components/ComparisonTable";
import CoursesSection from "./components/CoursesSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProfileSetupModal from "./components/ProfileSetupModal";
import ServicesSection from "./components/ServicesSection";
import SpecialUniqueServiceSection from "./components/SpecialUniqueServiceSection";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import NumerologyPage from "./pages/NumerologyPage";

function HomePage() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden w-full">
      <Header onAdminClick={() => setShowAdmin(true)} />

      {showAdmin ? (
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      ) : (
        <main className="overflow-x-hidden w-full">
          <HeroSection />

          {/* Vedic Numerology Teaser */}
          <section
            id="numerology"
            className="py-16 flex flex-col items-center justify-center gap-6 bg-background"
          >
            <motion.h2
              className="text-3xl md:text-5xl font-display font-bold text-primary tracking-wide animate-pulse"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Vedic Numerology
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={() => navigate({ to: "/numerology" })}
                data-ocid="numerology.primary_button"
                className="px-8 py-3 text-base font-semibold rounded-full"
              >
                Explore Vedic Numerology
              </Button>
            </motion.div>
          </section>

          <section id="courses">
            <CoursesSection />
          </section>
          <section id="special-services">
            <SpecialUniqueServiceSection />
          </section>
          <section id="services">
            <ServicesSection />
          </section>
          <section id="blog">
            <BlogSection />
          </section>
          <ComparisonTable />
        </main>
      )}

      <Footer />

      {showProfileSetup && <ProfileSetupModal />}
      <Toaster richColors position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute();
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const numerologyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/numerology",
  component: NumerologyPage,
});

const routeTree = rootRoute.addChildren([indexRoute, numerologyRoute]);
const history = createBrowserHistory();
const router = createRouter({ routeTree, history });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
