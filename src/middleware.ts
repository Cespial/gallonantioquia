import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Este archivo va en `src/`, no en la raíz del repositorio. Next.js busca el
// middleware junto a la carpeta `app`, y aquí `app` vive dentro de `src/`. En
// la raíz el proyecto compila sin una sola advertencia y el middleware nunca
// se registra, con lo que /admin queda abierto de par en par.

export function middleware(peticion: NextRequest) {
  const { pathname } = peticion.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  // Comprobación barata de presencia de cookie de sesión. La verificación
  // real de rol y validez la hace cada Server Action con requerirSesion().
  const cookie =
    peticion.cookies.get("authjs.session-token") ??
    peticion.cookies.get("__Secure-authjs.session-token");

  if (!cookie) {
    const destino = new URL("/admin/login", peticion.url);
    return NextResponse.redirect(destino);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
