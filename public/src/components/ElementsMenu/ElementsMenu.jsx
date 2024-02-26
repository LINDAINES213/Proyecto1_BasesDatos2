import { useState } from 'react'

const ElementsMenu = () => {
  const [selectedElements, setSelectedElements] = useState([])
  const [newElement, setNewElement] = useState('')

  const elements = ['Elemento1', 'Elemento2', 'Elemento3'] // Puedes agregar más elementos según tus necesidades

  const handleElementChange = (element) => {
    const isSelected = selectedElements.includes(element)

    if (isSelected) {
      setSelectedElements(selectedElements.filter((item) => item !== element))
    } else {
      setSelectedElements([...selectedElements, element])
    }
  }

  const handleAddElement = () => {
    if (newElement && !elements.includes(newElement) && !selectedElements.includes(newElement)) {
      setSelectedElements([...selectedElements, newElement])
      setNewElement('')
    }
  }

  return (
    <div>
      <h4>Selecciona tus elementos:</h4>
      <div>
        {elements.map((element) => (
          <div key={element}>
            <input
              type="checkbox"
              id={element}
              checked={selectedElements.includes(element)}
              onChange={() => handleElementChange(element)}
            />
            <label htmlFor={element}>{element}</label>
          </div>
        ))}
        <div>
          <input
            type="text"
            value={newElement}
            onChange={(e) => setNewElement(e.target.value)}
            placeholder="Nuevo elemento"
          />
          <button onClick={handleAddElement}>Agregar</button>
        </div>
      </div>

      <div>
        <h4>Elementos Seleccionados:</h4>
        <ul>
          {selectedElements.map((element) => (
            <li key={element}>{element}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ElementsMenu
