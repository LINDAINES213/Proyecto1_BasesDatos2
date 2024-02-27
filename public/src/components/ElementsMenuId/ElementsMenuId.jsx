import { useState } from 'react'
import PropTypes from 'prop-types'
import { buttonMenu, dropdownContent, inputContainer, checkContainer } from './ElementsMenuId.module.css'

const ElementsMenuId = ({ menu, selectedElements, setSelectedElements, newElement, setNewElement, availableElements,
  setAvailableElements, allowAdd }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const handleElementChange = (element) => {
    const isSelected = selectedElements.some((item) => item._id === element._id)

    if (isSelected) {
      setSelectedElements(selectedElements.filter((item) => item._id !== element._id))
    } else {
      setSelectedElements([...selectedElements, element])
    }
  }

  const handleAddElement = () => {
    if (newElement.name && !availableElements.some((item) => item._id === newElement._id) 
    && !selectedElements.some((item) => item._id === newElement._id)) {
      setAvailableElements([...availableElements, newElement])
      setSelectedElements([...selectedElements, newElement])
      setNewElement('')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="dropdown" style={{ top: '-3vh', left: '0.5vw', position: 'absolute', zIndex: 1 }}>
        <button type="button"className={buttonMenu} onClick={() => setIsMenuVisible(!isMenuVisible)}>
          {menu}
        </button>
        {isMenuVisible && (
          <div className={dropdownContent}>
            {availableElements.map((element) => (
              <div key={element._id} className={checkContainer}>
                <label htmlFor={element._id}>{element.name}</label>
                <input
                  type="checkbox"
                  id={element._id}
                  checked={selectedElements.some((item) => item._id === element._id)}
                  onChange={() => handleElementChange(element)}
                  disabled={allowAdd}
                />
              </div>
            ))}
            {allowAdd && (
              <div className={inputContainer}>
                <input
                  type="text"
                  value={newElement.name}
                  onChange={(e) => setNewElement({ _id: Math.random().toString(), name: e.target.value })}
                  placeholder="Nuevo elemento"
                />
                <button type="button" onClick={handleAddElement}>Agregar</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

ElementsMenuId.propTypes = {
  menu: PropTypes.string.isRequired,
  selectedElements: PropTypes.array.isRequired,
  setSelectedElements: PropTypes.func.isRequired,
  newElement: PropTypes.object.isRequired,
  setNewElement: PropTypes.func.isRequired,
  availableElements: PropTypes.array.isRequired,
  setAvailableElements: PropTypes.func.isRequired,
  allowAdd: PropTypes.bool.isRequired,
}

export default ElementsMenuId
