// Use a new project-scoped API setting so a prior project's URL is never
// inherited from a local .env file. The same-origin path works with the local
// Vite proxy and can be routed by the new deployment environment.
const configuredApiUrl = String(import.meta.env.VITE_OFFDAY_API_BASE_URL || "/backend")
    .trim()
    .replace(/\/+$/, "");

const isRelativeApiUrl = configuredApiUrl.startsWith("/");
const parsedApiUrl = isRelativeApiUrl ? null : new URL(configuredApiUrl);

// Local HTTP is acceptable only while both the storefront and API are local.
// A secure storefront must never attempt to send credentials to an HTTP API.
if (import.meta.env.PROD && parsedApiUrl && parsedApiUrl.protocol !== "https:") {
    throw new Error("Production builds must use an HTTPS API origin.");
}
if (typeof window !== "undefined" && window.location.protocol === "https:" && parsedApiUrl && parsedApiUrl.protocol !== "https:") {
    throw new Error("VITE_OFFDAY_API_BASE_URL must use HTTPS when the storefront uses HTTPS.");
}

export const API_URL = isRelativeApiUrl ? configuredApiUrl : parsedApiUrl.toString().replace(/\/$/, "");
