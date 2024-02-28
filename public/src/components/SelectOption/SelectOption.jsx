import { useState } from 'react'
import PropTypes from 'prop-types'
import { buttonMenu, dropdownContent, inputContainer, radioContainer } from './SelectOption.module.css'

const SelectOption = ({
  menu,
  selectedOption,
  setSelectedOption,
  newOption,
  setNewOption,
  availableOptions,
  setAvailableOptions,
  allowAdd,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const handleOptionChange = (option) => {
    setSelectedOption(option)
    console.log("option", selectedOption)
  }

  const handleAddOption = () => {
    if (newOption.name && !availableOptions.some((item) => item._id === newOption._id)) {
      setAvailableOptions([...availableOptions, newOption])
      setSelectedOption(newOption)
      setNewOption('')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="dropdown" style={{ top: '-3vh', left: '0.5vw', position: 'absolute', zIndex: 1 }}>
        <button type="button" className={buttonMenu} onClick={() => setIsMenuVisible(!isMenuVisible)}>
          {menu}
        </button>
        {isMenuVisible && (
          <div className={dropdownContent}>
            {availableOptions.map((option) => (
              <div key={option._id} className={radioContainer}>
                <label htmlFor={option._id}>{option.name}</label>
                <input
                  type="radio"
                  id={option._id}
                  checked={selectedOption && selectedOption._id === option._id}
                  onChange={() => handleOptionChange(option)}
                  disabled={allowAdd}
                />
              </div>
            ))}
            {allowAdd && (
              <div className={inputContainer}>
                <input
                  type="text"
                  value={newOption.name}
                  onChange={(e) => setNewOption({ _id: Math.random().toString(), name: e.target.value })}
                  placeholder="Nueva opción"
                />
                <button type="button" onClick={handleAddOption}>
                  Agregar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

SelectOption.propTypes = {
  menu: PropTypes.string.isRequired,
  selectedOption: PropTypes.object,
  setSelectedOption: PropTypes.func.isRequired,
  newOption: PropTypes.object.isRequired,
  setNewOption: PropTypes.func.isRequired,
  availableOptions: PropTypes.array.isRequired,
  setAvailableOptions: PropTypes.func.isRequired,
  allowAdd: PropTypes.bool.isRequired,
}

export default SelectOption
