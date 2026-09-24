"use client";

import { useId, useState } from "react";
import { ActionButton, CodeView, ControlGroup, DemoLayout, Segmented, Stage } from "../primitives";

type Role = "admin" | "editor" | "owner";

interface Draft {
  name: string;
  email: string;
  age: string;
  role: Role;
}

const VALID: Draft = { name: "Saliq", email: "hello@saliq.dev", age: "27", role: "admin" };
const BROKEN: Draft = { name: "Saliq", email: "saliq.dev", age: "twenty", role: "owner" };

interface TsError {
  field: keyof Draft;
  line: number;
  code: string;
  message: string;
}

const HEADER = [
  'type Role = "admin" | "editor";',
  "interface User {",
  "  name: string;",
  "  email: `${string}@${string}`;",
  "  age: number;",
  "  role: Role;",
  "}",
  "",
  "const user: User = {",
];

const isNumeric = (v: string) => /^\d+$/.test(v.trim());
const literal = (field: keyof Draft, v: string) =>
  field === "age" && isNumeric(v) ? v.trim() : JSON.stringify(v);

function check(d: Draft): { lines: string[]; errors: TsError[] } {
  const lines = [...HEADER];
  const errors: TsError[] = [];
  const fields: (keyof Draft)[] = ["name", "email", "age", "role"];

  for (const f of fields) {
    const v = d[f];
    if (v.trim() === "") {
      errors.push({
        field: f,
        line: 8,
        code: "TS2741",
        message: `Property '${f}' is missing in type '{ … }' but required in type 'User'.`,
      });
      continue;
    }
    const line = lines.length;
    lines.push(`  ${f}: ${literal(f, v)},`);
    if (f === "email" && !/.+@.+/.test(v)) {
      errors.push({ field: f, line, code: "TS2322", message: `Type '${JSON.stringify(v)}' is not assignable to type '\`\${string}@\${string}\`'.` });
    }
    if (f === "age" && !isNumeric(v)) {
      errors.push({ field: f, line, code: "TS2322", message: `Type 'string' is not assignable to type 'number'.` });
    }
    if (f === "role" && v !== "admin" && v !== "editor") {
      errors.push({ field: f, line, code: "TS2322", message: `Type '"${v}"' is not assignable to type 'Role'.` });
    }
  }
  lines.push("};");
  return { lines, errors };
}

/** What plain JavaScript would do at runtime with the same object. */
function runtime(d: Draft) {
  const ageOut = d.age.trim() === "" ? "NaN" : isNumeric(d.age) ? String(Number(d.age) + 1) : JSON.stringify(d.age + "1");
  const domain = d.email.includes("@") ? JSON.stringify(d.email.split("@")[1]) : "undefined";
  return [
    { expr: "user.age + 1", out: ageOut, bad: !isNumeric(d.age) },
    { expr: 'user.email.split("@")[1]', out: domain, bad: !d.email.includes("@") },
    { expr: 'can(user.role, "delete")', out: d.role === "owner" ? "undefined → crash" : "true", bad: d.role === "owner" },
  ];
}

function Field({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error: boolean }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[10px] text-muted">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error}
        className={`min-h-9 rounded-md border bg-white/[0.03] px-2.5 font-mono text-xs text-foreground transition-colors outline-none ${
          error ? "border-danger/70 focus:border-danger" : "border-border focus:border-accent/60"
        }`}
      />
    </div>
  );
}

export default function TypeScriptDemo() {
  const [draft, setDraft] = useState<Draft>(BROKEN);
  const { lines, errors } = check(draft);
  const set = (k: keyof Draft) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));
  const errFields = new Set(errors.map((e) => e.field));
  const fix = (field: keyof Draft) => setDraft((d) => ({ ...d, [field]: VALID[field] }));

  return (
    <DemoLayout
      simulated={false}
      visual={
        <div className="flex flex-col gap-3">
          <CodeView lines={lines} errors={errors.map((e) => e.line)} label="User type and object" />
          <div
            className={`rounded-lg border px-3 py-2.5 transition-colors duration-200 ${
              errors.length ? "border-danger/40 bg-danger/5" : "border-accent/40 bg-accent/5"
            }`}
            aria-live="polite"
          >
            <p className={`font-mono text-xs font-semibold ${errors.length ? "text-danger" : "text-accent"}`}>
              {errors.length
                ? `✗ ${errors.length} type error${errors.length > 1 ? "s" : ""} caught at compile time`
                : "✓ 0 errors — safe to ship"}
            </p>
            {errors.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {errors.map((e) => (
                  <li key={e.field} className="panel-in flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-foreground/85">
                    <span className="min-w-0 flex-1">
                      <span className="text-danger">{e.code}</span> {e.message}
                    </span>
                    <button
                      type="button"
                      onClick={() => fix(e.field)}
                      className="min-h-8 shrink-0 rounded-md border border-border px-2 text-[10px] text-accent transition-colors hover:border-accent/60"
                    >
                      Quick fix
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Stage label="Without types — what plain JS would do at runtime">
            <ul className="flex flex-col gap-1 font-mono text-[11px]">
              {runtime(draft).map((r) => (
                <li key={r.expr} className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-muted">{r.expr}</span>
                  <span className={r.bad ? "text-danger" : "text-foreground/85"}>→ {r.out}</span>
                </li>
              ))}
            </ul>
          </Stage>
        </div>
      }
      controls={
        <>
          <ControlGroup label="Edit the data">
            <Field label="name" value={draft.name} onChange={set("name")} error={errFields.has("name")} />
            <Field label="email" value={draft.email} onChange={set("email")} error={errFields.has("email")} />
            <Field label="age" value={draft.age} onChange={set("age")} error={errFields.has("age")} />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-muted">role</span>
              <Segmented
                label="role"
                value={draft.role}
                onChange={(v) => setDraft((d) => ({ ...d, role: v }))}
                options={[
                  { value: "admin", label: "admin" },
                  { value: "editor", label: "editor" },
                  { value: "owner", label: "owner" },
                ]}
              />
            </div>
          </ControlGroup>
          <div className="flex gap-2">
            <ActionButton onClick={() => setDraft(VALID)} disabled={errors.length === 0} className="flex-1">
              Fix all
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => setDraft(BROKEN)}>
              Break it
            </ActionButton>
          </div>
        </>
      }
    />
  );
}
