import React from 'react';
import styles from './LeftSection.module.css';
import alienBack from '../assets/alienBack.png';
import alien from '../assets/alien.png';

function LeftSection() {
  return (
    <div className={styles.container}>
      <img src={alienBack} className={styles.alienBack} alt="Alien Background"/>
      <img src={alien} className={styles.alien} alt="Alien" />
      <h2 className={styles.welcome}>Welcome aboard my friend</h2>
      <p className={styles.subtitle}>Just a couple of clicks and we start</p>
    </div>
  );
}

export default LeftSection;
