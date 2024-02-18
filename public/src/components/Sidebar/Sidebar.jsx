// import React from 'react'
import PropTypes from 'prop-types'
// import from './Slidebar.module.css'

// Componente para el menú lateral
const Sidebar = ({ onSelect }) => {
  const menuItems = ['Inicio', 'Acerca de', 'Servicios', 'Contacto']
  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => onSelect(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Definir PropTypes para el componente Sidebar
Sidebar.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

export default Sidebar
