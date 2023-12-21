import { TodosType } from "@/app/components/TodoApp";
import { deleteTodo, getAllTodos } from "@/app/utils/api";
import React from "react";

interface TodoListProps {
  todos: TodosType[] | null;
  setTodos: React.Dispatch<React.SetStateAction<TodosType[] | null>>;
}

const TodoList = ({ todos, setTodos }: TodoListProps) => {
  // 削除した後、再レンダリングをするためにsetTodosを受け取る

  // 削除ボタンが押された時の処理
  const handelDelete = async (id: number) => {
    await deleteTodo(id);

    const todos = await getAllTodos();
    setTodos(todos);
  };
  return (
    <div>
      <ul className="mx-auto">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium"
          >
            ✅ {todo.title}
            <span
              className="cursor-pointer"
              // 削除ボタンが押された時にidを引数にしてhandelDelete関数を実行
              onClick={() => handelDelete(todo.id)}
            >
              ×
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
