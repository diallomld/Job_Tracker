import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from '@posthog/react'
import * as Sentry from "@sentry/react";
import App from './App.jsx'
import './index.css'

console.log("Initializing Sentry with DSN:", import.meta.env.VITE_SENTRY_DSN);

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  debug: true, // Enable debug mode to see internal logs
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/hpwipjnqjlgiszgpdpnv\.supabase\.co/],
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
  capture_pageview: true,
  persistence: 'localStorage',
  autocapture: true,
  session_recording: {
    maskAllInputs: false,
    maskAllTextAttributes: false,
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Une erreur est survenue. L'équipe technique a été prévenue.</p>}>
      <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
        <App />
      </PostHogProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
