import React from 'react'

import './full-picture.css'
import bsc from '../assets/bsc.png'

const FullPicture = () => {
  return (
    <>
    Full Picture Content XYX234
    <div className='tileContainer'>
    <div>
      <div className='dashboard'>
      <div className='tile'>Staff</div>
      <div className='tile'>Clients</div>
      <div className='tile'>Leads</div>
      
      </div>

      <div className='dashboard'>
      <div className='tile'>Email</div>
      <div className='tile'>Calendar</div>
      <div className='tile'>Tasks</div>
      </div>

      <div className='dashboard'>
      <div className='tile'>Anticipated Revenue</div>
      <div className='tile'>Revenue</div>
      <div className='tile'>Expenses</div>
      </div>
    </div>
    </div>

    <div className='logo'>
      <img src={bsc} alt="BSC Logo" />
    </div>
    </>
  )
}

export default FullPicture