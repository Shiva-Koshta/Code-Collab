import React, { useRef, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

const SettingsMenu = ({ currTheme, setCurrTheme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState(null);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
    setThemeAnchorEl(null);
  };

  const handleThemeClick = (event) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeChange = (theme) => {
    setCurrTheme(theme);
    setThemeAnchorEl(null);
    setAnchorEl(null);
  };

  const themes = [
    'monokai', 'dracula', 'nord', 'neat', 'mbo', 'abcdef', 'midnight',
    'material-ocean', 'material-darker', 'material-palenight', 'material',
    'twilight', 'the-matrix', 'rubyblue', 'shadowfox', 'eclipse', 'seti',
    'yeti', 'oceanic-next', 'panda-syntax'
  ];

  return (
    <div className='z-10'>
      <SettingsIcon
        onClick={handleSettingsClick}
        style={{ zIndex: 2 }}
        className='text-gray-400 hover:cursor-pointer'
      />
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
        style={{ zIndex: 3 }}
      >
        <List>
          <ListItem button onClick={handleThemeClick}>
            <ListItemText primary="Theme" />
          </ListItem>
          <ListItem button onClick={handleThemeClick}>
            <ListItemText primary="Keyboard Shortcuts" />
          </ListItem>
        </List>
      </Popover>
      <Popover
        open={Boolean(themeAnchorEl)}
        anchorEl={themeAnchorEl}
        onClose={() => setThemeAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        style={{ zIndex: 4 }}
      >
        <List>
          {themes.map((theme) => (
            <ListItem
              key={theme}
              button
              onClick={() => handleThemeChange(theme)}
            >
              <ListItemText primary={theme} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};

export default SettingsMenu;