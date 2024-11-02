import React, { useState } from 'react'
import styles from './AddPeople.module.css'

function AddPeople({ assignedPerson, onAddPerson, onRemovePerson, onCancel }) {
    const [email, setEmail] = useState('')

    const handleAdd = () => {
        if (email) {
            onAddPerson(email)
            setEmail('')
        }
    }

    return (
        <div className={styles.addContainer}>
            <div className={styles.addBody}>
                <h3>{assignedPerson ? '' : 'Add people to the board'}</h3>
                {!assignedPerson ? (
                    <>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter the email"
                        />
                        <div className={styles.addBtnSection}>
                            <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
                            <button onClick={handleAdd}>Add Email</button>
                        </div>
                    </>
                ) : (
                    <div className={styles.removeBtnSection}>
                        <h3>{assignedPerson} Remove people from board</h3>
                        <button onClick={onRemovePerson}>Remove</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddPeople