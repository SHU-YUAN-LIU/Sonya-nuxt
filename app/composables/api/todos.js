export const useTodosApi = () => {
  const { GET, POST, PUT, DELETE } = useApi()
  return {
    getTodos: () => GET('/api/todos'),
    addTodo: (data) => POST('/api/todos', data),
    editTodo: (id, data) => PUT(`/api/todos/${id}`, data),
    deleteTodo: (id) => DELETE(`/api/todos/${id}`)
  }
}
