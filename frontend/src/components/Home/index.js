import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'
import Cookie from 'js-cookie'
import Header from '../Header'
import EachTodo from '../EachTodo'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    todoList: [],
    todoName: '',
  }

  componentDidMount() {
    this.displayResults()
  }

  displayResults = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://todoapp-2a8r.onrender.com/todos'
    const response = await fetch(url)
    const data = await response.json()
    this.setState({
      todoList: data,
      apiStatus: apiStatusConstants.success,
    })
  }

  onDeleteTodo = async id => {
    console.log(id)
    const apiUrl = `https://todoapp-2a8r.onrender.com/todos/${id}`

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await this.setState({
      apiStatus: apiStatusConstants.success,
    })
    this.displayResults()
  }

  onAddTodo = async () => {
    this.setState({apiStatus: apiStatusConstants.failure})
    const {todoName} = this.state
    const apiUrl = 'https://todoapp-2a8r.onrender.com/add/'
    const newId = Math.random(Math.random())
    console.log(newId)
    const todoDetails = {
      todo: todoName,
      id: newId,
    }

    if (todoName !== '') {
      await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(todoDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      await this.setState({
        apiStatus: apiStatusConstants.success,
        todoName: '',
      })
      this.displayResults()
    } else {
      alert('Enter a Task')
      this.displayResults()
    }
  }

  onChangeName = event => {
    this.setState({todoName: event.target.value})
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  displaySuccessView = () => {
    const {todoList} = this.state
    console.log(todoList)
    return (
      <ul>
        {todoList.map(eachItem => (
          <EachTodo
            key={eachItem.id}
            todoDetails={eachItem}
            onDeleteTodo={this.onDeleteTodo}
          />
        ))}
      </ul>
    )
  }

  renderFailureView = () => {}

  displayResultView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.displaySuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {todoName, todoList} = this.state
    const token = Cookie.get('jwt_token')
    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div>
        <Header />
        <div className="home-container">
          <div className="add-todo-container">
            <h1 className="create-todo-heading">Create Todo</h1>
            <div>
              <input
                type="text"
                id="username"
                className="username-input-field"
                placeholder="Enter a Task..."
                value={todoName}
                onChange={this.onChangeName}
              />
              <button
                type="button"
                className="add-button"
                onClick={this.onAddTodo}
              >
                Add
              </button>
            </div>
          </div>
          <div className="display-todo-container">
            {todoList.length === 0 ? (
              <div className="no-tasks-container">
                <h1>No Tasks</h1>
              </div>
            ) : (
              <div className="results-container">
                {this.displayResultView()}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Home
