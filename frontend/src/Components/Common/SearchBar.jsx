import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productsSlice'

const SearchBar = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSearchToggle = () => {
        setIsOpen(!isOpen)
    }
    const handleSearch = (e) =>{
        e.preventDefault()
        // Handle search logic here
        dispatch(setFilters({search: searchTerm})) // Set the search term in the filters
        dispatch(fetchProductsByFilters({search: searchTerm})) // Fetch products based on the search term
        navigate(`/collections/all?search=${searchTerm}`) // Navigate to the search results page

        console.log('Search term:', searchTerm)
        setSearchTerm('') // Clear the search term after submission
        setIsOpen(false) // Close the search bar after submission
    }

  return (
    <div className={`flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'absolute top-0 left-0 w-full bg-white h-24 z-50' : 'w-auto'} `}>
        {
            isOpen ? (
            <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full'>
                <div className='relative w-1/2'>
                    <input type="text" placeholder='Search' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className='bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none  w-full placeholder:text-gray-700'  />
                    <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2  text-gray-600 hover:text-gray-800 '>
                        <HiMagnifyingGlass className="h-6 w-6" />
                    </button>
                </div>
                {/*  close Button  */}
                <button type='button' className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800' onClick={handleSearchToggle}>
                    <HiMiniXMark className='h-6 w-6' />
                </button>
            </form>) : (
                
                // button to open search bar 
                <button onClick={handleSearchToggle}> 
                   <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />  
                </button>)

        }
    </div>
  )
}

export default SearchBar