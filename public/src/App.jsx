import { useState } from 'react'
import './App.css'
// import axios from 'axios'
import { CRUDoperations } from './pages'
import { Content, Sidebar } from './components'

// eslint-disable-next-line react/function-component-definition
function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Inicio')

  const handleMenuSelect = (item) => {
    setSelectedMenuItem(item)
  }

  return (
    <div className="app">
      <Sidebar onSelect={handleMenuSelect} />
      <Content selectedMenuItem={selectedMenuItem}>
        {selectedMenuItem === 'Inicio' && <p>Contenido relacionado con Inicio.</p>}
        {selectedMenuItem === 'Acerca de' && <p>Contenido relacionado con Acerca de.</p>}
        {selectedMenuItem === 'Servicios' && <p>Contenido relacionado con Servicios.</p>}
        {selectedMenuItem === 'Contacto' && <p>Contenido relacionado con Contacto.</p>}
        {selectedMenuItem === 'Información' && <CRUDoperations />}
        {selectedMenuItem !== 'Inicio' &&
         selectedMenuItem !== 'Acerca de' &&
         selectedMenuItem !== 'Servicios' &&
         selectedMenuItem !== 'Contacto' &&
         selectedMenuItem !== 'Información' && <p>Contenido no definido.</p>}
      </Content>
    </div>
  )
}

export default App
