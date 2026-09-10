import { z } from "zod";
import { CLAVES_PORTADA, FRANJAS } from "./portada";

const hito = z.object({ anio: z.string(), titulo: z.string(), descripcion: z.string() });
const itemMenu = z.object({ etiqueta: z.string(), destino: z.string(), visible: z.boolean() });

export const CLAVES = {
  "sitio.enConstruccion": { esquema: z.boolean(), porDefecto: true },
  "sitio.mensajeConstruccion": {
    esquema: z.string(),
    porDefecto: "Estamos preparando este espacio. Vuelve pronto.",
  },
  "sobre.texto": { esquema: z.string(), porDefecto: "" },
  "sobre.trayectoria": { esquema: z.array(hito), porDefecto: [] },
  "navegacion.menu": { esquema: z.array(itemMenu), porDefecto: [] },
  "navegacion.redes": {
    // ⚠️ Cada red va opcional con `.catch("")`, no obligatoria. La fila que
    // había guardada traía solo tres claves —se escribió antes de que
    // existieran facebook y tiktok— y con el objeto estricto el `safeParse`
    // fallaba entero: los ajustes caían al valor por defecto y el pie se
    // quedaba sin un solo icono aunque hubiera enlaces guardados.
    esquema: z.object({
      x: z.string().catch(""),
      instagram: z.string().catch(""),
      youtube: z.string().catch(""),
      facebook: z.string().catch(""),
      tiktok: z.string().catch(""),
    }).partial().transform((v) => ({
      x: v.x ?? "",
      instagram: v.instagram ?? "",
      youtube: v.youtube ?? "",
      facebook: v.facebook ?? "",
      tiktok: v.tiktok ?? "",
    })),
    porDefecto: { x: "", instagram: "", youtube: "", facebook: "", tiktok: "" },
  },

  // --- Campaña «A paso firme por Antioquia» ---
  // El copy y los enlaces que vivían aquí (subtitulo del hero, frase del
  // perfil, mensaje de cierre, video y podcast) se mudaron a las franjas de
  // `portada.*`: cada uno es hoy un campo dentro de la franja donde se ve.
  // `migracion-portada.ts` los copió; lo que quede en la tabla es historia.
  /** Alimenta el desplegable del formulario «Te escuchamos». */
  "campana.municipios": { esquema: z.array(z.string()), porDefecto: [] },
  // Sin relleno: el pie y /contacto ocultan lo que esté vacío. Un dato
  // inventado al aire manda a un desconocido cada llamada y cada correo.
  "contacto.email": { esquema: z.string(), porDefecto: "" },
  "contacto.telefono": { esquema: z.string(), porDefecto: "" },
  "contacto.direccion": { esquema: z.string(), porDefecto: "Medellín, Antioquia, Colombia" },
  /** Solo dígitos con indicativo, como lo pide el enlace de wa.me. */
  "contacto.whatsapp": { esquema: z.string(), porDefecto: "" },

  ...CLAVES_PORTADA,
} as const;

export type ClaveAjuste = keyof typeof CLAVES;

/**
 * Lo que un editor puede cambiar sin ser administrador.
 *
 * El equipo de campaña necesita mover las franjas de la portada y los datos de
 * contacto sin pedir permiso, pero no debería poder apagar el sitio, rehacer el
 * menú ni reescribir la biografía. La lista se declara en blanco —lo que no
 * está, no se puede— para que una clave nueva nazca cerrada y haya que abrirla
 * a conciencia.
 *
 * `guardarAjuste` la hace cumplir en el servidor. Lo que la pantalla muestre o
 * esconda es cortesía, no control de acceso.
 */
export const CLAVES_DE_EDITOR = [
  "contacto.email",
  "contacto.telefono",
  "contacto.whatsapp",
  "contacto.direccion",
  "navegacion.redes",
  ...FRANJAS.map((f) => f.clave),
] as const satisfies readonly ClaveAjuste[];

export function editorPuedeEscribir(clave: string): boolean {
  return (CLAVES_DE_EDITOR as readonly string[]).includes(clave);
}

export type ValorDe<K extends ClaveAjuste> = z.infer<(typeof CLAVES)[K]["esquema"]>;
