export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  format: "texto" | "video" | "audio" | "fotografia";
  image: string;
  featured?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  image: string;
  content?: string;
}

export interface IdeaTopic {
  slug: string;
  number: string;
  title: string;
  description: string;
  content?: string;
}

export interface Episode {
  number: number;
  title: string;
  guest: string;
  guestRole: string;
  description: string;
  format: ("Video" | "Podcast" | "Resumen escrito")[];
  image: string;
}

export interface GuestColumn {
  slug: string;
  authorName: string;
  authorRole: string;
  authorCategory: string;
  authorImage: string;
  title: string;
  excerpt: string;
  date: string;
  pullQuote?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
}

export interface NavItem {
  label: string;
  href: string;
}
