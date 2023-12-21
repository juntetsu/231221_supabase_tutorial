import { TodosType } from "@/app/components/TodoApp";

interface TodoListProps {
  todos: TodosType[] | null;
}

const TodoList = ({ todos }: TodoListProps) => {
  return (
    <div>
      <ul className="mx-auto">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium"
          >
            ✅ {todo.title}
            <span className="cursor-pointer">×</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
