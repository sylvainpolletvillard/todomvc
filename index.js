import { h, app, Router } from "hyperapp"

import actions from "./actions"

const FilterInfo = {
  All: "all",
  Active: "active",
  Completed: "completed"
}

const TodoCountView = ({ count }) =>
  <span class="todo-count">
    {count > 0
      ? <span><strong>{count}</strong> items left</span>
      : <span>No items left</span>}
  </span>

const RemoveButton = ({ id, remove }) =>
  <button class="destroy" onclick={() => remove({ id })} />

const TodoEditInput = ({ edit, updateValue, todo }) =>
  <input
    class="edit"
    onblur={e =>
      e.target.value.length > 0
        ? edit({ value: false, id: todo.id })
        : ""}
    onkeydown={e =>
      e.target.value.length > 0 && e.keyCode === 13
        ? edit({ value: false, id: todo.id })
        : ""}
    oninput={e =>
      e.target.value.length > 0
        ? updateValue({ value: e.target.value, id: todo.id })
        : ""}
    value={todo.value}
  />

const HeaderSection = ({ input, placeholder, add, change }) =>
  <header class="header">
    <h1>Todos</h1>
    <input
      class="new-todo"
      type="text"
      onkeyup={e => (e.keyCode === 13 && input.length > 0 ? add() : "")}
      oninput={e => change({ value: e.target.value })}
      value={input}
      placeholder={placeholder}
      autofocus
    />
  </header>

const FilterItem = ({
  filter,
  setFilter,
  slug,
  go,
  key,
  currentFilter
}) =>
  <li>
    <button
      class={
        (filter === FilterInfo.All && filter === currentFilter) ||
          slug === currentFilter
          ? "selected"
          : ""
      }
      onclick={_ => {
        go(
          "/" + (currentFilter === FilterInfo.All ? "" : currentFilter)
        )
        setFilter({ value: currentFilter })
      }}
    >
      {key}
    </button>
    {" "}
  </li>

const ClearButton = ({ clear }) =>
  <button class="clear-completed" onclick={clear}>
    Clear completed
  </button>

const FooterSection = ({ todos, filter, setFilter, clear, go, slug }) =>
  <footer class="footer">
    <TodoCountView
      count={todos.filter(todo => !todo.completed).length}
    />

    <ul class="filters">
      {Object.keys(FilterInfo).map(key =>
        <FilterItem
          filter={filter}
          setFilter={setFilter}
          slug={slug}
          go={go}
          key={key}
          currentFilter={FilterInfo[key]}
        />
      )}
    </ul>

    {todos.filter(todo => todo.completed).length > 0
      ? <ClearButton clear={clear} />
      : ""}
  </footer>

const AboutSection = () =>
  <footer class="info">
    <p>
      Created with
      {" "}<a href="https://github.com/hyperapp/hyperapp">HyperApp</a>
    </p>
    <p>Based on <a href="http://todomvc.com">TodoMVC</a></p>
    <p class="special">
      <a href="https://gomix.com/#!/project/hyperapp-todomvc">
        Source Code
      </a>
    </p>
  </footer>

const TodoItem = ({ toggle, edit, remove, updateValue, todo }) =>
  <li
    class={["completed", "editing"].filter(key => todo[key]).join(" ")}
  >
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        onclick={e => toggle({ value: todo.completed, id: todo.id })}
        checked={todo.completed}
      />

      <label ondblclick={() => edit({ value: true, id: todo.id })}>
        {todo.value}
      </label>

      <RemoveButton remove={remove} id={todo.id} />

    </div>

    <TodoEditInput edit={edit} updateValue={updateValue} todo={todo} />

  </li>

const ToggleAllBox = ({ toggleAll }) =>
  <input class="toggle-all" type="checkbox" onclick={toggleAll} />

const TodoSection = ({
  todos,
  filter,
  slug,
  toggleAll,
  toggle,
  edit,
  remove,
  updateValue
}) =>
  <section class="main">
    <ToggleAllBox toggleAll={toggleAll} />

    <ul class="todo-list">
      {todos
        .filter(
          todo =>
            filter === FilterInfo.Completed &&
              slug === FilterInfo.Completed
              ? todo.completed
              : filter === FilterInfo.Active &&
                  slug === FilterInfo.Active
                ? !todo.completed
                : (filter === FilterInfo.All && slug === undefined) ||
                    slug === FilterInfo.All
        )
        .map(todo =>
          <TodoItem
            toggle={toggle}
            edit={edit}
            remove={remove}
            updateValue={updateValue}
            todo={todo}
          />
        )}
    </ul>
  </section>

const TodoApp = ({ state, actions, slug }) =>
  <main>
    <section class="todoapp">

      <HeaderSection
        input={state.input}
        placeholder={state.placeholder}
        add={actions.add}
        change={actions.change}
      />

      <TodoSection
        todos={state.todos}
        filter={state.filter}
        slug={slug}
        toggleAll={actions.toggleAll}
        toggle={actions.toggle}
        edit={actions.edit}
        remove={actions.remove}
        updateValue={actions.updateValue}
      />

      <FooterSection
        todos={state.todos}
        filter={state.filter}
        setFilter={actions.setFilter}
        clear={actions.clear}
        go={actions.router.go}
        slug={slug}
      />
    </section>

    <AboutSection />

  </main>

app({
  state: {
    todos: [],
    filter: FilterInfo.All,
    input: "",
    placeholder: "What needs to be done?"
  },
  actions,
  view: [
    [
      "/",
      (state, actions) =>
        <TodoApp
          state={state}
          actions={actions}
          slug={state.router.params.slug}
        />
    ],
    [
      "/:slug",
      (state, actions) =>
        <TodoApp
          state={state}
          actions={actions}
          slug={state.router.params.slug}
        />
    ]
  ],
  mixins: [Router]
})
