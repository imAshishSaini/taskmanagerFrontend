import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { FiLogOut } from 'react-icons/fi'; // Logout icon from react-icons library
import logo from '../assets/logo.png';
import layoutIcon from '../assets/layoutIcon.png';
import analyticsIcon from '../assets/analyticsIcon.png';
import settingIcon from '../assets/settingIcon.png';
import {Toaster} from 'react-hot-toast'

function Sidebar({ setActiveComponent, handleShowLogoutModal }) {
  const [activeItem, setActiveItem] = useState('Board');

  const handleItemClick = (component) => {
    setActiveItem(component)  
    setActiveComponent(component)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img src={logo} className={styles.icon} alt="Logo" />
        <h2>Pro Manage</h2>
      </div>

      <div
        className={`${styles.menuItem} ${activeItem === 'Board' ? styles.active : ''}`}
        onClick={() => handleItemClick('Board')}
      >
        <img src={layoutIcon} className={styles.icon} alt="Board Icon" />
        <h2>Board</h2>
      </div>

      <div
        className={`${styles.menuItem} ${activeItem === 'Analytics' ? styles.active : ''}`}
        onClick={() => handleItemClick('Analytics')}
      >
        <img src={analyticsIcon} className={styles.icon} alt="Analytics Icon" />
        <h2>Analytics</h2>
      </div>

      <div
        className={`${styles.menuItem} ${activeItem === 'Settings' ? styles.active : ''}`}
        onClick={() => handleItemClick('Settings')}
      >
        <img src={settingIcon} className={styles.icon} alt="Settings Icon" />
        <h2>Settings</h2>
      </div>

      <button className={styles.logoutBtn} onClick={handleShowLogoutModal}>
        <FiLogOut className={styles.logoutIcon} /> Log out
      </button>
      <div className={styles.divider}></div>
      <Toaster position="top-right" />
    </div>
  );
}

export default Sidebar;
