/** Blue uppercase label used above feature section headings. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-widest text-[#3B6CF6]">
      {children}
    </span>
  );
}
