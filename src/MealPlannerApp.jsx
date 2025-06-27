import { useState, useEffect } from "react";

/**
 * Meal‑Planner (versión completa)
 * - Responsive (centro en desktop, 100 % en móvil)
 * - Tema claro/oscuro automático (prefers‑color‑scheme)
 * - Acordeones por categoría
 * - Recordatorio de ítems seleccionados (localStorage)
 * - Botones: Limpiar, Copiar seleccionados y "Mi lista" (con texto listo para pegar)
 */
export default function MealPlannerApp() {
  /* ------------------------ Datos ------------------------ */
  const shopping = {
    Verduras: [
      "Lechuga","Espinacas","Repollo","Zanahorias","Tomates","Pepino","Zapallo","Brócoli","Papas","Pimiento","Cebolla","Ajo",
    ],
    Frutas: ["Manzanas","Plátanos","Peras","Arándanos"],
    Proteínas: ["Huevos","P. pollo","Salmón","Jurel","P. pavo","Atún","Quesillo","Yogurt"],
    Legumbres: ["Lentejas","Garbanzos","Arroz int.","Quinoa","Avena tra."],
    Panadería: ["Pan int.","Pan pita"],
    "Frutos secos": ["Nueces","Linaza","Frutos secos"],
    Otros: ["Aceite oliva","Té verde","Té de hierbas","Cúrcuma","Orégano","Café"],
    Cárnicos: ["Longaniza","Posta Rosada"],
    Aseo: ["Lavalosa","Cloro","Detergente","Suavizante","Papel hig.","Toallas h.","Toallas li.","NOVA"],
    Licores: ["Vino tinto"],
  };
  const categorias = Object.keys(shopping);

  /* ------------------ Estado / Persistencia ------------------ */
  const [checked,   setChecked]   = useState({});
  const [expanded,  setExpanded]  = useState({});
  const [showList,  setShowList]  = useState(false);
  useEffect(() => {
    try {
      setChecked(JSON.parse(localStorage.getItem("mp_checked") || "{}"));
      setExpanded(JSON.parse(localStorage.getItem("mp_expanded") || "{}"));
    } catch (_) {}
  }, []);
  useEffect(() => localStorage.setItem("mp_checked", JSON.stringify(checked)),  [checked]);
  useEffect(() => localStorage.setItem("mp_expanded", JSON.stringify(expanded)), [expanded]);

  /* ------------------------ Utils ------------------------ */
  const toggleCat   = (c)   => setExpanded((e) => ({ ...e, [c]: !e[c] }));
  const toggleItem  = (i)   => setChecked ((c) => ({ ...c, [i]: !c[i] }));
  const clearAll    = ()    => setChecked({});
  const copySel     = ()    => {
    const txt = categorias
      .map((c) => {
        const items = shopping[c].filter((i) => checked[i]);
        return items.length ? `${c}:\n- ${items.join("\n- ")}` : null;
      })
      .filter(Boolean)
      .join("\n\n");
    if (!txt) return alert("No hay ítems seleccionados");
    navigator.clipboard.writeText(txt);
    alert("¡Seleccionados copiados!");
  };

  /* ------------------------ UI ------------------------ */
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center">
      <div className="w-full max-w-xl sm:max-w-2xl mx-auto">
        {/* Título */}
        <h1 className="text-4xl font-extrabold mb-8 text-center">Meal Planner</h1>

        {/* Barra de acciones */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <ActionButton onClick={clearAll}       color="indigo">Limpiar selección</ActionButton>
          <ActionButton onClick={copySel}        color="emerald">Copiar seleccionados</ActionButton>
          <ActionButton onClick={() => setShowList((s) => !s)} color="pink">
            {showList ? "Cerrar lista" : "Mi lista"}
          </ActionButton>
        </div>

        {/* Panel "Mi lista" */}
        {showList && (
          <pre className="whitespace-pre-wrap mb-8 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm overflow-auto">
            {categorias
              .map((c) => {
                const items = shopping[c].filter((i) => checked[i]);
                return items.length ? `${c}:\n- ${items.join("\n- ")}` : null;
              })
              .filter(Boolean)
              .join("\n\n") || "No hay ítems seleccionados."}
          </pre>
        )}

        {/* Categorías */}
        <div className="space-y-4">
          {categorias.map((cat) => (
            <section key={cat}>
              <button
                className="w-full flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium"
                onClick={() => toggleCat(cat)}
              >
                <span>{cat}</span>
                <span className={`transition-transform ${expanded[cat] ? "rotate-180" : "rotate-0"}`}>▼</span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expanded[cat] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-4 mt-3 px-4 text-sm">
                  {shopping[cat].map((item) => (
                    <li key={item}>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                          checked={!!checked[item]}
                          onChange={() => toggleItem(item)}
                        />
                        <span className={checked[item] ? "line-through text-gray-400 dark:text-gray-500" : ""}>{item}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ---------- Botón reutilizable ---------- */
function ActionButton({ children, onClick, color }) {
  const base = "border px-4 py-1.5 rounded-md shadow text-sm font-medium transition";
  const light = `bg-white hover:bg-gray-100 border-${color}-500 text-${color}-600`;
  const dark  = `dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-${color}-300`;
  return (
    <button onClick={onClick} className={`${base} ${light} ${dark}`}>{children}</button>
  );
}
