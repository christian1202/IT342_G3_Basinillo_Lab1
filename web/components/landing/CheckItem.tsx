import { CheckCircle2 } from "lucide-react";

/** A single bullet point with a blue checkmark icon. */
export function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#3B6CF6]" />
      <span className="text-[#9CA3AF]">{text}</span>
    </li>
  );
}
