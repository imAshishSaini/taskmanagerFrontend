import React, { useState, useEffect } from 'react'
import styles from './Task.module.css'
import API from '../services/api'
import Stroke from '../assets/Stroke.png'
import Stroke1 from '../assets/Stroke1.png'
import moreOptionsIcon from '../assets/moreOptionsIcon.png'
import toast, { Toaster } from 'react-hot-toast'
import AddTask from '../modals/AddTask'
import DeleteTask from '../modals/DeleteTask'

const addSuffixToDate = (day) => {
  if(day > 3 && day < 21) return `${day}th`
  switch (day % 10) {
    case 1: return `${day}st`
    case 2: return `${day}nd`
    case 3: return `${day}rd`
    default: return `${day}th`
  }
}

function Task({ task, onStatusChange }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [checkedItems, setCheckedItems] = useState(
    task.checklist ? task.checklist.filter(item => item.checked).length : 0
  )
  const [showOptions, setShowOptions] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [assigneeInitials, setAssigneeInitials] = useState('')

  const openEditModal = () => {
    setShowOptions(false)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => setIsEditModalOpen(false)

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  const toggleChecklistItem = (index) => {
    const updatedChecklist = [...task.checklist]
    updatedChecklist[index].checked = !updatedChecklist[index].checked
    setCheckedItems(updatedChecklist.filter(item => item.checked).length)
  }

  const handleShare = () => {
    const link = `${window.location.origin}/public/${task.shareId}`
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied!')
    })
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token')
      await API.patch(`api/task/${task._id}/status`, { taskStatus: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Task status updated successfully')
      onStatusChange(task._id, newStatus)
    } catch (error) {
      console.error('Failed to update task status', error)
    }
  }

  const handleDelete = async () => {
    setIsDeleteModalOpen(false)
    setShowOptions(false)
    try {
      const token = localStorage.getItem('token')
      await API.delete(`api/task/${task._id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Task deleted successfully')
    } catch (error) {
      console.error('Failed to delete task', error)
    }
  }

  const formatDate = (date) => {
    const dateObj = new Date(date)
    const options = { month: 'short'}
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj)
    return `${formattedDate} ${addSuffixToDate(dateObj.getDate())}`
  }
  

  const isDueDateExpired = () => {
    if (!task.dueDate) return false
    return new Date(task.dueDate) < new Date() && task.taskStatus !== 'done'
  }

  const isTaskDone = () => task.taskStatus === 'done'

  const toggleOptions = () => setShowOptions(!showOptions)

  const openDeleteModal = () => {
    setShowOptions(false)
    setIsDeleteModalOpen(true)  
  }

  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  useEffect(() => {
    const fetchAssigneeInitials = async () => {
      if (task.assignees) {
        try {
          const token = localStorage.getItem('token')
          const response = await API.get(`/api/user/name?id=${task.assignees}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          console.log('API Response:', response) 
          
          const { name } = response.data
          if (name) {
            const words = name.split(' ').filter(word => word.length > 0)
            if (words.length === 1) {
              setAssigneeInitials(words[0][0].toUpperCase())
            } else if (words.length > 1) {
              setAssigneeInitials(`${words[0][0].toUpperCase()}${words[words.length - 1][0].toUpperCase()}`)
            }
          }
        } catch (error) {
          console.error('Failed to get user name:', error)
        }
      }
    }
  
    fetchAssigneeInitials()
  }, [task.assignees])
  

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.prioritySection}>
          <span className={`${styles.priorityIndicator} ${task.priority.toUpperCase() === 'HIGH' ? styles.highPriority : task.priority.toUpperCase() === 'MODERATE' ? styles.moderatePriority : styles.lowPriority }`}></span>
          <span className={styles.priority}>{task.priority.toUpperCase()} PRIORITY</span>
          {assigneeInitials && <div className={styles.assignee}>{assigneeInitials}</div>}
        </div>
        <img
          src={moreOptionsIcon}
          alt="More options"
          className={styles.moreOptions}
          onClick={toggleOptions}
        />
        {showOptions && (
          <div className={styles.optionsMenu}>
            <button onClick={openEditModal}>Edit</button>
            <button onClick={handleShare}>Share</button>
            <button onClick={openDeleteModal} style={{ color: '#CF3636' }}>Delete</button>
          </div>
        )}
        {isEditModalOpen && <AddTask closeModal={closeEditModal} taskData={task} />}
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
            <span className={`${styles.dueDate} ${ isTaskDone() ? styles.done : isDueDateExpired() ? styles.expired : ''}`}>
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
      {isDeleteModalOpen && <DeleteTask onConfirm={handleDelete} onCancel={closeDeleteModal}/>}
      <Toaster position="top-right" />
    </div>
  )
}

export default Task
