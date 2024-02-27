import { useState } from 'react'
import './App.css'
import { CRUDoperations, Restaurants, Recipes, Sales, Charts } from './pages'
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
        {selectedMenuItem === 'Ventas' && <Sales /> }
        {selectedMenuItem === 'Recetas' && <Recipes />}
        {selectedMenuItem === 'Usuarios' && <CRUDoperations />}
        {selectedMenuItem === 'Restaurantes' && <Restaurants />}
        {selectedMenuItem === 'Mongo Charts' && <Charts />}
        {selectedMenuItem !== 'Inicio' &&
         selectedMenuItem !== 'Acerca de' &&
         selectedMenuItem !== 'Ventas' &&
         selectedMenuItem !== 'Recetas' &&
         selectedMenuItem !== 'Restaurantes' &&
         selectedMenuItem !== 'Usuarios' && 
         selectedMenuItem !== 'Mongo Charts' && <p>Contenido no definido.</p>}
      </Content>
    </div>
  )
}

export default App
