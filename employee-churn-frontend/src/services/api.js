const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Custom error carrying structured details from the API (status code,
 * FastAPI validation errors, etc.) so the UI can render field-specific
 * messages instead of a generic failure.
 */
export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors || null;
  }
}

async function parseFastApiError(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // response wasn't JSON
  }

  if (response.status === 422 && body?.detail && Array.isArray(body.detail)) {
    const fieldErrors = {};
    for (const err of body.detail) {
      const field = err.loc?.[err.loc.length - 1];
      if (field) fieldErrors[field] = err.msg;
    }
    return new ApiError("The server rejected some of the values you entered.", {
      status: 422,
      fieldErrors,
    });
  }

  if (response.status === 503) {
    return new ApiError(
      body?.detail || "Prediction service is currently unavailable.",
      { status: 503 }
    );
  }

  if (response.status === 500) {
    return new ApiError("Prediction failed. Please try again.", { status: 500 });
  }

  return new ApiError(body?.detail || `Request failed (${response.status}).`, {
    status: response.status,
  });
}

/**
 * POST /predict
 * Sends employee data exactly matching the FastAPI EmployeeData model
 * and returns the PredictionResponse payload unchanged.
 */
export async function predictEmployee(data) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new ApiError(
      "Unable to connect to prediction server. Please make sure FastAPI is running.",
      { status: 0 }
    );
  }

  if (!response.ok) {
    throw await parseFastApiError(response);
  }

  return response.json();
}

/**
 * GET /health
 * Returns { status: "ok", model_loaded: boolean } on success, or
 * { status: "offline" } if the request could not be made at all.
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      return { status: "offline", model_loaded: false };
    }
    return await response.json();
  } catch {
    return { status: "offline", model_loaded: false };
  }
}
