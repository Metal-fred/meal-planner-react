import { useState } from "react";
import jsPDF from "jspdf";

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
    Licores: ["Vino tinto"],
  };

  const categorias = Object.keys(shopping);
  const maxLength = Math.max(...categorias.map(cat => shopping[cat].length));

  const limpiarSeleccion = () => setChecked({});

  const copiarSeleccionados = () => {
    const texto = getResumenPorCategoria(true);
    if (texto) {
      navigator.clipboard.writeText(texto);
      alert("Seleccionados copiados al portapapeles");
    } else {
      alert("No hay ítems seleccionados");
    }
  };

  const descargarPDF = () => {
    const texto = getResumenPorCategoria(true);
    if (!texto) {
      alert("No hay ítems seleccionados");
      return;
    }

    const doc = new jsPDF();
    const lineas = texto.split("\n");

    let y = 20;
    doc.setFontSize(14);
    doc.text("Lista de compras seleccionadas", 15, 15);
    doc.setFontSize(11);

    lineas.forEach(linea => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(linea, 15, y);
      y += 7;
    });

    doc.save("lista_compras.pdf");
  };

  const getResumenPorCategoria = (soloTexto = false) => {
    const resumen = categorias
      .map(cat => {
        const items = shopping[cat].filter(item => checked[item]);
        if (items.length === 0) return null;
        return soloTexto
          ? `${cat}:\n- ${items.join("\n- ")}`
          : (
              <div key={cat} className="mb-2">
                <h3 className="font-semibold text-gray-700">{cat}</h3>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            );
      })
      .filter(Boolean);

    return soloTexto ? resumen.join("\n\n") : resumen;
  };

  return (
    <div className="p-4 max-w-7xl mx-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Meal Planner</h1>

      <div className="mb-4 flex gap-4 flex-wrap">
        <button
          onClick={limpiarSeleccion}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Limpiar selección
        </button>
        <button
          onClick={copiarSeleccionados}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Copiar seleccionados
        </button>
        <button
          onClick={descargarPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Descargar PDF
        </button>
      </div>

      <table className="table-fixed border-collapse mb-6">
        <thead>
          <tr>
            {categorias.map(cat => (
              <th key={cat} className="text-left pr-6 pb-2 text-sm">{cat}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(maxLength)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              {categorias.map(cat => {
                const item = shopping[cat][rowIdx];
                return (
                  <td key={cat + rowIdx} className="pr-6 py-1">
                    {item ? (
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={!!checked[item]}
                          onChange={() =>
                            setChecked(prev => ({ ...prev, [item]: !prev[item] }))
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

      {/* ✅ Resumen visual */}
      {Object.keys(checked).some(key => checked[key]) && (
        <div className="bg-gray-100 border rounded-md p-4">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Resumen seleccionado</h2>
          {getResumenPorCategoria(false)}
        </div>
      )}
    </div>
  );
}
