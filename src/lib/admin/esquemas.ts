import { z } from "zod";
import { TIPOS, type TipoContenido, type CampoExtra } from "./tipos";

/** Minúsculas, números y guiones. Sin tildes, espacios ni mayúsculas. */
export const esquemaSlug = z
  .string()
  .min(1, "El slug no puede estar vacío")
  .max(120, "El slug es demasiado largo")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo admite minúsculas, números y guiones");

function campoAZod(campo: CampoExtra): z.ZodTypeAny {
  let base: z.ZodTypeAny;

  switch (campo.control) {
    case "url":
      // Cadena vacía permitida: no toda columna tiene original en línea.
      base = z.union([z.literal(""), z.string().url("Debe ser una dirección web válida")]);
      break;
    case "numero":
      base = z.coerce.number().int().min(0);
      break;
    case "opcion":
      // Una sola opción de la lista.
      base = z.enum(campo.opciones as [string, ...string[]]);
      break;
    case "multiple":
      // Varias opciones a la vez.
      base = z.array(z.enum(campo.opciones as [string, ...string[]]));
      if (campo.obligatorio) {
        return (base as z.ZodArray<z.ZodTypeAny>).min(1, `Elige al menos un valor en ${campo.etiqueta}`);
      }
      // `.optional()` explícito: esta rama sale del switch con `return` y no
      // alcanza el bloque común del final, donde los demás controles lo reciben.
      return base.optional();
    case "imagen":
      base = z.union([z.literal(""), z.string()]);
      break;
    default:
      base = z.string();
  }

  if (campo.obligatorio && campo.control !== "numero") {
    return base.refine(
      (v) => String(v).trim().length > 0,
      `${campo.etiqueta} es obligatorio`
    );
  }
  return campo.obligatorio ? base : base.optional();
}

function esquemaExtra(tipo: TipoContenido) {
  const forma: Record<string, z.ZodTypeAny> = {};
  for (const campo of TIPOS[tipo].camposExtra) {
    forma[campo.nombre] = campoAZod(campo);
  }
  return z.object(forma);
}

/** Validador completo del formulario de un tipo. */
export function esquemaContenido(tipo: TipoContenido) {
  const config = TIPOS[tipo];

  const categoria = config.taxonomia
    ? z.enum(config.taxonomia.valores as [string, ...string[]], {
        error: () => `Elige un valor válido de ${config.taxonomia!.etiqueta}`,
      })
    : z.null().or(z.undefined());

  return z.object({
    slug: esquemaSlug,
    titulo: z.string().min(1, "El título es obligatorio").max(300),
    resumen: z.string().max(600, "El resumen no debe pasar de 600 caracteres").optional().nullable(),
    cuerpoHtml: z.string().optional().nullable(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato AAAA-MM-DD"),
    categoria,
    estado: z.enum(["borrador", "publicado"]),
    destacado: z.boolean(),
    orden: z.coerce.number().int().min(0),
    imagenId: z.string().uuid().nullable().optional(),
    extra: esquemaExtra(tipo),
  });
}

export type DatosContenido = z.infer<ReturnType<typeof esquemaContenido>>;
