import './index.css'

const EachTodo = props => {
  const {todoDetails, onDeleteTodo} = props
  const {todo, id} = todoDetails

  const onCLickDelete = () => {
    onDeleteTodo(id)
  }

  return (
    <li className="each-todo">
      <h1>{todo}</h1>
      <button
        type="button"
        className="delete-todo-button"
        onClick={onCLickDelete}
      >
        delete
      </button>
    </li>
  )
}

export default EachTodo
