import React, { useState, useEffect } from 'react'
import styles from './AddTask.module.css'
import API from '../services/api'
import deleteIcon from '../assets/Delete.png'
import { Toaster } from 'react-hot-toast'

function AddTaskModal({ closeModal, assignedPerson, taskData = {} }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Moderate')
  const [checklist, setChecklist] = useState([{ item: '', completed: false }])
  const [assignees, setAssignees] = useState(assignedPerson  || '')
  const [suggestEmail, setSuggestEmail] = useState([])
  const [dueDate, setDueDate] = useState('')
  const dateInputRef = React.useRef(null)
  const isEditMode = Boolean(taskData._id)

  useEffect(() => {
    if (isEditMode) {
      console.log('Task Data:', taskData)
      setTitle(taskData.title || '')
      setPriority(taskData.priority || 'Moderate')
      setChecklist(taskData.checklist || [{ item: '', completed: false }])
      setAssignees(taskData.assignees || assignedPerson || '')
      setDueDate(taskData.dueDate || '')
    }
  }, [taskData, isEditMode, assignedPerson])

  const handleAssigneesChange = async (e) => {
    const email = e.target.value
    setAssignees(email)

    if (email) {
      try {
        const token = localStorage.getItem('token')
        const { data } = await API.get(`/api/user/search?email=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setSuggestEmail(data)
      } catch (error) {
        console.log(error)
      }
    } else {
      setSuggestEmail([])
    }
  }

  const selectAssignee = (email) => {
    setAssignees(email)
    setSuggestEmail([])
  }
  const addChecklistItem = () => {
    setChecklist([...checklist, { text: '', completed: false }])
  };

  const handleChecklistChange = (index, value) => {
    const updatedChecklist = [...checklist]
    updatedChecklist[index].item = value
    setChecklist(updatedChecklist)
  };

  const removeChecklistItem = (index) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index)
    setChecklist(updatedChecklist)
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Request Headers:', {
        Authorization: `Bearer ${token}`,
      })
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }
      const taskDetails = {
        title,
        priority,
        assignees,
        checklist,
        dueDate
      }
      if(isEditMode) {
        await API.patch(`/api/task/${taskData._id}/update`, taskDetails, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        await API.post('/api/task/create', taskDetails, {
          headers: {  
            Authorization: `Bearer ${token}`
          }
        })
      }
      console.log('Task created successfully', response.data)
      closeModal()
    } catch (error) {
      console.error('Task creation failed:', error)
    }
  }

  const handleDateBtnClick = () => {
    dateInputRef.current.showPicker()
  }

  const handleDateChange = (e) => {
    setDueDate(e.target.value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.body}>

        <label className={styles.label}>
          Title <span className={styles.asterisk}>*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Task Title"
          className={styles.input}
          required={true}
        />

        <div className={styles.prioritySection}>
          <label className={styles.label}>
            Select Priority <span className={styles.asterisk}>*</span>
          </label>
          <div className={styles.priorityOptions}>
            <div
              className={`${styles.priorityBox} ${priority === 'High' ? styles.selected : ''}`}
              onClick={() => setPriority('High')}
            >
              <span className={styles.priorityIndicator}></span>
              HIGH PRIORITY
            </div>
            <div
              className={`${styles.priorityBox} ${priority === 'Moderate' ? styles.selected : ''
                }`}
              onClick={() => setPriority('Moderate')}
            >
              <span className={styles.priorityIndicator}></span>
              MODERATE PRIORITY
            </div>
            <div
              className={`${styles.priorityBox} ${priority === 'Low' ? styles.selected : ''
                }`}
              onClick={() => setPriority('Low')}
            >
              <span className={styles.priorityIndicator}></span>
              LOW PRIORITY
            </div>
          </div>
        </div>

        <div className={styles.assigneeSection}>
          <div>
          <label className={styles.label}>Assign to</label>
          </div>
          <div>
          <input
            type="text"
            value={assignees}
            onChange={handleAssigneesChange}
            placeholder="Enter Assignee Email"
            className={styles.input}
          />
          {suggestEmail.length > 0 && (
            <div className={styles.assigneeSuggestions}>
              {suggestEmail.map((user) => (
                <div
                  key={user.email}
                  className={styles.assigneeSuggestionItem}
                  onClick={() => selectAssignee(user.email)}
                >
                  {user.email}
                </div>
              ))}
            </div>
          )}
          </div>
        </div>


        <div className={styles.checklistSection}>
          <label className={styles.label}>
            Checklist <span className={styles.asterisk}>*</span>
          </label>
          {checklist.map((item, index) => (
            <div key={index} className={styles.checklistItem}>
              <input
                type="checkbox"
                className={styles.checkbox}
              />
              <input
                type="text"
                value={item.item}
                onChange={(e) => handleChecklistChange(index, e.target.value)}
                placeholder="Add a task"
                className={styles.input}
              />
              <button
                onClick={() => removeChecklistItem(index)}
                className={styles.deleteBtn}
              >
                <img src={deleteIcon} className={styles.DelIcon} />
              </button>
            </div>
          ))}
          <button onClick={addChecklistItem} className={styles.addBtn}>
            + Add New
          </button>
        </div>

        <div className={styles.actions}>
          <div className={styles.dueDateSection}>
          <button className={styles.dateBtn} onClick={handleDateBtnClick}>
            {dueDate ? `${dueDate}` : 'Select Due Date'}
          </button>
          <input type="date" ref={dateInputRef} value={dueDate} onChange={handleDateChange} style={{ display: 'none' }} />
          </div>
          <div className={styles.buttonContainer}>
          <button onClick={closeModal} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            Save
          </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default AddTaskModal;
