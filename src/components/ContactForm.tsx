"use client";

import { useState } from "react";

const field =
  "w-full rounded-sm border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-gold-500";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-sm border border-gold-500/30 bg-cream-100 p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gold-500/15 text-2xl text-gold-600">
          ✓
        </div>
        <h3 className="mt-5 font-display text-2xl text-ink-900">Thank you</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
          Your message has been received. A member of our investor relations team
          will be in touch shortly.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-semibold uppercase tracking-wider text-gold-700 hover:text-gold-600"
        >
          Send another message
        </button>
        <p className="mt-6 text-[0.7rem] text-ink-500">
          (Demo form — no message is actually sent.)
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-600">
            First name
          </label>
          <input required className={field} placeholder="Jane" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-600">
            Surname
          </label>
          <input required className={field} placeholder="Doe" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-600">
          Email
        </label>
        <input required type="email" className={field} placeholder="jane.doe@institution.com" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-600">
          Company / institution
        </label>
        <input className={field} placeholder="Institution name" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-600">
          Message
        </label>
        <textarea required rows={4} className={field} placeholder="How can we help?" />
      </div>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-ink-600">
        <input required type="checkbox" className="mt-0.5 accent-gold-600" />
        <span>
          I acknowledge the Privacy Statement and consent to Rubens Capital
          Partners processing my details to respond to this enquiry.
        </span>
      </label>
      <button type="submit" className="btn btn-ink w-full">
        Send message
      </button>
    </form>
  );
}
