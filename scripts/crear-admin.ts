import { db } from "@/db";
import { crearUsuario } from "@/lib/auth/usuarios";

const [email, nombre, password] = process.argv.slice(2);

if (!email || !nombre || !password) {
  console.error('Uso: npm run crear-admin -- correo@dominio.co "Nombre" "contraseña"');
  process.exit(1);
}

crearUsuario(db, { email, nombre, password, rol: "admin" })
  .then((u) => console.log(`Administrador creado: ${u.email}`))
  .catch((e) => {
    console.error("No se pudo crear:", e.message);
    process.exit(1);
  });
