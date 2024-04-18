import React, { useState, useEffect, useRef } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'

const SettingsMenu = ({currTheme, setCurrTheme, setIsVisible}) => {
 const [anchorEl, setAnchorEl] = useState(null)
 const [themeAnchorEl, setThemeAnchorEl] = useState(null)
 const themeBoxRef = useRef(null) // Ref for the theme box

 const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget)
 }

 const handleSettingsClose = () => {
    setAnchorEl(null)
 }

 const handleThemeClick = (event) => {
    setAnchorEl(null) // Dismiss the popover by setting anchorEl to null
    setThemeAnchorEl(event.currentTarget) // Optionally, set themeAnchorEl if needed for other logic
 }

 const handleThemeClose = () => {
    setThemeAnchorEl(null)
    setIsVisible([false, false, false])
 }

 const themes = ['monokai', 'dracula', 'nord', 'neat', 'mbo', 'abcdef', 'midnight', 'material-ocean', 'material-darker', 'material-palenight', 'material', 'twilight', 'the-matrix', 'rubyblue', 'shadowfox', 'eclipse', 'seti', 'yeti', 'oceanic-next', 'panda-syntax']

 // Focus on the theme box when anchorEl changes to null
 useEffect(() => {
    if (!anchorEl && themeBoxRef.current) {
      themeBoxRef.current.focus()
    }
 }, [anchorEl])

 return (
    <>
      <button
        className={`rounded-full ${currTheme === 'neat' || currTheme === 'eclipse' || currTheme === 'yeti' ? 'text-black hover:text-gray-600':'text-gray-400 hover:text-gray-200'}`}
        onClick={handleSettingsClick}
      >
        <SettingsIcon />
      </button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          className: 'bg-[#1c1e29] text-gray-400',
        }}
      >
        <List style={{backgroundColor:'#2a2b3b', color:'#808080'}}>
          <ListItem button onClick={handleThemeClick}>
            <ListItemText primary='Theme' />
          </ListItem>
          <Divider className='bg-gray-600' />
          <ListItem button >
            <ListItemText primary='Keyboard Shortcuts' />
          </ListItem>
          {/* Add more settings options here */}
        </List>
      </Popover>
      {themeAnchorEl && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
          onClick={handleThemeClose}
        >
          <div
            className='bg-[#1c1e29] text-gray-400 shadow-lg rounded-lg w-[400px] h-[500px] overflow-auto p-4'
            onClick={(e) => e.stopPropagation()}
            ref={themeBoxRef} // Attach the ref to the theme box div
          >
            <div className='flex justify-between'>
              <div className='ml-4 text-xl font-bold'>
                Themes
              </div>
              <button
                className='text-gray-400 hover:text-gray-200'
                onClick={handleThemeClose}
              >
                <CloseIcon />
              </button>
            </div>
            <List className='bg-[#1c1e29]'>
              {themes.map((theme) => (
                <ListItem
                 key={theme}
                 button
                 className='hover:bg-gray-600'
                 onClick={(e) => {
                    e.stopPropagation()
                    setCurrTheme(theme)
                    handleThemeClose()
                 }}
                >
                 <ListItemText primary={theme} />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      )}
    </>
 )
}

export default SettingsMenu
