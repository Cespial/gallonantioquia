import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthorCardProps {
  authorName: string;
  authorRole: string;
  authorCategory: string;
  authorImage: string;
  title: string;
  excerpt: string;
  date: string;
  slug?: string;
  pullQuote?: string;
}

export default function AuthorCard({
  authorName,
  authorRole,
  authorCategory,
  authorImage,
  title,
  excerpt,
  date,
  slug,
  pullQuote,
}: AuthorCardProps) {
  // Extract initials from author name (first + last)
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join("")
    .toUpperCase();

  const content = (
    <article
      className={cn(
        "bg-blanco-calido rounded-card p-6 border border-borde/50",
        "transition-all duration-300",
        slug && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      )}
    >
      {/* Author section */}
      <div className="flex items-center gap-4">
        {authorImage && !authorImage.includes("gallon-") ? (
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={authorImage}
              alt={authorName}
              fill
              sizes="64px"
              className="rounded-full object-cover border-2 border-borde/30"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-verde-antioquia flex items-center justify-center flex-shrink-0">
            <span className="font-brand text-white text-lg">{initials}</span>
          </div>
        )}
        <div>
          <h4 className="font-heading font-bold text-texto-principal">{authorName}</h4>
          <p className="text-sm text-texto-terciario font-ui">{authorRole}</p>
          <span className="inline-block mt-1 bg-verde-suave text-verde-antioquia text-xs font-ui font-semibold uppercase tracking-label px-2.5 py-0.5 rounded-full">
            {authorCategory}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-heading font-semibold text-lg mt-4 text-texto-principal">{title}</h3>

      {/* Excerpt */}
      <p className="font-body text-sm text-texto-secundario mt-2 line-clamp-3">{excerpt}</p>

      {/* Pull quote */}
      {pullQuote && (
        <blockquote className="border-l-4 border-dorado-tierra pl-4 my-4">
          <p className="font-display italic text-base text-texto-secundario leading-relaxed">
            &ldquo;{pullQuote}&rdquo;
          </p>
        </blockquote>
      )}

      {/* Date */}
      <time className="block font-ui text-xs text-texto-terciario mt-4">{date}</time>
    </article>
  );

  if (slug) {
    return (
      <Link href={slug} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}
