import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import History from "./pages/History";
import About from "./pages/About";
import { checkHealth } from "./services/api";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell({ apiStatus, health }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <ScrollToTop />
      <Navbar apiStatus={apiStatus} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing apiStatus={apiStatus} health={health} />} />
          <Route
            path="/dashboard"
            element={<Dashboard apiStatus={apiStatus} health={health} />}
          />
          <Route path="/predict" element={<Predict />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer apiStatus={apiStatus} />
    </div>
  );
}

export default function App() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const result = await checkHealth();
      if (cancelled) return;
      setHealth(result);
      setApiStatus(result.status === "ok" ? "connected" : "offline");
    }

    poll();
    const interval = setInterval(poll, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <Shell apiStatus={apiStatus} health={health} />
    </BrowserRouter>
  );
}
