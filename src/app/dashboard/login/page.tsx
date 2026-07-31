"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/cdn";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm px-4 cursor-default">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-line rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <Image
              src={asset("admirate logo.webp")}
              alt="Admirate logo"
              width={56}
              height={56}
              className="rounded-xl mb-4"
            />
            <h1 className="text-xl font-bold text-ink tracking-wide">
              ADMIRATE
            </h1>
            <p className="text-muted mt-1 text-sm">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-brand/5 border border-brand/20 rounded-xl p-3.5 text-brand text-sm text-center"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white border border-line rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 transition-colors"
                placeholder="admin@admirate.in"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-white border border-line rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-muted text-xs mt-6">
          ADMIRATE &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
