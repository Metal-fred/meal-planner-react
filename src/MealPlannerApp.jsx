import { useState } from "react";
import jsPDF from "jspdf";

export default function MealPlannerApp() {
  /* ------------------ Datos ------------------ */
  const shopping = {
    Verduras: [
      "Lechuga", "Espinacas", "Repollo", "Zanahorias", "Tomates", "Pepino",
      "Zapallo", "Brócoli", "Papas", "Pimiento", "Cebolla", "Ajo",
    ],
    Frutas: ["Manzanas", "Plátanos", "Peras", "Arándanos"],
    Proteínas: [
      "Huevos", "P. pollo", "Salmón", "Jurel", "P. pavo", "Atún", "Quesillo", "Yogurt",
    ],
    Legumbres: ["Lentejas", "Garbanzos", "Arroz int.", "Quinoa", "Avena tra."],
    Panadería: ["Pan int.", "Pan pita"],
    "Frutos secos": ["Nueces", "Linaza", "Frutos secos"],
    Otros: [
      "Aceite oliva", "Té verde", "Té de hierbas", "Cúrcuma", "Orégano", "Café",
    ],
    Cárnicos: ["Longaniza", "Posta Rosada"],
    Aseo: [
      "Lavalosa", "Cloro", "Detergente", "Suavizante", "Papel hig.", "Toallas h.",
      "Toallas li.", "NOVA",
    ],
    Licores: ["Vino tinto"],
  };

  const categorias = Object.keys(shopping);

  /* -------------- Estados -------------- */
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({});

  /* -------------- Acciones -------------- */
  const toggleCategory = (cat) =>
    setExpanded((e) => ({ ...e, [cat]: !e[cat] }));

  const clearSelection = () => setChecked({});

  const buildSelectedByCategory = () =>
    categorias
      .map((cat) => {
        const items = shopping[cat].filter((i) => checked[i]);
        if (!items.length) return null;
        return `${cat}:\n- ${items.join("\n- ")}`;
      })
      .filter(Boolean)
      .join("\n\n");

  const downloadPDF = () => {
    const texto = buildSelectedByCategory();
    if (!texto) return alert("No hay ítems seleccionados");

    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text("Lista de compras", 15, 15);
    doc.setFontSize(11);
    texto.split("\n").forEach((linea) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(linea, 15, y);
      y += 6;
    });
    doc.save("lista_compras.pdf");
  };

  const downloadTXT = () => {
    const texto = buildSelectedByCategory();
    if (!texto) return alert("No hay ítems seleccionados");
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista_compras.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* -------------- UI -------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 max-w-md mx-auto">
      {/* Título */}
      <h1 className="text-4xl font-extrabold mb-6 text-center">Meal Planner</h1>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 w-full">
        <button
          onClick={clearSelection}
          className="flex-1 bg-gray-800 border border-gray-600 px-4 py-2 rounded text-blue-400 hover:bg-gray-700"
        >
          Limpiar selección
        </button>
        <button
          onClick={downloadPDF}
          className="flex-1 bg-gray-800 border border-gray-600 px-4 py-2 rounded text-blue-400 hover:bg-gray-700"
        >
          Descargar PDF
        </button>
        <button
          onClick={downloadTXT}
          className="flex-1 bg-gray-800 border border-gray-600 px-4 py-2 rounded text-blue-400 hover:bg-gray-700"
        >
          Exportar TXT
        </button>
      </div>

      {/* Categorías */}
      {categorias.map((cat) => (
        <div key={cat} className="mb-3">
          {/* Encabezado tipo acordeón */}
          <button
            onClick={() => toggleCategory(cat)}
            className="w-full flex justify-between items-center bg-gray-800 px-4 py-2 rounded text-blue-400 font-semibold"
          >
            <span>{cat}</span>
            <span>{expanded[cat] ? "▲" : "▼"}</span>
          </button>

          {/* Lista de ítems */}
          {expanded[cat] && (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 px-4 text-sm">
              {shopping[cat].map((item) => (
                <li key={item}>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="text-blue-400 bg-gray-700 border-gray-600 rounded"
                      checked={!!checked[item]}
                      onChange={() =>
                        setChecked((c) => ({ ...c, [item]: !c[item] }))
                      }
                    />
                    <span
                      className={checked[item] ? "line-through text-gray-500" : ""}
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
  );
}
