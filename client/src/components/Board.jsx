import React, { useState, useEffect } from 'react'
import styles from './Board.module.css'
import Column from './Column'
import API from '../services/api'
import AddPeople from '../modals/AddPeople'
import people from '../assets/people.png'
import { Toaster } from 'react-hot-toast'

function Board() {
  const [tasks, setTasks] = useState({ backlog: [], todo: [], inProgress: [], done: [] })
  const [filter, setFilter] = useState('week')
  const [assignedPerson, setAssignedPerson] = useState(null)
  const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false)

  const handleAddPerson = (email) => {
    setAssignedPerson(email)
    setIsAddPeopleOpen(false)
  }

  const handleRemovePerson = (email) => {
    setAssignedPerson(null)
    setIsAddPeopleOpen(false)
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };

      Object.keys(updatedTasks).forEach(status => {
        updatedTasks[status] = updatedTasks[status].filter(task => task._id !== taskId);
      });

      const movedTask = tasks.backlog.concat(tasks.todo, tasks.inProgress, tasks.done).find(task => task._id === taskId);
      if (movedTask) {
        movedTask.status = newStatus;
        updatedTasks[newStatus] = [movedTask, ...updatedTasks[newStatus]];
      }
      return updatedTasks;
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const { data } = await API.get(`/api/task/all?filter=${filter}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // console.log(data)
        setTasks(data.tasks)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [filter, handleStatusChange])


  return (
    <div className={styles.boardContainer}>
      <div className={styles.header}>
        <div className={styles.boardTitle}>
          <h2>Board</h2>
          <span onClick={() => setIsAddPeopleOpen(true)}>
            <img src={people} className={styles.peopleIcon} alt="People" />
            {assignedPerson ? 'Remove People' : 'Add People'}
          </span>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className={styles.filterDropDown}>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      <div className={styles.body}>
        <Column
          title="Backlog"
          tasks={tasks.backlog}
          onStatusChange={handleStatusChange}
        />

        <Column
          title="To do"
          tasks={tasks.todo}
          onStatusChange={handleStatusChange}
          showAddButton
        />

        <Column
          title="In progress"
          tasks={tasks.inProgress}
          onStatusChange={handleStatusChange}
        />

        <Column
          title="Done"
          tasks={tasks.done}
          onStatusChange={handleStatusChange}
        />
      </div>

      {isAddPeopleOpen && (
        <AddPeople
          assignedPerson={assignedPerson}
          onAddPerson={handleAddPerson}
          onRemovePerson={handleRemovePerson}
          onCancel={() => setIsAddPeopleOpen(false)} // Close modal on cancel
        />
      )}
      <Toaster position="top-right" />
    </div>
  )
}

export default Board