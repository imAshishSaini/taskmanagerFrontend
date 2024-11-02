import React, { useState } from 'react'
import styles from './Column.module.css'
import collapseIcon from '../assets/collapseIcon.png'
import AddTaskModal from '../modals/AddTask'
import Task from './Task'

function Column({title, tasks, onStatusChange, showAddButton}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <h4>{title}</h4>
            <div className={styles.controls}>
              {showAddButton && <button className={styles.addBtn} onClick={toggleModal}>+</button>}
              <img src={collapseIcon} className={styles.collapseIcon}/>
            </div>
        </div>
        <div className={styles.tasks}>
          {tasks && tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
        {isModalOpen && <AddTaskModal closeModal={toggleModal} taskData={{}} />}
    </div>
  )
}

export default Column