import { useState } from "react";

export default function MealPlannerApp() {
  const [checked, setChecked] = useState({});

  const shopping = {
    Verduras: [
      "Lechuga", "Espinacas", "Repollo", "Zanahorias", "Tomates",
      "Pepino", "Zapallo", "Brócoli", "Papas", "Pimiento", "Cebolla", "Ajo"
    ],
    Frutas: ["Manzanas", "Plátanos", "Peras", "Arándanos"],
    Proteínas: [
      "Huevos", "P. pollo", "Salmón", "Jurel", "P. pavo",
      "Atún", "Quesillo", "Yogurt"
    ],
    Legumbres: ["Lentejas", "Garbanzos", "Arroz int.", "Quinoa", "Avena tra."],
    Panadería: ["Pan int.", "Pan pita"],
    "Frutos secos": ["Nueces", "Linaza", "Frutos secos"],
    Otros: ["Aceite oliva", "Té verde", "Té de hierbas", "Cúrcuma", "Orégano", "Café"],
    Cárnicos: ["Longaniza", "Posta Rosada"],
    Aseo: [
      "Lavalosa", "Cloro", "Detergente", "Suavizante",
      "Papel hig.", "Toallas h.", "Toallas li.", "NOVA"
    ],
    Licores: ["Vino tinto"],
  };

  const categorias = Object.keys(shopping);
  const maxLength = Math.max(...categorias.map(cat => shopping[cat].length));

  const handleClear = () => setChecked({});
  const handleCopy = () => {
    const seleccionados = Object.entries(checked)
      .filter(([_, val]) => val)
      .map(([item]) => item)
      .join(", ");
    navigator.clipboard.writeText(seleccionados);
    alert("Ítems copiados: " + seleccionados);
  };

  const handleDownloadPDF = () => {
    window.print(); // Para versión simple como PDF desde navegador
  };

  return (
    <div className="p-4 max-w-7xl mx-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Meal Planner</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <button onClick={handleClear} className="border px-4 py-1 rounded">Limpiar selección</button>
        <button onClick={handleCopy} className="border px-4 py-1 rounded">Copiar seleccionados</button>
        <button onClick={handleDownloadPDF} className="border px-4 py-1 rounded">Descargar PDF</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-fixed border-collapse w-full md:w-auto">
          <thead>
            <tr>
              {categorias.map(cat => (
                <th key={cat} className="text-left px-2 pb-2">{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(maxLength)].map((_, rowIdx) => (
              <tr key={rowIdx}>
                {categorias.map(cat => {
                  const item = shopping[cat][rowIdx];
                  return (
                    <td key={cat + rowIdx} className="px-2 py-1 align-top">
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
