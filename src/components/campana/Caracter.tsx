import Image from "next/image";

export default function Caracter() {
  return (
    <section aria-labelledby="caracter-titulo" className="bg-white">
      <div className="mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-10">
        <h2
          id="caracter-titulo"
          className="mx-auto max-w-[58rem] text-center font-campana text-[1.45rem] font-extrabold leading-snug tracking-[0.01em] text-campana-tinta sm:text-[1.9rem] lg:text-[2.35rem]"
        >
          Mi carácter se ha cultivado recorriendo Antioquia, trabajando con sus
          municipios y convirtiendo proyectos en resultados.
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 lg:mt-9 lg:flex-row lg:gap-8">
          <p className="text-center font-campana text-2xl leading-tight text-campana-dorado sm:text-3xl lg:text-right lg:text-[2.6rem]">
            <strong className="font-bold">Antioquia</strong> será nuestra
            <br className="hidden sm:block" />{" "}
            <strong className="font-bold">mejor cosecha</strong>
          </p>
          <Image
            src="/images/campana/ilustracion-canasta.webp"
            alt=""
            aria-hidden="true"
            width={900}
            height={900}
            sizes="(max-width: 1024px) 45vw, 220px"
            className="w-36 lg:w-52 lg:border-l-[3px] lg:border-campana-hoja lg:pl-8"
          />
        </div>
      </div>
    </section>
  );
}
