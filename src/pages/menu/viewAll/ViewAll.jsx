/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import '../viewAll/style.scss'
import ItemContent from './itemContent/ItemContent'
import CategoriestListItems from './itemsList/CategoriestListItems'
import { fetchCategories } from '../../../utils/CategoryAPI'

const ViewAll = () => {

  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    document.title = "ZeroCarbs | Menu"
  }, [])

  // Fetch Categries
  useEffect(() => {
    const getCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories.data);
        if (fetchedCategories.data.length > 0) {
          console.log(fetchedCategories.data[0])
          setSelectedItem(fetchedCategories.data[0]);
        }
      } catch (err) {
        console.log("Error", err);
      }
    }
    getCategories();
  }, [])

  return (
    <div className='body-content'>
      <div className="card border-0 p-3">
        <h3 className="mb-0">View All Items</h3>
      </div>

      <div className="card border-0">
        <div className="card-body">
          <div className="viewAllContainer">
            <div className="left-panel">
              <CategoriestListItems items={categories} selectedItem={selectedItem} onItemClick={handleItemClick} />
            </div>
            <div className="right-panel">
              {selectedItem && <ItemContent item={selectedItem} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewAll;