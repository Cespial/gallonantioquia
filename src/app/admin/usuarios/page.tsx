import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth/config";
import { db } from "@/db";
import { usuarios } from "@/db/esquema";
import TablaUsuarios from "@/components/admin/TablaUsuarios";

export default async function PaginaUsuarios() {
  const sesion = await auth();
  const actor = sesion?.user as unknown as { id: string; rol: string } | undefined;
  if (actor?.rol !== "admin") redirect("/admin");

  const filas = await db.select().from(usuarios).orderBy(desc(usuarios.creadoEn));

  return (
    <>
      <h1 className="font-display text-2xl mb-6">Usuarios</h1>
      <TablaUsuarios filas={filas} actorId={actor.id} />
    </>
  );
}
