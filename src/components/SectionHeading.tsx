import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light"; // light = for dark backgrounds
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  className = "",
}: Props) {
  const centered = align === "center";
  const titleColor = tone === "light" ? "text-cream-50" : "text-ink-900";
  const introColor = tone === "light" ? "text-cream-200/70" : "text-ink-600";

  return (
    <Reveal
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && (
        <span className={`eyebrow ${centered ? "eyebrow-center" : ""}`}>{eyebrow}</span>
      )}
      <h2
        className={`mt-5 font-display text-3xl leading-[1.1] text-balance sm:text-4xl md:text-[2.75rem] ${titleColor}`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed text-balance ${introColor}`}>{intro}</p>
      )}
    </Reveal>
  );
}
