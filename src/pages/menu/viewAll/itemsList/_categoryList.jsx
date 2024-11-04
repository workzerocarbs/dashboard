/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import '../itemsList/style.scss'

const CategoriestListItems = ({ items, onItemClick, selectedItem }) => {
    return (
        <div>
            <ul className="item-list">
                {items.map(item => (
                    <li
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className={item.id === selectedItem.id ? 'active' : ''}>
                        {item.title}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CategoriestListItems