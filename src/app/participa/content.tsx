"use client";

import { useState, useCallback } from "react";
import { Lightbulb, MessageSquare, Users, BookOpen } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import FadeIn from "@/components/animations/FadeIn";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

/* -------------------------------------------------------------------------- */
/*  Form state types                                                          */
/* -------------------------------------------------------------------------- */

interface IdeaForm {
  nombre: string;
  municipio: string;
  tema: string;
  descripcion: string;
}

interface TemaForm {
  nombre: string;
  tema: string;
}

interface InvitadoForm {
  nombre: string;
  invitado: string;
  razon: string;
}

interface HistoriaForm {
  nombre: string;
  municipio: string;
  historia: string;
}

const temaOptions = [
  "Infraestructura",
  "Educacion",
  "Salud",
  "Agricultura",
  "Turismo",
  "Innovacion",
  "Otro",
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ParticipaContent() {
  /* ---- toast ---- */
  const [toastVisible, setToastVisible] = useState(false);
  const hideToast = useCallback(() => setToastVisible(false), []);

  /* ---- idea form ---- */
  const [ideaForm, setIdeaForm] = useState<IdeaForm>({
    nombre: "",
    municipio: "",
    tema: "",
    descripcion: "",
  });

  const updateIdea = (field: keyof IdeaForm) => (value: string) =>
    setIdeaForm((prev) => ({ ...prev, [field]: value }));

  const submitIdea = () => {
    console.log("Idea enviada:", ideaForm);
    setIdeaForm({ nombre: "", municipio: "", tema: "", descripcion: "" });
    setToastVisible(true);
  };

  /* ---- tema form ---- */
  const [temaForm, setTemaForm] = useState<TemaForm>({
    nombre: "",
    tema: "",
  });

  const updateTema = (field: keyof TemaForm) => (value: string) =>
    setTemaForm((prev) => ({ ...prev, [field]: value }));

  const submitTema = () => {
    console.log("Tema propuesto:", temaForm);
    setTemaForm({ nombre: "", tema: "" });
    setToastVisible(true);
  };

  /* ---- invitado form ---- */
  const [invitadoForm, setInvitadoForm] = useState<InvitadoForm>({
    nombre: "",
    invitado: "",
    razon: "",
  });

  const updateInvitado = (field: keyof InvitadoForm) => (value: string) =>
    setInvitadoForm((prev) => ({ ...prev, [field]: value }));

  const submitInvitado = () => {
    console.log("Invitado sugerido:", invitadoForm);
    setInvitadoForm({ nombre: "", invitado: "", razon: "" });
    setToastVisible(true);
  };

  /* ---- historia form ---- */
  const [historiaForm, setHistoriaForm] = useState<HistoriaForm>({
    nombre: "",
    municipio: "",
    historia: "",
  });

  const updateHistoria = (field: keyof HistoriaForm) => (value: string) =>
    setHistoriaForm((prev) => ({ ...prev, [field]: value }));

  const submitHistoria = () => {
    console.log("Historia compartida:", historiaForm);
    setHistoriaForm({ nombre: "", municipio: "", historia: "" });
    setToastVisible(true);
  };

  /* ---- render ---- */
  return (
    <>
      <PageHero title="Participa" subtitle="Tu voz construye Antioquia" />

      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ---------------------------------------------------------------- */}
          {/*  1. Envia tu idea                                                */}
          {/* ---------------------------------------------------------------- */}
          <FadeIn delay={0}>
            <div className="bg-blanco-calido rounded-card p-6 md:p-8 border border-borde/50 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-dorado-tierra/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-dorado-tierra" />
                </div>
                <h2 className="font-heading font-bold text-lg text-texto-principal">
                  Envia tu idea para Antioquia
                </h2>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Nombre"
                  name="idea-nombre"
                  value={ideaForm.nombre}
                  onChange={updateIdea("nombre")}
                  placeholder="Tu nombre"
                  required
                />
                <FormField
                  label="Municipio"
                  name="idea-municipio"
                  value={ideaForm.municipio}
                  onChange={updateIdea("municipio")}
                  placeholder="Tu municipio"
                  required
                />
                <FormField
                  label="Tema"
                  name="idea-tema"
                  type="select"
                  value={ideaForm.tema}
                  onChange={updateIdea("tema")}
                  placeholder="Selecciona un tema"
                  options={temaOptions}
                  required
                />
                <FormField
                  label="Descripcion"
                  name="idea-descripcion"
                  type="textarea"
                  value={ideaForm.descripcion}
                  onChange={updateIdea("descripcion")}
                  placeholder="Describe tu idea para Antioquia"
                  required
                />
              </div>

              <div className="mt-6">
                <Button onClick={submitIdea} variant="primary" type="button">
                  Enviar idea
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* ---------------------------------------------------------------- */}
          {/*  2. Propon un tema                                               */}
          {/* ---------------------------------------------------------------- */}
          <FadeIn delay={100}>
            <div className="bg-blanco-calido rounded-card p-6 md:p-8 border border-borde/50 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-verde-antioquia/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-verde-antioquia" />
                </div>
                <h2 className="font-heading font-bold text-lg text-texto-principal">
                  Propon un tema de conversacion
                </h2>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Nombre"
                  name="tema-nombre"
                  value={temaForm.nombre}
                  onChange={updateTema("nombre")}
                  placeholder="Tu nombre"
                  required
                />
                <FormField
                  label="Tema"
                  name="tema-tema"
                  type="textarea"
                  value={temaForm.tema}
                  onChange={updateTema("tema")}
                  placeholder="Que tema te gustaria que se discutiera?"
                  required
                />
              </div>

              <div className="mt-6">
                <Button onClick={submitTema} variant="primary" type="button">
                  Proponer tema
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* ---------------------------------------------------------------- */}
          {/*  3. Sugiere un invitado                                          */}
          {/* ---------------------------------------------------------------- */}
          <FadeIn delay={200}>
            <div className="bg-blanco-calido rounded-card p-6 md:p-8 border border-borde/50 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-verde-suave flex items-center justify-center">
                  <Users className="w-5 h-5 text-verde-antioquia" />
                </div>
                <h2 className="font-heading font-bold text-lg text-texto-principal">
                  Sugiere un invitado
                </h2>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Nombre"
                  name="invitado-nombre"
                  value={invitadoForm.nombre}
                  onChange={updateInvitado("nombre")}
                  placeholder="Tu nombre"
                  required
                />
                <FormField
                  label="Invitado"
                  name="invitado-invitado"
                  value={invitadoForm.invitado}
                  onChange={updateInvitado("invitado")}
                  placeholder="Nombre del invitado sugerido"
                  required
                />
                <FormField
                  label="Razon"
                  name="invitado-razon"
                  type="textarea"
                  value={invitadoForm.razon}
                  onChange={updateInvitado("razon")}
                  placeholder="Por que seria interesante?"
                  required
                />
              </div>

              <div className="mt-6">
                <Button
                  onClick={submitInvitado}
                  variant="primary"
                  type="button"
                >
                  Sugerir invitado
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* ---------------------------------------------------------------- */}
          {/*  4. Comparte tu historia                                         */}
          {/* ---------------------------------------------------------------- */}
          <FadeIn delay={300}>
            <div className="bg-blanco-calido rounded-card p-6 md:p-8 border border-borde/50 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-dorado-tierra/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-dorado-tierra" />
                </div>
                <h2 className="font-heading font-bold text-lg text-texto-principal">
                  Comparte tu historia
                </h2>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Nombre"
                  name="historia-nombre"
                  value={historiaForm.nombre}
                  onChange={updateHistoria("nombre")}
                  placeholder="Tu nombre"
                  required
                />
                <FormField
                  label="Municipio"
                  name="historia-municipio"
                  value={historiaForm.municipio}
                  onChange={updateHistoria("municipio")}
                  placeholder="Tu municipio"
                  required
                />
                <FormField
                  label="Historia"
                  name="historia-historia"
                  type="textarea"
                  value={historiaForm.historia}
                  onChange={updateHistoria("historia")}
                  placeholder="Cuentanos una historia de tu comunidad"
                  required
                />
              </div>

              <div className="mt-6">
                <Button
                  onClick={submitHistoria}
                  variant="primary"
                  type="button"
                >
                  Compartir historia
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Footer note */}
        <p className="font-body text-texto-terciario text-center italic mt-12">
          Tus ideas nos ayudan a construir mejores conversaciones para Antioquia.
        </p>
      </SectionWrapper>

      <Toast
        message="Gracias! Tu mensaje ha sido recibido."
        visible={toastVisible}
        onClose={hideToast}
      />
    </>
  );
}
