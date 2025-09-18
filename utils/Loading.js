import React from 'react'
import styles from '@/styles/Utils.module.css'

const Loading = ({type}) => {
  return (
    <div className={styles.loader} >
    <div data-glitch={type === 'ROOT' ? 'Redirecting, Please Wait...' : 'Loading...'} className={styles.glitch} >{type === 'ROOT' ? 'Redirecting, Please Wait...' : 'Loading...'}</div>
    </div>
  )
}

export default Loading