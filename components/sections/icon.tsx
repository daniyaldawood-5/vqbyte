import { Sparkles } from "lucide-react";
import { DuotoneIcon, duotoneNames } from "@/components/icons/duotone";

/** Renders VQBYTE's own duotone icon for a name, falling back to a simple outline icon. */
export function Icon({ name, size = 28 }: { name: string; size?: number }) {
  if (duotoneNames.includes(name)) return <DuotoneIcon name={name} size={size} />;
  return <Sparkles size={size * 0.8} aria-hidden="true" strokeWidth={1.8} />;
}
