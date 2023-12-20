const TodoList = () => {
  return (
    <div>
      <ul className='mx-auto'>
        <li className='flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium'>
          ✅ ジム
          <span className='cursor-pointer'>×</span>
        </li>
        <li className='flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium'>
          ✅ 買い物
          <span className='cursor-pointer'>×</span>
        </li>
        <li className='flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium'>
          ✅ 勉強
          <span className='cursor-pointer'>×</span>
        </li>
      </ul>
    </div>
  )
}

export default TodoList