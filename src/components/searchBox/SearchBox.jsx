/* eslint-disable no-unused-vars */
import React from 'react';
import { IoSearch } from "react-icons/io5";
import '../searchBox/styles.scss'

const SearchBox = () => {
  return (
    <div className='searchBox position-relative'>
      <IoSearch className='mr-2 icon' size={20} />
      <input type="text" placeholder='Quick Search' />
    </div>
  )
}

export default SearchBox