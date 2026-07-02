import React from "react";
import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig.js";
import { PHASE_COLORS } from "./constants.js";

// The Establish → Enhance → Optimize journey, used as a top accent strip.
const PHASE_ACCENT = `linear-gradient(90deg, ${PHASE_COLORS.Establish.solid} 0 33.33%, ${PHASE_COLORS.Enhance.solid} 33.33% 66.66%, ${PHASE_COLORS.Optimize.solid} 66.66% 100%)`;

// Shows a "Sign in with Microsoft" screen until the user authenticates.
// Only accounts assigned to the app in Entra ID can sign in successfully;
// everyone else is blocked by Azure at the login step.
export default function AuthGate({ children }) {
  const { instance } = useMsal();
  const [error, setError] = React.useState("");

  const handleLogin = async () => {
    setError("");
    try {
      // Redirect flow (not popup) — avoids the block_nested_popups error that
      // happens when the redirect URI is the app's own root URL.
      await instance.loginRedirect(loginRequest);
    } catch (e) {
      // AADSTS50105 = user is not assigned to the app.
      const msg = e?.errorMessage || e?.message || "Sign-in failed.";
      if (/AADSTS50105/.test(msg)) {
        setError("Your account is not authorized to access this dashboard.");
      } else if (!/user_cancelled|interaction_in_progress/.test(msg)) {
        setError(msg);
      }
    }
  };

  return (
    <>
      <UnauthenticatedTemplate>
        <div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Establish · Enhance · Optimize accent strip */}
            <div className="h-1.5 w-full" style={{ background: PHASE_ACCENT }} />

            <div className="p-8 text-center">
              <img 
                src="/gmr-logo.png"
                alt="HARTS"
                className="mx-auto h-16 w-auto object-contain"
              />

              <div className="mt-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Transformation Maturity
              </div>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Sign in with your Microsoft account to continue.
              </p>

              <button
                type="button"
                onClick={handleLogin}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Sign in with Microsoft
              </button>

              {error ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
    </>
  );
}
