import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showSubmitError: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://todoapp-2a8r.onrender.com/login'

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
      this.onSubmitSuccess(data.jwtToken)
    } else {
      this.onSubmitFailure(data)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/home" />
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
            <h1 className="login-heading">Login</h1>
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
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          <h1 className="login-text">
            Do not Have an account?{' '}
            <span className="span">
              <Link to="/signup">Signup</Link>
            </span>
          </h1>
        </form>
      </div>
    )
  }
}
export default Login
