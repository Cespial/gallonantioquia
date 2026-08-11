"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
  valorInicial: string;
  /** Se llama en cada cambio; el formulario lo guarda en un input oculto. */
  alCambiar: (html: string) => void;
}

// El formato del contenido se declara aquí y no con la clase `prose`: ese
// nombre viene de @tailwindcss/typography, que este proyecto no instala, y sin
// el plugin no aplica ningún estilo. Las variantes arbitrarias sí funcionan.
const ESTILO_CUERPO = [
  "min-h-[24rem] max-w-none p-4 focus:outline-none",
  "[&_p]:mb-3 [&_p]:leading-relaxed",
  "[&_h2]:font-display [&_h2]:text-xl [&_h2]:mt-6 [&_h2]:mb-2",
  "[&_h3]:font-display [&_h3]:text-lg [&_h3]:mt-5 [&_h3]:mb-2",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-dorado-tierra [&_blockquote]:pl-4 [&_blockquote]:italic",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1",
  "[&_a]:text-verde-antioquia [&_a]:underline",
].join(" ");

export default function EditorTexto({ valorInicial, alCambiar }: Props) {
  const editor = useEditor({
    // Necesario en App Router: evita el desajuste de hidratación.
    immediatelyRender: false,
    extensions: [
      // StarterKit v3 ya incluye Link: agregarlo aparte duplicaría la
      // extensión. Se configura desde aquí.
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        horizontalRule: false,
        link: { openOnClick: false },
      }),
    ],
    content: valorInicial,
    editorProps: {
      attributes: { class: ESTILO_CUERPO },
    },
    onUpdate: ({ editor }) => alCambiar(editor.getHTML()),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) return <div className="min-h-[24rem] rounded-lg border border-borde" />;

  const boton = (activo: boolean) =>
    `px-2 py-1 text-sm rounded ${
      activo ? "bg-verde-antioquia text-white" : "text-texto-secundario"
    }`;

  return (
    <div className="rounded-lg border border-borde">
      <div className="flex flex-wrap gap-1 border-b border-borde p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={boton(editor.isActive("bold"))}
        >
          Negrita
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={boton(editor.isActive("italic"))}
        >
          Cursiva
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={boton(editor.isActive("heading", { level: 2 }))}
        >
          Subtítulo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={boton(editor.isActive("blockquote"))}
        >
          Cita
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={boton(editor.isActive("bulletList"))}
        >
          Lista
        </button>
        <button
          type="button"
          onClick={() => {
            const url = editor.getAttributes("link").href ?? "";
            const nueva = window.prompt("Dirección del enlace", url);
            if (nueva === null) return;
            if (nueva === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: nueva }).run();
          }}
          className={boton(editor.isActive("link"))}
        >
          Enlace
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
