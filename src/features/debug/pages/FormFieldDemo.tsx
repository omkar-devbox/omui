import React, { useState } from "react";
import type { FormOption } from "../../../shared/ui/FormField/types";
import { FormField } from "../../../shared/ui";

export const FormFieldDemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    message: "",
    country: "in",
    skills: ["react", "ts"],
    terms: false,
    plan: "pro",
    company: "" as unknown,
    aadhar: "1234-5678-9012",
    apiToken: "sk_test_51MzS2XSCX3uX3uX3uX",
    dob: "2000-01-01",
    age: "25",
    appointment: new Date().toISOString(),
    meeting: "2023-12-31",
    holiday: "2025-12-25",
  });

  // ── Real API: dummyjson.com/todos, 10 per page ───────────────────────────
  const loadTodos = async (
    inputValue: string,
    page = 1,
  ): Promise<{ options: FormOption[]; hasMore: boolean }> => {
    const limit = 10;
    const skip = (page - 1) * limit;
    // dummyjson supports ?q= for search on /todos/search, plain /todos for all
    const url = inputValue.trim()
      ? `https://dummyjson.com/todos/search?q=${encodeURIComponent(inputValue)}&limit=${limit}&skip=${skip}`
      : `https://dummyjson.com/todos?limit=${limit}&skip=${skip}`;

    const res = await fetch(url);
    const json = await res.json();
    const options: FormOption[] = (json.todos ?? []).map(
      (t: { id: number; todo: string }) => ({ label: t.todo, value: t.id }),
    );
    return { options, hasMore: skip + limit < json.total };
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    // Checkboxes provide 'checked'
    const finalValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const [submittedData, setSubmittedData] = useState<unknown>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Form Field Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          A single consolidated dynamically rendering component supporting all
          input types beautifully.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0b0f1a] p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                type="text"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />

              <FormField
                type="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <FormField
              type="date"
              name="dob"
              label="Date of Birth (Custom Date Picker)"
              value={formData.dob}
              onChange={handleChange}
              minDate="1950-01-01"
              maxDate={new Date()}
              showTodayButton
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                type="date"
                name="meeting"
                label="Date (MM-DD-YYYY)"
                value={formData.meeting}
                onChange={handleChange}
                dateFormat="mm-dd-yyyy"
                isClearable
              />

              <FormField
                type="date"
                name="appointment"
                label="Appointment (Date + Time)"
                value={formData.appointment}
                onChange={handleChange}
                showTime
                dateFormat="dd-mm-yyyy"
              />
            </div>

            <FormField
              type="date"
              name="holiday"
              label="Public Holiday (DD-MMM-YYYY)"
              value={formData.holiday}
              onChange={handleChange}
              dateFormat="dd-MMM-yyyy"
              placeholder="e.g. 25-Dec-2025"
            />

            <FormField
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              helperText="Must be at least 8 characters long."
            />

            <FormField
              type="textarea"
              name="message"
              label="Bio / Message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />

            <FormField
              type="number"
              name="age"
              label="Age (Strict Numeric Logic)"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age..."
              min={0}
              max={150}
            />

            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-5">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Advanced Selects
              </h3>

              <FormField
                type="select"
                name="country"
                label="Country of Origin (Single)"
                value={formData.country}
                onChange={handleChange}
                options={[
                  { label: "India", value: "in" },
                  { label: "United States", value: "us" },
                  { label: "United Kingdom", value: "uk" },
                  { label: "Australia", value: "au" },
                  { label: "Canada", value: "ca" },
                  { label: "Germany", value: "de" },
                  { label: "France", value: "fr" },
                ]}
                isSearchable
                isClearable
                placeholder="Type to search country..."
              />

              <FormField
                type="select"
                name="skills"
                label="Tech Stack (Multi Select)"
                value={formData.skills}
                onChange={handleChange}
                options={[
                  { label: "React", value: "react" },
                  { label: "TypeScript", value: "ts" },
                  { label: "Node.js", value: "node" },
                  { label: "Tailwind CSS", value: "tailwind" },
                  { label: "Next.js", value: "next" },
                  { label: "PostgreSQL", value: "pg" },
                  { label: "GraphQL", value: "gql" },
                ]}
                isSearchable
                isMulti
                isClearable
                placeholder="Select skills..."
              />

              {/* ── Async select (real API) ── */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Async Select — Real API
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                  Fetches from{" "}
                  <code className="font-mono">dummyjson.com/todos</code> — 254
                  items, 10 per page. Scroll to the bottom to load more. Search
                  uses the <code className="font-mono">/todos/search</code>{" "}
                  endpoint.
                </p>
                <FormField
                  type="select"
                  name="company"
                  label="Todo Task"
                  value={formData.company}
                  onChange={handleChange}
                  loadOptions={loadTodos}
                  defaultOptions
                  cacheOptions
                  isSearchable
                  isClearable
                  placeholder="Search todos…"
                  noOptionsMessage="No todos match your search"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-5">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                PII Masking (New)
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Sensitive fields that should be hidden from casual observers,
                with a visibility toggle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  type="text"
                  name="aadhar"
                  label="Aadhar Number"
                  value={formData.aadhar}
                  onChange={handleChange}
                  placeholder="XXXX-XXXX-XXXX"
                  isPII
                />

                <FormField
                  type="text"
                  name="apiToken"
                  label="API Token"
                  value={formData.apiToken}
                  onChange={handleChange}
                  placeholder="sk_..."
                  isPII
                />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-5">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Autofill & Spellcheck
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Control browser behaviors like autocomplete and spell
                correction.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  type="text"
                  name="username"
                  label="Username (Auto-complete)"
                  autoComplete="username"
                  placeholder="Choose a username"
                />

                <FormField
                  type="textarea"
                  name="spelltest"
                  label="Description (Spell-check ON)"
                  spellCheck={true}
                  rows={2}
                  placeholder="Tipe something wrong here..."
                />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-5">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Radio & Checkboxes
              </h3>

              <FormField
                type="radio"
                name="plan"
                label="Subscription Plan"
                value={formData.plan}
                onChange={handleChange}
                options={[
                  { label: "Free Tier", value: "free" },
                  { label: "Pro Tier ($9/mo)", value: "pro" },
                  { label: "Enterprise Tier ($49/mo)", value: "enterprise" },
                ]}
              />

              <div className="pt-2">
                <FormField
                  type="checkbox"
                  name="terms"
                  label="I accept the Terms of Service and Privacy Policy"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
              >
                Submit Form
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="sticky top-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 overflow-hidden">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Form State
            </h3>
            <pre className="text-xs bg-white dark:bg-[#0b0f1a] p-4 rounded-lg overflow-x-auto text-emerald-600 dark:text-emerald-400 border border-gray-100 dark:border-gray-800 shadow-inner">
              <code>{JSON.stringify(formData, null, 2)}</code>
            </pre>

            {submittedData && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Submitted Data
                </h3>
                <pre className="text-xs bg-white dark:bg-[#0b0f1a] p-4 rounded-lg overflow-x-auto text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-gray-800 shadow-inner">
                  <code>{JSON.stringify(submittedData, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
