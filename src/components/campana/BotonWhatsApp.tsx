import { MessageCircle } from "lucide-react";

export default function BotonWhatsApp({ numero }: { numero: string }) {
  const limpio = numero.replace(/\D/g, "");
  if (!limpio) return null;

  return (
    <a
      href={`https://wa.me/${limpio}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp al equipo de campaña"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-lg transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-campana-bosque"
    >
      <MessageCircle className="h-7 w-7 text-white" fill="white" strokeWidth={0} />
    </a>
  );
}
