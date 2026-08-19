import Image from "next/image";

export default function Caracter() {
  return (
    <section aria-labelledby="caracter-titulo" className="bg-white">
      <div className="mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-7">
        <h2
          id="caracter-titulo"
          className="text-center titular-sin-balance font-campana text-[1.45rem] font-extrabold leading-snug tracking-[0.01em] text-campana-tinta sm:text-[1.9rem] lg:ml-auto lg:max-w-[71rem] lg:text-right lg:text-[2.55rem] lg:leading-[1.05] lg:tracking-[0.03em]"
        >
          Mi carácter se ha cultivado recorriendo Antioquia, trabajando con sus
          municipios y convirtiendo proyectos en resultados.
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 lg:mt-7 lg:flex-row lg:justify-end lg:gap-6">
          <p className="text-center font-campana text-2xl leading-tight text-campana-dorado sm:text-3xl lg:text-right lg:text-[2.8rem] lg:leading-[1.12]">
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
            className="w-36 lg:w-[15.2rem] lg:border-l-[3px] lg:border-campana-hoja lg:pl-7"
          />
        </div>
      </div>
    </section>
  );
}
