import Encabezado from "@/components/campana/Encabezado";
import Pie from "@/components/campana/Pie";
import BotonWhatsApp from "@/components/campana/BotonWhatsApp";
import { leerAjustes } from "@/lib/ajustes/cacheadas";

/**
 * Envoltura del sitio público. Vive aparte del layout raíz para que el panel
 * de /admin no herede el encabezado ni el pie: además de sobrar en pantalla,
 * un fallo de hidratación en cualquiera de los dos dejaría sin responder los
 * botones del panel.
 */
export default async function LayoutSitio({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const ajustes = await leerAjustes();

  // El menú se configura desde el panel. Solo entra lo marcado como visible,
  // para que ocultar una sección sea un clic y no un despliegue.
  const navItems = ajustes["navegacion.menu"]
    .filter((item) => item.visible)
    .map((item) => ({ label: item.etiqueta, href: item.destino }));

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <Encabezado navItems={navItems} />
      <main id="main-content">{children}</main>
      <Pie
        navItems={navItems}
        contacto={{
          email: ajustes["contacto.email"],
          telefono: ajustes["contacto.telefono"],
          direccion: ajustes["contacto.direccion"],
        }}
        redes={ajustes["navegacion.redes"]}
      />
      <BotonWhatsApp numero={ajustes["contacto.whatsapp"]} />
    </>
  );
}
