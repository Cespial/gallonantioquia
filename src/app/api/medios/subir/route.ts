import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { db } from "@/db";
import { requerirSesion } from "@/lib/auth/sesion";
import { registrarMedio, TIPOS_PERMITIDOS, TAMANO_MAXIMO } from "@/lib/medios/reglas";

/**
 * El archivo viaja del navegador a Vercel Blob sin pasar por el servidor; esta
 * ruta solo firma el permiso y anota el resultado. Por eso el límite de tamaño
 * y de formato se declaran en el token: es Blob quien los hace cumplir.
 */
export async function POST(peticion: Request): Promise<NextResponse> {
  const cuerpo = (await peticion.json()) as HandleUploadBody;

  try {
    const respuesta = await handleUpload({
      body: cuerpo,
      request: peticion,
      onBeforeGenerateToken: async (_ruta, cargaCliente) => {
        // Sin sesión no se firma nada. `requerirSesion` lanza y el catch de
        // abajo responde 401.
        const usuario = await requerirSesion();

        return {
          allowedContentTypes: TIPOS_PERMITIDOS,
          maximumSizeInBytes: TAMANO_MAXIMO,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            usuarioId: usuario.id,
            nombre: cargaCliente ?? null,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const carga = tokenPayload ? JSON.parse(tokenPayload) : {};

        await registrarMedio(db, {
          url: blob.url,
          nombre: carga.nombre ?? blob.pathname,
          subidoPor: carga.usuarioId ?? null,
        });
      },
    });

    return NextResponse.json(respuesta);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "";
    const sinSesion = mensaje === "NO_AUTENTICADO";

    return NextResponse.json(
      { error: sinSesion ? "Necesitas iniciar sesión." : "No se pudo subir la imagen." },
      { status: sinSesion ? 401 : 400 }
    );
  }
}
