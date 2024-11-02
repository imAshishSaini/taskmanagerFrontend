import React from 'react'
import styles from './DeleteTask.module.css'

function DeleteTask({onConfirm, onCancel}) {
  return (
    <div className={styles.deleteContainer}>
            <div className={styles.deleteBody}>
                <h3>Are you sure you want to Delete?</h3>
                <div className={styles.btnSection}>
                    <button className={styles.deleteBtn} onClick={onConfirm}>Yes, Delete</button>
                    <button className={styles.cancelDeleteBtn} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
  )
}

export default DeleteTask