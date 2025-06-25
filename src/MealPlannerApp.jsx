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
    Licores: ["Vino tinto"],
  };

  const categorias = Object.keys(shopping);

  // Determinar el número máximo de elementos por columna
  const maxLength = Math.max(...categorias.map(cat => shopping[cat].length));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meal Planner</h1>
      <table className="table-fixed border-collapse">
        <thead>
          <tr>
            {categorias.map(cat => (
              <th key={cat} className="text-left pr-6 pb-2">{cat}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(maxLength)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              {categorias.map(cat => {
                const item = shopping[cat][rowIdx];
                return (
                  <td key={cat + rowIdx} className="pr-6">
                    {item ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={!!checked[item]}
                          onChange={() => setChecked(c => ({ ...c, [item]: !c[item] }))}
                        />{" "}
                        {item}
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
  );
}
