import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Check,
    X,
} from "lucide-react";
import { getFromLocalStorage, saveToLocalStorage } from "../../utils/localStorage";

export default function Todo() {
    const [todos, setTodos] = useState(() => {
        const data = getFromLocalStorage("todos");
        return data ? JSON.parse(data) : [];
    });

    const [newTodo, setNewTodo] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    useEffect(() => {
        saveToLocalStorage('todos',  JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (!newTodo.trim()) return;

        setTodos([...todos, newTodo.trim()]);
        setNewTodo("");
    };

    const deleteTodo = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    const startEdit = (index) => {
        setEditingIndex(index);
        setEditingValue(todos[index]);
    };

    const saveEdit = () => {
        if (!editingValue.trim()) return;

        const updated = [...todos];
        updated[editingIndex] = editingValue.trim();

        setTodos(updated);
        setEditingIndex(null);
        setEditingValue("");
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditingValue("");
    };

    return (
        <div className="w-full rounded-xl shadow-sm">
            {/* Add Todo */}
            <div className="flex gap-2 mb-6 ">
                <input
                    type="text"
                    placeholder="Add a new todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 min-w-2 text-slate-200 outline-none transition"
                />

                <button
                    onClick={addTodo}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    Add
                </button>
            </div>

            {/* Todo List */}
            <div className="space-y-3">
                {todos.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No todos yet.
                    </div>
                )}

                {todos.map((todo, index) => (
                    <div
                        key={index +todo.slice(0,2)}
                        className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 gap-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition"
                    >
                        {editingIndex === index ? (
                            <input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none"
                            />
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 text-sm font-semibold w-6">
                                    {index + 1}.
                                </span>

                                <span className="text-slate-200">{todo}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {editingIndex === index ? (
                                <>
                                    <button
                                        onClick={saveEdit}
                                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition"
                                    >
                                        <Check size={18} className="text-white" />
                                    </button>

                                    <button
                                        onClick={cancelEdit}
                                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                                    >
                                        <X size={18} className="text-white" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => startEdit(index)}
                                        className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => deleteTodo(index)}
                                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}