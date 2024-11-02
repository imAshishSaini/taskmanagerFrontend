import React, { useEffect, useState } from 'react'
import styles from './Analytics.module.css'
import API from '../services/api'
import {Toaster} from 'react-hot-toast'

function Analytics() {
  const [analytics, setAnalytics] = useState({
    backlogTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    lowPriority: 0,
    moderatePriority: 0,
    highPriority: 0,
    dueDateTasks: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/api/task/analytics')
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Analytics</h2>
      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <ul>
            <li>
              <div className={styles.nameSection}><span>●</span><p>Backlog Tasks</p></div> <b>{analytics.backlogTasks}</b>
            </li>
            <li>
              <div className={styles.nameSection}><span>●</span><p>To-do Tasks</p></div> <b>{analytics.todoTasks}</b>
            </li>
            <li>
              <div className={styles.nameSection}><span>●</span><p>In-Progress Tasks</p></div> <b>{analytics.inProgressTasks}</b>
            </li>
            <li>
              <div className={styles.nameSection}><span>●</span><p>Completed Tasks</p></div> <b>{analytics.completedTasks}</b>
            </li>
          </ul>
        </div>

        {/* Right Section - Task Priority */}
        <div className={styles.analyticsCard}>
          <ul>
            <li>
              <div className={styles.nameSection}><span>●</span> <p>Low Priority</p></div> <b>{analytics.lowPriority}</b>
            </li>
            <li>
              <div className={styles.nameSection}><span>●</span> <p>Moderate Priority</p></div> <b>{analytics.moderatePriority}</b>
            </li>
            <li>
              <div className={styles.nameSection}><span>●</span> <p>High Priority</p></div> <b>{analytics.highPriority}</b>
            </li>
            <li>
              <div className={styles.nameSection}><span>●</span> <p>Due Date Tasks</p></div> <b>{analytics.dueDateTasks}</b>
            </li>
          </ul>
        </div>
      </div>
      <Toaster position="top-right"/>
    </div>
  );
}

export default Analytics;
