import React from 'react'
import styles from './Header.module.css'
import {Toaster} from 'react-hot-toast'

const addSuffixToDate = (day) => {
  if(day > 3 && day < 21) return `${day}th`
  switch (day % 10) {
    case 1: return `${day}st`
    case 2: return `${day}nd`
    case 3: return `${day}rd`
    default: return `${day}th`
  }
}

function Header() {
  const today = new Date()
  const todayDate = `${addSuffixToDate(today.getDate())} ${today.toLocaleString('en-US', {month: 'short'})}, ${today.getFullYear()}`
  return (
    <div className={styles.headContainer}>
      <div className={styles.head}>
        <h1>Welcome! Kumar</h1>
      </div>
      <div className={styles.date}>{todayDate}</div>
      <Toaster position="top-right"/>
    </div>
  )
}

export default Header