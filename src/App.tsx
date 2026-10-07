import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");

  // Récupération des tâches sauvegardées
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");

    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [filter, setFilter] = useState<Priority | "Tous">("Tous");

  // Sauvegarder les tâches dans localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Ajouter une tâche
  function addTodo() {
    if (input.trim() === "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);

    setInput("");
    setPriority("Moyenne");
  }

  // Filtrer les tâches
  let filteredTodos: Todo[] = [];

  if (filter === "Tous") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter(
      (todo) => todo.priority === filter
    );
  }

  // Compteurs
  const urgentCount = todos.filter(
    (todo) => todo.priority === "Urgente"
  ).length;

  const mediumCount = todos.filter(
    (todo) => todo.priority === "Moyenne"
  ).length;

  const lowCount = todos.filter(
    (todo) => todo.priority === "Basse"
  ).length;

  const totalCount = todos.length;

  // Supprimer une tâche
  function deleteTodo(id: number) {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.id !== id)
    );

    setSelectedTodos((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(id);
      return newSelected;
    });
  }

  // Tâches sélectionnées
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(
    new Set()
  );

  // Sélectionner / désélectionner une tâche
  function toggleSelectedTodo(id: number) {
    setSelectedTodos((prevSelected) => {
      const newSelected = new Set(prevSelected);

      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }

      return newSelected;
    });
  }

  // Supprimer toutes les tâches sélectionnées
  function supperTous() {
    setTodos((prevTodos) =>
      prevTodos.filter(
        (todo) => !selectedTodos.has(todo.id)
      )
    );

    setSelectedTodos(new Set());
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">

        {/* Ajouter une tâche */}
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <select
            className="select w-full"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as Priority)
            }
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          <button
            onClick={addTodo}
            className="btn btn-primary"
          >
            Ajouter
          </button>
        </div>

        {/* Filtres et suppression */}
        <div className="space-y-2 flex-1 h-fit">

          <div className="flex justify-between items-center">

            {/* Boutons de filtre */}
            <div className="flex flex-wrap gap-4">

              <button
                className={`btn btn-soft ${
                  filter === "Tous" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Tous")}
              >
                Tous ({totalCount})
              </button>

              <button
                className={`btn btn-soft ${
                  filter === "Urgente" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Urgente")}
              >
                Urgente ({urgentCount})
              </button>

              <button
                className={`btn btn-soft ${
                  filter === "Moyenne" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Moyenne")}
              >
                Moyenne ({mediumCount})
              </button>

              <button
                className={`btn btn-soft ${
                  filter === "Basse" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Basse")}
              >
                Basse ({lowCount})
              </button>

            </div>

            {/* Supprimer les tâches sélectionnées */}
            <button
              onClick={supperTous}
              className="btn btn-primary"
              disabled={selectedTodos.size === 0}
            >
              Supprimer tout ({selectedTodos.size})
            </button>

          </div>

          {/* Liste des tâches */}
          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">

              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={() => deleteTodo(todo.id)}
                  isSelected={selectedTodos.has(todo.id)}
                  onToggleSelect={toggleSelectedTodo}
                />
              ))}

            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">

              <Construction
                strokeWidth={1}
                className="w-40 h-40 text-red-500"
              />

              <p>Aucune tâche 😒!</p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;