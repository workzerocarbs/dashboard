/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react'

const ViewExpenses = () => {

  useEffect(() => {
    document.title = "ZeroCarbs | Expenses"
  }, [])


  return (
    <div className='body-content'>
      <div className="card border-0 p-3">
        <h3 className="mb-0">All Expenses</h3>
      </div>
    </div>
  )
}

export default ViewExpenses