import { useState } from "react";

export default function MealPlannerApp() {
  const [checked, setChecked] = useState({});

  const shopping = {
    Verduras: ["Lechuga", "Espinacas", "Repollo", "Zanahorias", "Tomates", "Pepino", "Zapallo", "Brócoli", "Papas", "Pimiento", "Cebolla", "Ajo"],
    Frutas: ["Manzanas", "Plátanos", "Peras", "Arándanos"],
    Proteínas: ["Huevos", "P. pollo", "Salmón", "Jurel", "P. pavo", "Atún", "Quesillo", "Yogurt"],
    Legumbres: ["Lentejas", "Garbanzos", "Arroz int.", "Quinoa", "Avena tra."],
    Panadería: ["Pan int.", "Pan pita"],
    "Frutos secos": ["Nueces", "Linaza", "Frutos secos"],
    Otros: ["Aceite oliva", "Té verde", "Té de hierbas", "Cúrcuma", "Orégano", "Café"],
    Cárnicos: ["Longaniza", "Posta Rosada"],
    Aseo: ["Lavalosa", "Cloro", "Detergente", "Suavizante", "Papel hig.", "Toallas h.", "Toallas li.", "NOVA"],
    Licores: ["Vino tinto"]
  };

  const categorias = Object.keys(shopping);
  const maxLength = Math.max(...categorias.map(cat => shopping[cat].length));

  const clearSelection = () => setChecked({});
  const copySelected = () => {
    const selectedItems = Object.entries(checked)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(", ");
    navigator.clipboard.writeText(selectedItems);
  };

  const downloadPDF = () => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      let y = 10;
      categorias.forEach(cat => {
        doc.text(cat, 10, y);
        y += 6;
        shopping[cat].forEach(item => {
          if (checked[item]) {
            doc.text("• " + item, 14, y);
            y += 6;
          }
        });
        y += 4;
      });
      doc.save("lista-supermercado.pdf");
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Meal Planner</h1>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={clearSelection}
          className="bg-white border border-gray-400 px-4 py-1 rounded shadow hover:bg-gray-100"
        >
          Limpiar selección
        </button>
        <button
          onClick={copySelected}
          className="bg-white border border-gray-400 px-4 py-1 rounded shadow hover:bg-gray-100"
        >
          Copiar seleccionados
        </button>
        <button
          onClick={downloadPDF}
          className="bg-white border border-gray-400 px-4 py-1 rounded shadow hover:bg-gray-100"
        >
          Descargar PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-fixed border-collapse w-full text-sm">
          <thead>
            <tr>
              {categorias.map(cat => (
                <th key={cat} className="text-left pr-4 pb-2 align-top whitespace-nowrap">
                  {cat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(maxLength)].map((_, rowIdx) => (
              <tr key={rowIdx}>
                {categorias.map(cat => {
                  const item = shopping[cat][rowIdx];
                  return (
                    <td key={cat + rowIdx} className="pr-4 py-1 align-top whitespace-nowrap">
                      {item ? (
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={!!checked[item]}
                            onChange={() =>
                              setChecked(c => ({ ...c, [item]: !c[item] }))
                            }
                          />
                          <span className={checked[item] ? "line-through text-gray-400" : ""}>
                            {item}
                          </span>
                        </label>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
