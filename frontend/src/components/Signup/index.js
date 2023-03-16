import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Signup extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = () => {
    const {history} = this.props
    history.replace('/login')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showSubmitError: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const apiUrl = 'https://todoapp-2a8r.onrender.com/users'

    if (username !== '' && password !== '') {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(userDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      console.log(data)
      if (response.ok === true) {
        this.onSubmitSuccess()
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } else if (username === '') {
      this.setState({errorMsg: 'Enter Username', showSubmitError: true})
    } else if (password === '') {
      this.setState({errorMsg: 'Enter Password', showSubmitError: true})
    } else if (password.length < 6) {
      this.setState({
        errorMsg: 'Enter A Strong Password',
        showSubmitError: true,
      })
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <div>
            <img
              src="https://ps.w.org/dashboard-to-do-list/assets/icon-256x256.jpg"
              className="login-website-logo"
              alt="website logo"
            />
            <h1 className="login-heading">Signup</h1>
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              value={username}
              className="username-input-field"
              onChange={this.onChangeUsername}
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="password-input-field"
              onChange={this.onChangePassword}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="login-button">
            Signup
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          <h1 className="login-text">
            Already Have an account?
            <span className="span">
              <Link to="/login">Login</Link>
            </span>
          </h1>
        </form>
      </div>
    )
  }
}
export default Signup
