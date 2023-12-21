'use client'

import { useEffect, useState } from "react";
import TodoList from "@/app/components/TodoList";
import { getAllTodos } from "@/app/utils/api";

// 型
export interface TodosType {
  id: number;
  title: string;
}

const TodoApp = () => {
  // useStateでtodosを管理
  const [todos, setTodos] = useState<TodosType[] | null>([]);
 
  // ページ読み込み時に一回だけ発火させたいのでuseEffect
  useEffect(() => {
    const getTodos = async () => {
      const todos = await getAllTodos();
      setTodos(todos);
      console.log(todos);
    };

    // getTodos関数を実行
    getTodos();
  }, []);

  return (
    <section className="text-center mb-2 text-2xl font-medium">
      <h3>Supabase Todo App</h3>
      <form>
        <input type="text" className="shadow-lg p-1 outline-none mr-2" />
        <button className="shadow-md border-2 px-1 py-1 rounded-lg bg-green-200">
          Add
        </button>
      </form>
      <TodoList todos={todos} />
    </section>
  );
};

export default TodoApp;
