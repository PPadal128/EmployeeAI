import { useState } from "react";
import { WifiOff, Sparkles } from "lucide-react";
import PredictionForm from "../components/PredictionForm";
import PredictionResult from "../components/PredictionResult";
import PageHeader from "../components/PageHeader";
import { predictEmployee, ApiError } from "../services/api";
import { addHistoryEntry } from "../utils/history";

export default function Predict() {
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [lastInput, setLastInput] = useState(null);

  async function handleSubmit(payload) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});
    setResult(null);

    try {
      const prediction = await predictEmployee(payload);
      setResult(prediction);
      setLastInput(payload);
      addHistoryEntry(payload, prediction);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pb-20">
    <PageHeader
      eyebrow="Predict Churn"
      title="Score an individual employee profile."
      subtitle="Enter an employee profile below to get a live leave/stay prediction from your model."
    />
    <div className="max-w-6xl mx-auto px-5 lg:px-8 fade-up">
      {errorMessage && (
        <div className="flex items-start gap-3 bg-leave-soft text-leave border border-leave/20 rounded-xl px-4 py-3 mb-6 text-sm">
          <WifiOff size={17} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <PredictionForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
        />

        {result ? (
          <PredictionResult result={result} />
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-2xl p-12 text-center h-full min-h-[420px]">
            <div className="w-14 h-14 rounded-2xl bg-mint-soft flex items-center justify-center mb-4">
              <Sparkles size={22} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-ink-text mb-1">
              No prediction yet
            </p>
            <p className="text-sm text-muted max-w-xs">
              Fill in the employee's details and submit the form to see a live
              churn prediction from your model.
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
