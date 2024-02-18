// import React from 'react'
import PropTypes from 'prop-types'
// import from './Slidebar.module.css'

// Componente para el contenido principal
const Content = ({ selectedMenuItem }) => {
    return (
      <div className="content">
        <h2>{selectedMenuItem}</h2>
        <p>Contenido relacionado con {selectedMenuItem}.</p>
      </div>
    )
  }

  // Definir PropTypes para el componente Sidebar
Content.propTypes = {
    selectedMenuItem: PropTypes.func.isRequired,
}
  

export default Content