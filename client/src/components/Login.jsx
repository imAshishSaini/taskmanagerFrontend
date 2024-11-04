import React, { useState, useEffect } from 'react'
import styles from './Login.module.css'
import emailIcon from '../assets/emailIcon.png'
import passwordIcon from '../assets/passwordIcon.png'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'
import {Toaster, toast} from 'react-hot-toast'
import eye from '../assets/eye.png'
import eyeSlash from '../assets/eyeSlash.png'

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const Navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      Navigate('/dashboard')
    }
  }, [Navigate, setIsAuthenticated])
  const handleLogin = async () => {
    try {
      const {data} = await API.post('/api/user/login', {email, password})
      localStorage.setItem('token', data.token)
      toast.success('Login Success')
      setIsAuthenticated(true)
      Navigate('/dashboard')
    } catch (error) {
      console.log(error)
      toast.error('Invalid email or password')
      setError('Invalid email or password')
    }
  }
  return (
    <div className={styles.container}>
      <p className={styles.title}>Login</p>
      <div className={styles.inputWrapper}>
        <img src={emailIcon} className={styles.icon} />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      </div>

      <div className={styles.inputWrapper}>
        <img src={passwordIcon} className={styles.icon} />
        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
          <img src={showPassword ? eyeSlash : eye} alt="Toggle Password Visibility" />
        </span>
      </div>

      <button className={styles.loginBtn} onClick={handleLogin}>Log in</button>
      <p className={styles.noAccount}>Have no account yet?</p>
      <button className={styles.registerBtn} onClick={() => Navigate('/register')}>Register</button>
      <Toaster position="top-right"/>
    </div>
  )
}

export default Login