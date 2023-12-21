"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import TodoList from "@/app/components/TodoList";
import { addTodo, getAllTodos } from "@/app/utils/api";

// 型
export interface TodosType {
  id: number;
  title: string;
}

const TodoApp = () => {
  // useStateでtodosを管理
  const [todos, setTodos] = useState<TodosType[] | null>([]);
  // useStateでtitleを管理
  const [title, setTitle] = useState<string>("");

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

  // フォームの入力値をtitleにセット
  // MouseEvent<HTMLButtonElement>はボタンがクリックされた時のイベントの型
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    // デフォルトのイベントをキャンセル（ページのリロードを防ぐ）
    e.preventDefault();

    // titleが空の場合は処理を中断
    if (!title) return;

    // addTodo関数を実行
    await addTodo(title);

    // これがないと、追加したtodoがブラウザに反映されない
    let newTodos = await getAllTodos();
    setTodos(newTodos);

    // titleを空にする
    setTitle("");
  };

  return (
    <section className="text-center mb-2 text-2xl font-medium">
      <h3>Supabase Todo App</h3>
      <form>
        <input
          type="text"
          className="shadow-lg p-1 outline-none mr-2"
          // inputが変更されるたびにtitleを更新
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <button
          className="shadow-md border-2 px-1 py-1 rounded-lg bg-green-200"
          // onClickでhandleSubmitを発火させる
          onClick={(e) => handleSubmit(e)}
        >
          Add
        </button>
      </form>
      <TodoList todos={todos} setTodos={setTodos} />
    </section>
  );
};

export default TodoApp;
