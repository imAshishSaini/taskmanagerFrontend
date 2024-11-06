import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Board from './Board'
import Analytics from './Analytics'
import Settings from './Settings'
import styles from './Dashboard.module.css'
import { Toaster } from 'react-hot-toast'
import Logout from '../modals/Logout'

function Dashboard({ handleLogout }) {
  const [activeComponent, setActiveComponent] = useState('Board')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Board':
        return <Board />
      case 'Analytics':
        return <Analytics />
      case 'Settings':
        return <Settings handleLogout={handleLogout} />
      default:
        return <Board />
    }
  }

  const handleShowLogoutModal = () => {
    setShowLogoutModal(true)
  }

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Sidebar setActiveComponent={setActiveComponent} handleShowLogoutModal={handleShowLogoutModal} />
      </div>
      <div className={styles.right}>
        {activeComponent === 'Board' && <Header />}
        <div >{renderComponent()}</div>
      </div>
      {showLogoutModal && (
        <Logout
          handleLogout={handleLogout}
          handleCloseLogoutModal={handleCloseLogoutModal}
        />
      )}
      <Toaster position="top-right" />
    </div>
  )
}

export default Dashboard
