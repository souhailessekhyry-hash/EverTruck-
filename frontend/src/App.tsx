import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";

// Layout
import Layout from "./components/Layout";

// Eager-loaded pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Fleet = lazy(() => import("./pages/Fleet"));
const Industries = lazy(() => import("./pages/Industries"));
const Tracking = lazy(() => import("./pages/Tracking"));
const Quote = lazy(() => import("./pages/Quote"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-crimson-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm uppercase tracking-widest">Loading</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: "#001d3d",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<Suspense fallback={<LoadingFallback />}><About /></Suspense>} />
          <Route path="/services" element={<Suspense fallback={<LoadingFallback />}><Services /></Suspense>} />
          <Route path="/fleet" element={<Suspense fallback={<LoadingFallback />}><Fleet /></Suspense>} />
          <Route path="/industries" element={<Suspense fallback={<LoadingFallback />}><Industries /></Suspense>} />
          <Route path="/tracking" element={<Suspense fallback={<LoadingFallback />}><Tracking /></Suspense>} />
          <Route path="/quote" element={<Suspense fallback={<LoadingFallback />}><Quote /></Suspense>} />
          <Route path="/blog" element={<Suspense fallback={<LoadingFallback />}><Blog /></Suspense>} />
          <Route path="/blog/:slug" element={<Suspense fallback={<LoadingFallback />}><BlogPost /></Suspense>} />
          <Route path="/faq" element={<Suspense fallback={<LoadingFallback />}><FAQ /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<LoadingFallback />}><Contact /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
