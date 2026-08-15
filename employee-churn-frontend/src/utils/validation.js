// Field definitions mirror EmployeeData in main.py exactly.
// Do not add, remove, or rename fields without checking the backend model first.

export const FIELD_DEFS = {
  Age: { type: "number", min: 18, max: 65, label: "Age" },
  Gender: { type: "select", options: ["Male", "Female"], label: "Gender" },
  Education: {
    type: "select",
    options: ["Bachelors", "Masters", "PHD"],
    label: "Education",
  },
  JoiningYear: {
    type: "number",
    min: 2000,
    max: 2035,
    label: "Joining Year",
  },
  PaymentTier: {
    type: "select",
    options: [1, 2, 3],
    label: "Payment Tier",
  },
  ExperienceInCurrentDomain: {
    type: "number",
    min: 0,
    max: 40,
    label: "Experience in Current Domain (years)",
  },
  City: {
    type: "select",
    options: ["Bangalore", "New Delhi", "Pune"],
    label: "City",
  },
  EverBenched: {
    type: "toggle",
    options: ["No", "Yes"],
    label: "Ever Benched",
  },
};

export const DEFAULT_FORM_STATE = {
  Age: "",
  Gender: "Male",
  Education: "Bachelors",
  JoiningYear: "",
  PaymentTier: 2,
  ExperienceInCurrentDomain: "",
  City: "Bangalore",
  EverBenched: "No",
};

/**
 * Validates the full form against the same constraints FastAPI enforces.
 * Returns an object keyed by field name -> error message. Empty object = valid.
 * The backend remains the final authority; this only prevents obviously
 * invalid submissions and gives immediate feedback.
 */
export function validateForm(values) {
  const errors = {};

  if (values.Age === "" || values.Age === null) {
    errors.Age = "Age is required.";
  } else if (values.Age < 18 || values.Age > 65) {
    errors.Age = "Age must be between 18 and 65.";
  }

  if (values.JoiningYear === "" || values.JoiningYear === null) {
    errors.JoiningYear = "Joining year is required.";
  } else if (values.JoiningYear < 2000 || values.JoiningYear > 2035) {
    errors.JoiningYear = "Joining year must be between 2000 and 2035.";
  }

  if (
    values.ExperienceInCurrentDomain === "" ||
    values.ExperienceInCurrentDomain === null
  ) {
    errors.ExperienceInCurrentDomain = "Experience is required.";
  } else if (
    values.ExperienceInCurrentDomain < 0 ||
    values.ExperienceInCurrentDomain > 40
  ) {
    errors.ExperienceInCurrentDomain = "Experience must be between 0 and 40 years.";
  }

  if (!["Bachelors", "Masters", "PHD"].includes(values.Education)) {
    errors.Education = "Select a valid education level.";
  }
  if (!["Bangalore", "New Delhi", "Pune"].includes(values.City)) {
    errors.City = "Select a valid city.";
  }
  if (![1, 2, 3].includes(Number(values.PaymentTier))) {
    errors.PaymentTier = "Select a valid payment tier.";
  }
  if (!["Male", "Female"].includes(values.Gender)) {
    errors.Gender = "Select a valid gender.";
  }
  if (!["Yes", "No"].includes(values.EverBenched)) {
    errors.EverBenched = "Select yes or no.";
  }

  return errors;
}

/** Converts raw form state into the exact JSON body /predict expects. */
export function toRequestPayload(values) {
  return {
    Education: values.Education,
    JoiningYear: Number(values.JoiningYear),
    City: values.City,
    PaymentTier: Number(values.PaymentTier),
    Age: Number(values.Age),
    Gender: values.Gender,
    EverBenched: values.EverBenched,
    ExperienceInCurrentDomain: Number(values.ExperienceInCurrentDomain),
  };
}
