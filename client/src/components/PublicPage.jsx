import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api'
import styles from './PublicPage.module.css'

const addSuffixToDate = (day) => {
    if (day > 3 && day < 21) return `${day}th`
    switch (day % 10) {
        case 1: return `${day}st`
        case 2: return `${day}nd`
        case 3: return `${day}rd`
        default: return `${day}th`
    }
}
function PublicPage() {
    const { shareId } = useParams()
    const [task, setTask] = useState(null)
    const [checkedItems, setCheckedItems] = useState()

    const formatDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'short' }
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj)
        return `${formattedDate} ${addSuffixToDate(dateObj.getDate())}`
    }

    const isDueDateExpired = () => {
        if (!task.dueDate) return false
        return new Date(task.dueDate) < new Date() && task.taskStatus !== 'done'
    }

    const isTaskDone = () => task.taskStatus === 'done'
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await API.get(`/api/task/public/${shareId}`)
                console.log(response.data.task)
                setCheckedItems(response.data.task.checklist ? response.data.task.checklist.filter(item => item.checked).length : 0)
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
        <div className={styles.publicContainer}>
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
            </div>
            {task.checklist && (
                <div className={styles.checklist}>
                    {task.checklist.map((item, index) => (
                        <div key={index} className={styles.checklistItem}>
                            <input
                                type="checkbox"
                                checked={item.checked}
                                readOnly
                                className={styles.checklistCheckbox}
                            />
                            <span>{item.item}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className={styles.footer}>
                <div>
                    {task.dueDate && (<h5>Due Date
                        <span className={`${styles.dueDate} ${isTaskDone() ? styles.done : isDueDateExpired() ? styles.expired : ''}`}>
                            {formatDate(task.dueDate)}
                        </span></h5>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PublicPage