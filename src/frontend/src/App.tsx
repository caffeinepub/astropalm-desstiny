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
import VisitorQueryForm from "./components/VisitorQueryForm";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import HoroscopePage from "./pages/HoroscopePage";
import NadiCardsPage from "./pages/NadiCardsPage";
import NumerologyPage from "./pages/NumerologyPage";
import PredictionDetailPage from "./pages/PredictionDetailPage";
import PredictionOptionsPage from "./pages/PredictionOptionsPage";

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

          {/* Numerology Teaser */}
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
              Numerology
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
                Explore Numerology
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/horoscope" })}
                data-ocid="horoscope.primary_button"
                className="px-8 py-3 text-base font-semibold rounded-full border-green-700 text-green-700 hover:bg-green-50"
              >
                Horoscope
              </Button>
            </motion.div>
          </section>

          {/* Nadi Cards Teaser */}
          <section
            id="nadi-cards"
            className="py-16 flex flex-col items-center justify-center gap-6"
            style={{
              background: "linear-gradient(135deg, #fff8ee 0%, #fff3e0 100%)",
            }}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-display font-bold tracking-wide"
              style={{ color: "#c0392b" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Nadi Cards
            </motion.h2>
            <motion.p
              className="text-center text-base max-w-md px-4"
              style={{ color: "#555" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Discover your destiny through ancient Nadi card readings. Pull
              cards automatically or pick them yourself to reveal planetary and
              house influences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                size="lg"
                onClick={() => navigate({ to: "/nadi-cards" })}
                data-ocid="nadi_cards.primary_button"
                className="px-8 py-3 text-base font-semibold rounded-full"
                style={{
                  background: "#c0392b",
                  color: "white",
                  border: "none",
                }}
              >
                Explore Nadi Cards
              </Button>
            </motion.div>
          </section>

          {/* Visitor Query Section */}
          <section id="send-query" className="py-16 bg-white">
            <div className="max-w-xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-2">
                  Send Us Your Query
                </h2>
                <p className="text-gray-500 text-sm">
                  Have a question? Fill out the form below and we will get back
                  to you.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                <VisitorQueryForm />
              </div>
            </div>
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
const nadiCardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nadi-cards",
  component: NadiCardsPage,
});
const predictionOptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/numerology/prediction",
  component: PredictionOptionsPage,
});
const predictionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/numerology/prediction/$type",
  component: PredictionDetailPage,
});

const horoscopeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/horoscope",
  component: HoroscopePage,
});
const routeTree = rootRoute.addChildren([
  indexRoute,
  numerologyRoute,
  nadiCardsRoute,
  predictionOptionsRoute,
  predictionDetailRoute,
  horoscopeRoute,
]);
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
