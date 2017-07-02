const mapTodos = (state, id, prop) => ({
  todos: state.todos.map(
    todo => (id === todo.id ? Object.assign({}, todo, prop) : todo)
  )
})

let counter = 0

export default {
  add: state => ({
    input: "",
    todos: state.todos.concat({
      completed: false,
      editing: false,
      value: state.input,
      id: ++counter
    })
  }),

  toggle: (state, actions, { id, value }) =>
    mapTodos(state, id, { completed: !value }),

  edit: (state, actions, { id, value }) =>
    mapTodos(state, id, { editing: value }),

  updateValue: (state, actions, { id, value }) => mapTodos(state, id, { value }),

  change: (state, actions, { value }) => ({ input: value }),

  setFilter: (state, actions, { value }) => ({ filter: value }),

  remove: (state, actions, { id }) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  }),

  clear: state => ({
    todos: state.todos.filter(todo => !todo.completed)
  }),

  toggleAll: state => ({
    todos: state.todos.map(todo =>
      Object.assign({}, todo, { completed: !todo.completed })
    )
  })
}
