import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from '@posthog/react'
import App from './App.jsx'
import './index.css'

console.log('PostHog Key present:', !!import.meta.env.VITE_PUBLIC_POSTHOG_KEY);
console.log('PostHog Host:', import.meta.env.VITE_PUBLIC_POSTHOG_HOST);

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
  capture_pageview: true,
  persistence: 'localStorage',
  autocapture: true,
  debug: true // Aide à voir les envois dans la console
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
