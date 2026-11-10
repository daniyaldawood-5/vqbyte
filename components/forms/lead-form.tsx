"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { track } from "@/lib/analytics";
import { services } from "@/content/services";
import { industryBySlug } from "@/content/industries";

const otherOptions = ["Not sure yet — need advice"];

export function LeadForm() {
  const search = useSearchParams();
  const interestParam = search.get("interest") ?? "";
  const industryParam = search.get("industry") ?? "";
  const initialInterest = services.find((s) => s.slug === interestParam)?.name ?? "";
  const industryName = industryBySlug[industryParam]?.name;

  const [interest, setInterest] = useState(initialInterest);
  const [method, setMethod] = useState("email");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  function onStart() {
    if (started) return;
    setStarted(true);
    track("lead_form_start");
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }
    setState("loading");
    setError("");
    const form = new FormData(formEl);
    const payload: Record<string, unknown> = Object.fromEntries(form.entries());
    payload.consent = form.get("consent") === "on";
    payload.interest = interest;
    payload.contactMethod = method;
    if (industryName) payload.message = `[Industry: ${industryName}] ${payload.message ?? ""}`;
    payload.sourcePath = window.location.pathname + window.location.search;
    payload.referrer = document.referrer;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "We couldn't send your message. Please try again.");
      setState("success");
      track("lead_form_submit", { interest });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
      setState("error");
    }
  }

  if (state === "success")
    return (
      <div className="form-success" role="status">
        <CircleCheck size={40} aria-hidden="true" />
        <h2>Thank you — we&apos;ve received your message.</h2>
        <p>A member of our team will reply within one business day using your preferred contact method.</p>
        <Link className="text-link" href="/insights">
          Read our guides while you wait →
        </Link>
      </div>
    );

  return (
    <form className="lead-form" onSubmit={submit} onFocus={onStart} noValidate={false}>
      <div className="form-grid">
        <label>
          Full name <span aria-hidden="true">*</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          Work email <span aria-hidden="true">*</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label>
          Company <span aria-hidden="true">*</span>
          <input name="company" autoComplete="organization" required minLength={2} maxLength={150} />
        </label>
        <label>
          Country
          <input name="country" autoComplete="country-name" maxLength={100} />
        </label>
        <label className="full">
          What do you need help with? <span aria-hidden="true">*</span>
          <select name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} required>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug}>{s.name}</option>
            ))}
            {otherOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Company size
          <select name="companySize" defaultValue="">
            <option value="">Select</option>
            <option>1–10 employees</option>
            <option>11–50 employees</option>
            <option>51–250 employees</option>
            <option>251–1,000 employees</option>
            <option>1,000+ employees</option>
          </select>
        </label>
        <label>
          When do you want to start?
          <select name="timeline" defaultValue="">
            <option value="">Select</option>
            <option>As soon as possible</option>
            <option>Within 1–3 months</option>
            <option>In 3–6 months</option>
            <option>Just researching</option>
          </select>
        </label>
        <label className="full">
          Tell us about your project <span aria-hidden="true">*</span>
          <textarea
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={3000}
            placeholder="What are you trying to achieve, and what's getting in the way today?"
          />
        </label>
        <label>
          Preferred contact method
          <select name="contactMethod" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="email">Email</option>
            <option value="phone">Phone call</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </label>
        <label>
          Phone {method !== "email" && <span aria-hidden="true">*</span>}
          <input name="phone" type="tel" autoComplete="tel" required={method !== "email"} maxLength={40} />
        </label>
        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="consent full">
          <input name="consent" type="checkbox" required />
          <span>
            I agree that VQBYTE may use these details to respond to my enquiry, as described in the{" "}
            <Link href="/legal/privacy">privacy policy</Link>.
          </span>
        </label>
      </div>
      {state === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Send message"} <span aria-hidden="true">→</span>
      </button>
      <p className="form-note">We reply within one business day. Your details are never shared or sold.</p>
    </form>
  );
}
