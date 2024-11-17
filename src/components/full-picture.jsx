import React from 'react'

import './full-picture.css'

const FullPicture = () => {
  return (
    <div>
      Full Picture Content XYX
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
  )
}

export default FullPicture