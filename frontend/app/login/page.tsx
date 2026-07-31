"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import GlobeMapVisual from "../../components/GlobeMapVisual";
import { authApi } from "../../lib/api/auth.api";
import { useAuthStore } from "../../lib/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      setUser(response.loggedInUser ?? response.data?.user ?? response.data);
      router.replace("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    setError("");
    setLoading(true);

    try {
      const response = await authApi.googleAuth(idToken);
      setUser(response.loggedInUser ?? response.data?.user ?? response.data);
      router.replace("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-panel__brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>IRCTC</span>
        </div>

        <div className="login-card">
          <div className="login-card__heading">
            <p className="login-card__eyebrow">WELCOME BACK</p>
            <h1>Pick up where your last journey ended.</h1>
            <p>Sign in to manage bookings, receive updates, and plan your next route.</p>
          </div>

          {error && <p className="login-card__error" role="alert">{error}</p>}

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>
            <div className="login-form__meta">
              <label className="remember-choice"><input type="checkbox" /> Remember me</label>
              <button type="button" className="text-button">Forgot password?</button>
            </div>
            <button type="submit" className="login-form__submit" disabled={loading}>
              {loading ? "Signing you in..." : "Continue to your account"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="login-card__divider"><span>or continue with</span></div>
          <div className="login-card__google">
            <GoogleAuthButton onSuccess={handleGoogleCredential} onError={() => setError("Google login failed")} />
          </div>
          <p className="login-card__footer">New to IRCTC? <button type="button" className="text-button">Create an account</button></p>
        </div>
      </section>

      <GlobeMapVisual />
    </main>
  );
}
