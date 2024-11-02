import React from 'react'
import styles from './AddPeopleConfirm.module.css'

function AddPeopleConfirm({ addedPerson }) {
    return (
        <div className={styles.confirmContainer}>
            <div className={styles.confirmBody}>
                <h3>{addedPerson} added to board</h3>
                <button className={styles.okBtn} onClick={handleAdd}>Okay, got it!</button>
            </div>
        </div>
    )
}

export default DeleteTask