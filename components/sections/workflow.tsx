export function Workflow({ steps, dark = false }: { steps: string[]; dark?: boolean }) {
  return (
    <ol className={`workflow ${dark ? "is-dark" : ""}`}>
      {steps.map((step, i) => (
        <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>
      ))}
    </ol>
  );
}
