import { useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { DEFAULT_FORM_STATE, validateForm, toRequestPayload } from "../utils/validation";

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-text mb-1.5">
      {children}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-leave mt-1.5" role="alert">
      <AlertCircle size={12} /> {message}
    </p>
  );
}

function NumberField({ id, value, onChange, onBlur, min, max, error, placeholder }) {
  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      onBlur={onBlur}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full px-3.5 py-2.5 rounded-xl border bg-card text-sm text-ink-text
        placeholder:text-muted-soft transition-colors
        ${error ? "border-leave" : "border-border hover:border-primary/40"}
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary`}
    />
  );
}

function SelectField({ id, value, onChange, options, error }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full px-3.5 py-2.5 rounded-xl border bg-card text-sm text-ink-text
        transition-colors appearance-none cursor-pointer
        ${error ? "border-leave" : "border-border hover:border-primary/40"}
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function SegmentedField({ id, value, onChange, options }) {
  return (
    <div
      id={id}
      role="radiogroup"
      className="grid grid-cols-2 gap-2 p-1 bg-surface rounded-xl border border-border"
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          onClick={() => onChange(opt)}
          className={`py-2 rounded-lg text-sm font-medium transition-all
            ${
              value === opt
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-ink-text"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FieldGroup({ title, description, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-[15px] text-ink-text">
          {title}
        </h3>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

export default function PredictionForm({ onSubmit, isSubmitting, fieldErrors }) {
  const [values, setValues] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const mergedErrors = { ...errors, ...fieldErrors };

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(DEFAULT_FORM_STATE).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(toRequestPayload(values));
    }
  }

  const isFormComplete = Object.values(values).every((v) => v !== "" && v !== null);

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-2xl p-6 lg:p-8">
      <FieldGroup title="Employee Information" description="Demographic details">
        <div>
          <FieldLabel htmlFor="Age">Age</FieldLabel>
          <NumberField
            id="Age"
            value={values.Age}
            onChange={(v) => update("Age", v)}
            onBlur={() => markTouched("Age")}
            min={18}
            max={65}
            placeholder="e.g. 32"
            error={touched.Age && mergedErrors.Age}
          />
          <FieldError message={touched.Age && mergedErrors.Age} />
        </div>
        <div>
          <FieldLabel htmlFor="Gender">Gender</FieldLabel>
          <SegmentedField
            id="Gender"
            value={values.Gender}
            onChange={(v) => update("Gender", v)}
            options={["Male", "Female"]}
          />
        </div>
        <div>
          <FieldLabel htmlFor="Education">Education</FieldLabel>
          <SelectField
            id="Education"
            value={values.Education}
            onChange={(v) => update("Education", v)}
            options={["Bachelors", "Masters", "PHD"]}
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Employment Information" description="Role and tenure details">
        <div>
          <FieldLabel htmlFor="JoiningYear">Joining Year</FieldLabel>
          <NumberField
            id="JoiningYear"
            value={values.JoiningYear}
            onChange={(v) => update("JoiningYear", v)}
            onBlur={() => markTouched("JoiningYear")}
            min={2000}
            max={2035}
            placeholder="e.g. 2018"
            error={touched.JoiningYear && mergedErrors.JoiningYear}
          />
          <FieldError message={touched.JoiningYear && mergedErrors.JoiningYear} />
        </div>
        <div>
          <FieldLabel htmlFor="PaymentTier">Payment Tier</FieldLabel>
          <SelectField
            id="PaymentTier"
            value={values.PaymentTier}
            onChange={(v) => update("PaymentTier", Number(v))}
            options={[1, 2, 3]}
          />
        </div>
        <div>
          <FieldLabel htmlFor="ExperienceInCurrentDomain">
            Experience in Current Domain
          </FieldLabel>
          <NumberField
            id="ExperienceInCurrentDomain"
            value={values.ExperienceInCurrentDomain}
            onChange={(v) => update("ExperienceInCurrentDomain", v)}
            onBlur={() => markTouched("ExperienceInCurrentDomain")}
            min={0}
            max={40}
            placeholder="years"
            error={
              touched.ExperienceInCurrentDomain &&
              mergedErrors.ExperienceInCurrentDomain
            }
          />
          <FieldError
            message={
              touched.ExperienceInCurrentDomain &&
              mergedErrors.ExperienceInCurrentDomain
            }
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Work Information" description="Location and bench status">
        <div>
          <FieldLabel htmlFor="City">City</FieldLabel>
          <SelectField
            id="City"
            value={values.City}
            onChange={(v) => update("City", v)}
            options={["Bangalore", "New Delhi", "Pune"]}
          />
        </div>
        <div>
          <FieldLabel htmlFor="EverBenched">Ever Benched</FieldLabel>
          <SegmentedField
            id="EverBenched"
            value={values.EverBenched}
            onChange={(v) => update("EverBenched", v)}
            options={["No", "Yes"]}
          />
        </div>
      </FieldGroup>

      <button
        type="submit"
        disabled={isSubmitting || !isFormComplete}
        className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-dark to-primary
          hover:brightness-110 hover:-translate-y-0.5 hover:shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
          text-white font-medium text-sm py-3.5 rounded-xl transition-all"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size={16} /> Analyzing Employee…
          </>
        ) : (
          <>
            <Sparkles size={16} /> Predict Employee Churn
          </>
        )}
      </button>
    </form>
  );
}
