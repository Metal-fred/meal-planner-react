import { useState } from "react";
import jsPDF from "jspdf";

export default function MealPlannerApp() {
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({});

  const shopping = {
    Verduras: [
      "Lechuga",
      "Espinacas",
      "Repollo",
      "Zanahorias",
      "Tomates",
      "Pepino",
      "Zapallo",
      "Brócoli",
      "Papas",
      "Pimiento",
      "Cebolla",
      "Ajo",
    ],
    Frutas: ["Manzanas", "Plátanos", "Peras", "Arándanos"],
    Proteínas: [
      "Huevos",
      "P. pollo",
      "Salmón",
      "Jurel",
      "P. pavo",
      "Atún",
      "Quesillo",
      "Yogurt",
    ],
    Legumbres: ["Lentejas", "Garbanzos", "Arroz int.", "Quinoa", "Avena tra."],
    Panadería: ["Pan int.", "Pan pita"],
    "Frutos secos": ["Nueces", "Linaza", "Frutos secos"],
    Otros: [
      "Aceite oliva",
      "Té verde",
      "Té de hierbas",
      "Cúrcuma",
      "Orégano",
      "Café",
    ],
    Cárnicos: ["Longaniza", "Posta Rosada"],
    Aseo: [
      "Lavalosa",
      "Cloro",
      "Detergente",
      "Suavizante",
      "Papel hig.",
      "Toallas h.",
      "Toallas li.",
      "NOVA",
    ],
    Licores: ["Vino tinto"],
  };

  const categorias = Object.keys(shopping);

  const clearSelection = () => setChecked({});

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.text("Lista de compras seleccionadas", 15, 15);
    doc.setFontSize(11);

    categorias.forEach((cat) => {
      const items = shopping[cat].filter((i) => checked[i]);
      if (items.length === 0) return;
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(cat + ":", 15, y);
      y += 6;
      items.forEach((it) => {
        doc.text("• " + it, 20, y);
        y += 6;
      });
      y += 4;
    });

    doc.save("lista_compras.pdf");
  };

  const toggleCategory = (cat) =>
    setExpanded((e) => ({ ...e, [cat]: !e[cat] }));

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Meal Planner</h1>

      <div className="flex justify-center gap-3 flex-wrap mb-6">
        <button
          onClick={clearSelection}
          className="bg-white border border-gray-400 px-4 py-1 rounded shadow hover:bg-gray-100"
        >
          Limpiar selección
        </button>
        <button
          onClick={downloadPDF}
          className="bg-white border border-gray-400 px-4 py-1 rounded shadow hover:bg-gray-100"
        >
          Descargar PDF
        </button>
      </div>

      {/* Listado por categoría */}
      {categorias.map((cat) => (
        <div key={cat} className="mb-4">
          <button
            onClick={() => toggleCategory(cat)}
            className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
          >
            <span className="font-semibold text-gray-800">{cat}</span>
            <span className="text-gray-600">{expanded[cat] ? "▲" : "▼"}</span>
          </button>

          {expanded[cat] && (
            <ul className="pl-6 pt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
              {shopping[cat].map((item) => (
                <li key={item} className="">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!checked[item]}
                      onChange={() =>
                        setChecked((c) => ({ ...c, [item]: !c[item] }))
                      }
                    />
                    <span
                      className={
                        checked[item] ? "line-through text-gray-400" : ""
                      }
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
