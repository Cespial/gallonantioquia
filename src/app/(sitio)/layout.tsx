import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { leerAjuste } from "@/lib/ajustes/cacheadas";

/**
 * Envoltura del sitio público. Vive aparte del layout raíz para que el panel
 * de /admin no herede el encabezado ni el pie: además de sobrar en pantalla,
 * un fallo de hidratación en cualquiera de los dos dejaría sin responder los
 * botones del panel, que es exactamente lo que pasó con la fecha del Header.
 */
export default async function LayoutSitio({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // El menú se configura desde el panel. Solo entra lo marcado como visible,
  // para que ocultar una sección sea un clic y no un despliegue.
  const menu = await leerAjuste("navegacion.menu");
  const navItems = menu
    .filter((item) => item.visible)
    .map((item) => ({ label: item.etiqueta, href: item.destino }));

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <Header navItems={navItems} />
      <main id="main-content">{children}</main>
      <Footer navItems={navItems} />
    </>
  );
}
