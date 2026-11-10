import { processSteps } from "@/content/process";

export function ProcessSteps() {
  return (
    <ol className="process-steps">
      {processSteps.map((s, i) => (
        <li key={s.title}>
          <span className="step-num">{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
