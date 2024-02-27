import { useState } from 'react'
import PropTypes from 'prop-types'
import { buttonMenu, dropdownContent, inputContainer, checkContainer } from './ElementsMenu.module.css'

const ElementsMenu = ({
  menu,
  selectedElements,
  setSelectedElements,
  newElement,
  setNewElement,
  availableElements,
  setAvailableElements,
  allowAdd,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const handleElementChange = (element) => {
    const isSelected = selectedElements.includes(element)

    if (isSelected) {
      setSelectedElements(selectedElements.filter((item) => item !== element))
    } else {
      setSelectedElements([...selectedElements, element])
    }
  }

  const handleAddElement = () => {
    if (newElement && !availableElements.includes(newElement) && !selectedElements.includes(newElement)) {
      setAvailableElements([...availableElements, newElement])
      setSelectedElements([...selectedElements, newElement])
      setNewElement('')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="dropdown" style={{ top: '-3vh', left: '0.5vw', position: 'absolute', zIndex: 2 }}>
        <button type="button" className={buttonMenu} onClick={() => setIsMenuVisible(!isMenuVisible)}>
          {menu}
        </button>
        {isMenuVisible && (
          <div className={dropdownContent}>
            {availableElements.map((element) => (
              <div key={element} className={checkContainer}>
                <label htmlFor={element}>{element}</label>
                <input
                  type="checkbox"
                  id={element}
                  checked={selectedElements.includes(element)}
                  onChange={() => handleElementChange(element)}
                  disabled={!allowAdd}
                />
              </div>
            ))}
            {allowAdd && (
              <div className={inputContainer}>
                <input
                  type="text"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
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

ElementsMenu.propTypes = {
  menu: PropTypes.node.isRequired,
  selectedElements: PropTypes.array.isRequired,
  setSelectedElements: PropTypes.func.isRequired,
  newElement: PropTypes.string.isRequired,
  setNewElement: PropTypes.func.isRequired,
  availableElements: PropTypes.array.isRequired,
  setAvailableElements: PropTypes.func.isRequired,
  allowAdd: PropTypes.bool.isRequired,
}

export default ElementsMenu
