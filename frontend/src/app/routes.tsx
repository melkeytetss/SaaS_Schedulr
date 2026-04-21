import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell";
import { AdminShell } from "./components/layout/AdminShell";
import { RequireAuth } from "./components/layout/RequireAuth";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { EventEditor } from "./pages/EventEditor";
import { BookingPage } from "./pages/BookingPage";
import { AdminPanel } from "./pages/AdminPanel";
import { Integrations } from "./pages/Integrations";
import { Pricing } from "./pages/Pricing";
import { ComponentsPage } from "./pages/Components";
import { Bookings } from "./pages/Bookings";
import { Availability } from "./pages/Availability";
import { Analytics } from "./pages/Analytics";
import { Reminders } from "./pages/Reminders";
import { Settings } from "./pages/Settings";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { LiveDemo } from "./pages/LiveDemo";
import { FeaturesPage } from "./pages/FeaturesPage";
import { PublicIntegrations } from "./pages/PublicIntegrations";
import { BlogPage } from "./pages/BlogPage";
import { Navigate } from "react-router";

export const router = createBrowserRouter([
  // ── Public marketing pages ──────────────────────────────────────────────────
  { path: "/",              Component: Landing            },
  { path: "/pricing",       Component: Pricing            },
  { path: "/features",      Component: FeaturesPage       },
  { path: "/integrations",  Component: PublicIntegrations },
  { path: "/blog",          Component: BlogPage           },
  { path: "/signin",        Component: SignIn             },
  { path: "/signup",        Component: SignUp             },
  { path: "/demo",          Component: LiveDemo           },

  // ── Booking flow ────────────────────────────────────────────────────────────
  { path: "/book",          Component: BookingPage        },

  // ── Internal / dev ──────────────────────────────────────────────────────────
  { path: "/components",    Component: ComponentsPage     },

  // ── App (authenticated) ─────────────────────────────────────────────────────
  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard",    Component: Dashboard    },
      { path: "events",       Component: EventEditor  },
      { path: "bookings",     Component: Bookings     },
      { path: "availability", Component: Availability },
      { path: "analytics",    Component: Analytics    },
      { path: "integrations", Component: Integrations },
      { path: "reminders",    Component: Reminders    },
      { path: "settings",     Component: Settings     },
    ],
  },

  // ── Admin console ────────────────────────────────────────────────────────────
  {
    path: "/admin",
    Component: AdminShell,
    children: [
      { index: true, Component: AdminPanel },
    ],
  },
]);
