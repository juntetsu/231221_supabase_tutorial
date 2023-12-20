import TodoList from '@/app/components/TodoList'

const TodoApp = () => {
  return (
    <section className='text-center mb-2 text-2xl font-medium'>
      <h3>Supabase Todo App</h3>
      <form>
        <input type="text" className='shadow-lg p-1 outline-none mr-2' />
        <button className='shadow-md border-2 px-1 py-1 rounded-lg bg-green-200'>Add</button>
      </form>
      <TodoList />
    </section>
  )
}

export default TodoApp