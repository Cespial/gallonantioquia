import NewsletterForm from "@/components/content/NewsletterForm";

interface NewsletterCTAProps {
  title?: string;
  subtitle?: string;
}

export default function NewsletterCTA({
  title = "Recibe las reflexiones de Horacio",
  subtitle = "Suscr\u00edbete y recibir\u00e1s cada nueva entrada directamente en tu correo.",
}: NewsletterCTAProps) {
  return (
    <div className="mt-16 p-8 bg-oscuro-verde rounded-card text-center">
      <h3 className="font-display text-2xl text-white mb-2">{title}</h3>
      <p className="font-body text-sm text-white/70 mb-6">{subtitle}</p>
      <div className="max-w-md mx-auto">
        <NewsletterForm variant="dark" />
      </div>
    </div>
  );
}
