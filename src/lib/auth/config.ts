import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { autenticar } from "./usuarios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credenciales) {
        const email = String(credenciales?.email ?? "");
        const password = String(credenciales?.password ?? "");
        if (!email || !password) return null;

        const resultado = await autenticar(db, email, password);
        if (!resultado.ok) return null;

        const { id, email: correo, nombre, rol } = resultado.usuario;
        return { id, email: correo, nombre, rol };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.nombre = (user as any).nombre;
        token.rol = (user as any).rol;
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        nombre: token.nombre as string,
        rol: token.rol as "admin" | "editor",
      } as any;
      return session;
    },
  },
});
