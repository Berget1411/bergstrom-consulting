"use client";

import { useForm } from "@tanstack/react-form";
import { sendMessage } from "@/actions/send-mail";
import { useState } from "react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { BitmapChevron } from "@/components/bitmap-chevron";

function FieldError({
  field,
  showErrors,
}: {
  field: AnyFieldApi;
  showErrors: boolean;
}) {
  return (
    <>
      {showErrors && field.state.meta.errors.length > 0 ? (
        <div className="mt-2 font-mono text-xs text-red-500">
          {field.state.meta.errors.join(", ")}
        </div>
      ) : null}
      {field.state.meta.isValidating ? (
        <div className="mt-2 font-mono text-xs text-muted-foreground">
          Validating...
        </div>
      ) : null}
    </>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showErrors, setShowErrors] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      setStatus({ type: null, message: "" });

      const result = await sendMessage(value);

      if (result.success) {
        setStatus({ type: "success", message: result.success });
        setShowErrors(false);
        form.reset();
      } else if (result.error) {
        setStatus({ type: "error", message: result.error });
      }
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowErrors(true);
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {/* Name Field */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "A name is required"
              : value.length < 2
                ? "Name must be at least 2 characters"
                : undefined,
        }}
      >
        {(field) => (
          <div className="group">
            <label
              htmlFor={field.name}
              className="block font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3"
            >
              Name *
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full bg-background/50 border-2 px-4 py-3 font-mono text-sm text-foreground 
                    placeholder:text-muted-foreground/60 
                    focus:border-accent focus:bg-background/80 focus:outline-none 
                    transition-all duration-200
                    ${showErrors && field.state.meta.errors.length > 0 ? "border-red-500" : "border-border/50 hover:border-border"}`}
              placeholder="Your name"
            />
            <FieldError field={field} showErrors={showErrors} />
          </div>
        )}
      </form.Field>

      {/* Email Field */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "An email is required";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(value)
              ? "Please enter a valid email address"
              : undefined;
          },
        }}
      >
        {(field) => (
          <div className="group">
            <label
              htmlFor={field.name}
              className="block font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3"
            >
              Email *
            </label>
            <input
              type="email"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full bg-background/50 border-2 px-4 py-3 font-mono text-sm text-foreground 
                    placeholder:text-muted-foreground/60 
                    focus:border-accent focus:bg-background/80 focus:outline-none 
                    transition-all duration-200
                    ${showErrors && field.state.meta.errors.length > 0 ? "border-red-500" : "border-border/50 hover:border-border"}`}
              placeholder="your@email.com"
            />
            <FieldError field={field} showErrors={showErrors} />
          </div>
        )}
      </form.Field>

      {/* Message Field */}
      <form.Field
        name="message"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "A message is required"
              : value.length < 10
                ? "Message must be at least 10 characters"
                : value.length > 1000
                  ? "Message must be less than 1000 characters"
                  : undefined,
        }}
      >
        {(field) => (
          <div className="group">
            <label
              htmlFor={field.name}
              className="block font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3"
            >
              Message *
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={6}
              className={`w-full bg-background/50 border-2 px-4 py-3 font-mono text-sm text-foreground 
                    placeholder:text-muted-foreground/60 
                    focus:border-accent focus:bg-background/80 focus:outline-none 
                    transition-all duration-200 resize-none
                    ${showErrors && field.state.meta.errors.length > 0 ? "border-red-500" : "border-border/50 hover:border-border"}`}
              placeholder="Tell us about your project..."
            />
            <FieldError field={field} showErrors={showErrors} />
          </div>
        )}
      </form.Field>

      {/* Status Messages */}
      {status.type && (
        <div
          className={`border px-4 py-3 font-mono text-xs ${
            status.type === "success"
              ? "border-accent/30 text-accent bg-accent/5"
              : "border-red-500/30 text-red-500 bg-red-500/5"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="flex items-center gap-8 pt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground 
                    hover:border-accent hover:text-accent 
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-foreground/20 disabled:hover:text-foreground"
            >
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              {!isSubmitting && (
                <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
              )}
            </button>

            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              * Required fields
            </span>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
