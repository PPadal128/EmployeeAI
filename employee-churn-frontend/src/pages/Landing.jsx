import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import FeaturesSection from "../components/FeaturesSection";
import DashboardPreview from "../components/DashboardPreview";
import HowItWorks from "../components/HowItWorks";
import ModelWorkflow from "../components/ModelWorkflow";
import FAQ from "../components/FAQ";

export default function Landing({ apiStatus, health }) {
  return (
    <div>
      <Hero />
      <TrustStrip />
      <FeaturesSection />
      <DashboardPreview apiStatus={apiStatus} health={health} />
      <HowItWorks />
      <ModelWorkflow />
      <FAQ />

      <section className="max-w-5xl mx-auto px-5 lg:px-8 pb-20 lg:pb-28">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-emerald rounded-3xl px-8 sm:px-14 py-14 sm:py-16 text-center gradient-shift">
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
          <h2 className="relative font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-3">
            Ready to predict employee churn?
          </h2>
          <p className="relative text-sm sm:text-base text-white/80 max-w-md mx-auto mb-8">
            Score an employee profile in seconds, straight from your trained
            model.
          </p>
          <Link
            to="/predict"
            className="relative inline-flex items-center gap-2 bg-white text-primary-dark font-medium text-sm px-6 py-3.5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Predict Employee Churn <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
