import { useState, useEffect } from "react";

export default function MealPlannerApp() {
  /* ------------- Datos ------------- */
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

  /* ------------- Estado ------------- */
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({});
  const [showList, setShowList] = useState(false);

  /* ------------- Persistencia ------------- */
  useEffect(() => {
    try {
      const savedChecked = JSON.parse(localStorage.getItem("mp_checked") || "{}");
      const savedExpanded = JSON.parse(localStorage.getItem("mp_expanded") || "{}");
      setChecked(savedChecked);
      setExpanded(savedExpanded);
    } catch (_) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("mp_checked", JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem("mp_expanded", JSON.stringify(expanded));
  }, [expanded]);

  /* ------------- Helpers ------------- */
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

  const copySelected = () => {
    const txt = buildSelectedByCategory();
    if (!txt) return alert("No hay ítems seleccionados");
    navigator.clipboard.writeText(txt);
    alert("¡Seleccionados copiados al portapapeles!");
  };

  /* ------------- UI ------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 pb-10 flex flex-col items-center">
      {/* Wrapper centrado*/}
      <div className="w-full max-w-2xl">
        {/* Título */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-6 mb-6 text-center">
          Meal Planner
        </h1>

        {/* Barra de acciones */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={clearSelection}
            className="action-btn border-indigo-500 text-indigo-600 dark:text-indigo-300"
          >
            Limpiar selección
          </button>
          <button
            onClick={copySelected}
            className="action-btn border-pink-500 text-pink-600 dark:text-pink-300"
          >
            Copiar seleccionados
          </button>
          <button
            onClick={() => setShowList((s) => !s)}
            className="action-btn border-emerald-500 text-emerald-600 dark:text-emerald-300"
          >
            {showList ? "Cerrar mi lista" : "Mi lista"}
          </button>
        </div>

        {/* Lista guardada */}
        {showList && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm">
            {buildSelectedByCategory() || "No hay ítems seleccionados."}
          </div>
        )}

        {/* Categorías */}
        <div className="space-y-3">
          {categorias.map((cat) => (
            <div key={cat}>
              {/* Encabezado acordeón */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex justify-between items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-md shadow-sm font-semibold"
              >
                <span>{cat}</span>
                <span>{expanded[cat] ? "▲" : "▼"}</span>
              </button>

              {/* Lista con fade */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expanded[cat] ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
                }`}
              >
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2 px-4 text-sm">
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
                          className={checked[item] ? "line-through text-gray-400 dark:text-gray-500" : ""}
                        >
                          {item}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Util class */}
      <style jsx>{`
        .action-btn {
          @apply bg-white dark:bg-gray-800 border px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition;
        }
      `}</style>
    </div>
  );
}
