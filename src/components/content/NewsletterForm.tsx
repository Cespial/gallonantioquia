"use client";

import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle } from "lucide-react";

interface NewsletterFormProps {
  variant?: "dark" | "light";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function NewsletterForm({ variant = "light" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isDark = variant === "dark";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ingresa tu correo electr\u00f3nico.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Ingresa un correo v\u00e1lido.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3">
        <CheckCircle
          className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-dorado-tierra" : "text-verde-antioquia")}
        />
        <p className={cn("font-body text-sm", isDark ? "text-white/90" : "text-texto-principal")}>
          {"\u00a1Gracias! Te mantendremos informado."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
              isDark ? "text-white/40" : "text-texto-terciario"
            )}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="tu@correo.com"
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-card text-sm font-ui transition-colors duration-200",
              "focus:outline-none focus:ring-2",
              isDark
                ? "bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-dorado-tierra/50"
                : "bg-blanco-calido border border-borde text-texto-principal placeholder:text-texto-terciario focus:ring-verde-antioquia/30"
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            "px-6 py-3 rounded-card font-ui font-semibold text-sm transition-all duration-200",
            "bg-dorado-tierra text-oscuro hover:brightness-110 active:scale-[0.98]",
            "flex-shrink-0"
          )}
        >
          Suscribirme
        </button>
      </div>
      {error && (
        <p className={cn("text-xs mt-2 font-ui", isDark ? "text-red-300" : "text-red-600")}>
          {error}
        </p>
      )}
    </form>
  );
}
