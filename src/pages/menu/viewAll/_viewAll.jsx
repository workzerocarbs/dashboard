/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import '../viewAll/style.scss'
import ItemContent from './itemContent/ItemContent'
import CategoriestListItems from './itemsList/CategoriestListItems'
import { data } from '../../../utils/ItemData'

const ViewAll = () => {

  const [selectedItem, setSelectedItem] = useState(data[0]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    document.title = "ZeroCarbs | Menu"
  })

  return (
    <div className='body-content'>
      <div className="card border-0 p-3">
        <h3 className="mb-0">View All Items</h3>
      </div>

      <div className="card border-0">
        <div className="card-body">
          <div className="viewAllContainer">
            <div className="left-panel">
              <CategoriestListItems items={data} selectedItem={selectedItem} onItemClick={handleItemClick} />
            </div>
            <div className="right-panel">
              <ItemContent item={selectedItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewAll