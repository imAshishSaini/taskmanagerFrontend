import React from 'react'
import styles from './Register.module.css'
import emailIcon from '../assets/emailIcon.png'
import passwordIcon from '../assets/passwordIcon.png'
import personIcon from '../assets/personIcon.png'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import eye from '../assets/eye.png'
import eyeSlash from '../assets/eyeSlash.png'

function Register() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rePassword, setRePassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showRePassword, setShowRePassword] = React.useState(false)
  const Navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const { data } = await API.post('/api/user/register', { name, email, password })
      toast.success('Register Success')
      console.log(data)
      Navigate('/login')
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      <p className={styles.title}>Register</p>
      <div className={styles.inputWrapper}>
        <img src={personIcon} className={styles.icon} />
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      </div>

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

      <div className={styles.inputWrapper}>
        <img src={passwordIcon} className={styles.icon} />
        <input type={showRePassword ? 'text' : 'password'} value={rePassword} onChange={e => setRePassword(e.target.value)} placeholder="Confirm Password" />
        <span className={styles.eyeIcon} onClick={() => setShowRePassword(!showRePassword)}>
          <img src={showRePassword ? eyeSlash : eye} alt="Toggle Password Visibility" />
        </span>
      </div>

      <button className={styles.registerBtn} onClick={handleRegister}>Register</button>
      <p className={styles.noAccount}>Have an account ?</p>
      <button className={styles.loginBtn} onClick={() => Navigate('/login')}>Log in</button>
      <Toaster position="top-right" />
    </div>
  )
}

export default Register