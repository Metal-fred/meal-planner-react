import { useState } from "react";
import jsPDF from "jspdf";

export default function MealPlannerApp() {
  /* ----------------------- Datos base ----------------------- */
  const shopping = {
    Verduras: [
      "Lechuga", "Espinacas", "Repollo", "Zanahorias", "Tomates", "Pepino", "Zapallo", "Brócoli", "Papas", "Pimiento", "Cebolla", "Ajo",
    ],
    Frutas: ["Manzanas", "Plátanos", "Peras", "Arándanos"],
    Proteínas: [
      "Huevos", "P. pollo", "Salmón", "Jurel", "P. pavo", "Atún", "Quesillo", "Yogurt",
    ],
    Legumbres: ["Lentejas", "Garbanzos", "Arroz int.", "Quinoa", "Avena tra."],
    Panadería: ["Pan int.", "Pan pita"],
    "Frutos secos": ["Nueces", "Linaza", "Frutos secos"],
    Otros: ["Aceite oliva", "Té verde", "Té de hierbas", "Cúrcuma", "Orégano", "Café"],
    Cárnicos: ["Longaniza", "Posta Rosada"],
    Aseo: [
      "Lavalosa", "Cloro", "Detergente", "Suavizante", "Papel hig.", "Toallas h.", "Toallas li.", "NOVA",
    ],
    Licores: ["Vino tinto"],
  };

  const categorias = Object.keys(shopping);

  /* ----------------------- Estados ----------------------- */
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({});

  /* ----------------------- Helpers ----------------------- */
  const toggleCategory = (cat) => setExpanded((e) => ({ ...e, [cat]: !e[cat] }));
  const clearSelection = () => setChecked({});

  const buildSelectedByCategory = () =>
    categorias
      .map((cat) => {
        const items = shopping[cat].filter((i) => checked[i]);
        return items.length ? `${cat}:\n- ${items.join("\n- ")}` : null;
      })
      .filter(Boolean)
      .join("\n\n");

  const downloadPDF = () => {
    const texto = buildSelectedByCategory();
    if (!texto) return alert("No hay ítems seleccionados");
    const doc = new jsPDF();
    doc.setFontSize(14);
    let y = 20;
    doc.text("Lista de compras", 105, 12, { align: "center" });
    doc.setFontSize(10);
    texto.split("\n").forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(line, 15, y);
      y += 6;
    });
    doc.save("lista_compras.pdf");
  };

  const copySelected = () => {
    const txt = buildSelectedByCategory();
    if (!txt) return alert("No hay ítems seleccionados");
    navigator.clipboard.writeText(txt);
    alert("¡Seleccionados copiados al portapapeles!");
  };

  const downloadTXT = () => {
    const txt = buildSelectedByCategory();
    if (!txt) return alert("No hay ítems seleccionados");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista_compras.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ----------------------- UI ----------------------- */
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800 px-4 pb-10 md:pt-6">
      {/* Título */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center w-full">
        Meal Planner
      </h1>

      {/* Barra de acciones */}
      <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg mb-8">
        <button
          onClick={clearSelection}
          className="action-btn border-indigo-500 text-indigo-600"
        >
          Limpiar selección
        </button>
        <button
          onClick={downloadPDF}
          className="action-btn border-blue-500 text-blue-600"
        >
          Descargar PDF
        </button>
        <button
          onClick={downloadTXT}
          className="action-btn border-emerald-500 text-emerald-600"
        >
          Exportar TXT
        </button>
        <button
          onClick={copySelected}
          className="action-btn border-pink-500 text-pink-600"
        >
          Copiar seleccionados
        </button>
      </div>

      {/* Lista de categorías */}
      <div className="w-full max-w-lg space-y-3">
        {categorias.map((cat) => (
          <div key={cat} className="">
            {/* Encabezado */}
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex justify-between items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md shadow-sm font-semibold"
            >
              <span>{cat}</span>
              <span>{expanded[cat] ? "▲" : "▼"}</span>
            </button>

            {/* Ítems */}
            {expanded[cat] && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 px-4 text-sm">
                {shopping[cat].map((item) => (
                  <li key={item}>
                    <label className="inline-flex items-center gap-1 select-none">
                      <input
                        type="checkbox"
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                        checked={!!checked[item]}
                        onChange={() =>
                          setChecked((c) => ({ ...c, [item]: !c[item] }))
                        }
                      />
                      <span
                        className={checked[item] ? "line-through text-gray-400" : ""}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Estilos utilitarios */}
      <style jsx>{`
        .action-btn {
          @apply bg-white border px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-100 text-sm font-medium transition;
        }
      `}</style>
    </div>
  );
}
