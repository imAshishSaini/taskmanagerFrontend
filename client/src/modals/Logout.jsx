import React from 'react'
import styles from './Logout.module.css'

function Logout({ handleLogout, handleCloseLogoutModal }) {
    return (
        <div className={styles.logoutContainer}>
            <div className={styles.logoutBody}>
                <h3>Are you sure you want to Logout?</h3>
                <div className={styles.btnSection}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>Yes, Logout</button>
                    <button className={styles.cancelLogoutBtn} onClick={handleCloseLogoutModal}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Logout