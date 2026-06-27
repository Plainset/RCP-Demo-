type Props = {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  image: string;
};

/** Compact dark hero used on the inner marketing pages. */
export default function PageHero({ eyebrow, title, intro, image }: Props) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-cream-50">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/60" />
      <div className="shell relative pb-16 pt-36 md:pb-24 md:pt-44">
        <span className="eyebrow reveal reveal-1">{eyebrow}</span>
        <h1 className="reveal reveal-2 mt-5 max-w-3xl font-display text-4xl leading-[1.06] text-balance sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="reveal reveal-3 mt-6 max-w-2xl text-lg leading-relaxed text-cream-200/75">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
