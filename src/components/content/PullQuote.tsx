interface PullQuoteProps {
  quote: string;
  author?: string;
}

export default function PullQuote({ quote, author }: PullQuoteProps) {
  return (
    <blockquote className="border-l-4 border-dorado-tierra pl-6 py-2 my-8">
      <p className="font-display italic text-2xl md:text-3xl text-texto-secundario leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      {author && (
        <cite className="block font-ui text-sm text-texto-terciario mt-3 not-italic">
          &mdash; {author}
        </cite>
      )}
    </blockquote>
  );
}
