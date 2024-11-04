import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api'
import styles from './PublicPage.module.css'

function PublicPage() {
    const { shareId } = useParams()
    const [task, setTask] = useState(null)

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await API.get(`/api/task/public/${shareId}`)
                setTask(response.data.task)
            } catch (error) {
                console.error('Failed to fetch task:', error)
            }
        }

        fetchTask()
    }, [shareId])

    if (!task) {
        return <p>Loading...</p>
    }
    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <div className={styles.prioritySection}>
                    <span className={`${styles.priorityIndicator} ${task.priority.toUpperCase() === 'HIGH' ? styles.highPriority : task.priority.toUpperCase() === 'MODERATE' ? styles.moderatePriority : styles.lowPriority}`}></span>
                    <span className={styles.priority}>{task.priority.toUpperCase()} PRIORITY</span>
                </div>
            </div>
            <div className={styles.header}>
                <h2 title={task.title}>{task.title}</h2>
            </div>
            <div className={styles.checklistSection}>
                <p>Checklist ({checkedItems}/{task.checklist ? task.checklist.length : 0})</p>
                <button onClick={toggleCollapse} className={styles.collapseToggle}>
                    {isCollapsed ? <img src={Stroke1} alt="Collapse" /> : <img src={Stroke} alt="Expand" />}
                </button>
            </div>
            {!isCollapsed && task.checklist && (
                <div className={styles.checklist}>
                    {task.checklist.map((item, index) => (
                        <div key={index} className={styles.checklistItem}>
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleChecklistItem(index)}
                                className={styles.checklistCheckbox}
                            />
                            <span>{item.item}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className={styles.footer}>
                <div>
                    {task.dueDate && (
                        <span className={`${styles.dueDate} ${isTaskDone() ? styles.done : isDueDateExpired() ? styles.expired : ''}`}>
                            {formatDate(task.dueDate)}
                        </span>
                    )}
                </div>
                <div className={styles.statusTabs}>
                    {['backlog', 'inProgress', 'todo', 'done'].filter(status => status !== task.taskStatus).map(status => (
                        <button key={status} onClick={() => handleStatusChange(status)} className={styles.statusBtn}>
                            {status.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            {isDeleteModalOpen && <DeleteTask onConfirm={handleDelete} onCancel={closeDeleteModal} />}
            <Toaster position="top-right" />
        </div>
    )
}

export default PublicPage