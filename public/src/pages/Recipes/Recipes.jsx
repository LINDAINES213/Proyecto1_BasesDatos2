import { useEffect, useState } from 'react'
import { buttonContainer, inputContainer, inputText, selectText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit
 } from './Recipes.module.css'
import { Loading } from '../../components'
import axios from 'axios'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [id, setId] = useState(0)
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState()
  const [directions, setDirections] = useState('')
  const [cook_time, setCook_time] = useState('')
  const [country, setCountry] = useState('')
  const [prep_time, setPrep_time] = useState('')
  const [price, setPrice] = useState('')
  const [restaurants, setRestaurants] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)

  const handleButtonClick = (option) => {
    setSelectedOption(option)
    switch (option) {
      case 'verUsuarios':
        fetchData()
        setLimit()
        break
      case 'agruparPorPais':
        fetchDataPerCountry()
        break
      case 'edadPromedioPorGenero':
        fetchDataAvgAgePerGender()
        break
      default:
        console.log("Error fetching data")
    }
  }

  useEffect(() => {
    setLoading(true)
    axios.get("http://127.0.0.1:5000/recipes")
      .then((res) => {
        setRecipes(res.data)
        setId(0)
        setTitle('')
        setIngredients('')
        setDirections('')
        setCook_time('')
        setCountry('')
        setPrep_time('')
        setPrice('')
        setRestaurants('')        
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("http://127.0.0.1:5000/recipes", {
        title,
        ingredients,
        directions,
        cook_time,
        country,
        prep_time,
        price,
        restaurants
      }).then(() => {
        fetchData()
        setTitle('')
        setIngredients('')
        setDirections('')
        setCook_time('')
        setCountry('')
        setPrep_time('')
        setPrice('')
        setRestaurants('')     
      })
    } else {
      axios.put(`http://127.0.0.1:5000/recipes/${id}`, {
        title,
        ingredients,
        directions,
        cook_time,
        country,
        prep_time,
        price,
        restaurants
      }).then(() => {
        fetchData()
        setTitle('')
        setIngredients('')
        setDirections('')
        setCook_time('')
        setCountry('')
        setPrep_time('')
        setPrice('')
        setRestaurants('')     
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`http://127.0.0.1:5000/recipes/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const editrecipes = (id) => {
    axios.get(`http://127.0.0.1:5000/editrecipes/${id}`)
      .then((res) => {
        setTitle('')
        setIngredients('')
        setDirections('')
        setCook_time('')
        setCountry('')
        setPrep_time('')
        setPrice('')
        setRestaurants('')     
        setId(res.data._ID)
      })
  }

  const fetchData = (limit) => {
    setLoading(true)
  
    const parsedLimit = parseInt(limit)
    const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = isLimitInteger
      ? `http://127.0.0.1:5000/recipes?limit=${limit}`
      : 'http://127.0.0.1:5000/recipes'
  
    axios.get(url)
      .then((res) => {
        setRecipes(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })  
  }
  
  
  const fetchDataPerCountry = () => {
    setLoading(true)
    axios.get("http://127.0.0.1:5000/recipes_per_country")
      .then((res) => {
        setRecipes(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchDataAvgAgePerGender = () => {
    setLoading(true)
    axios.get("http://127.0.0.1:5000/age_average_per_gender")
      .then((res) => {
        console.log("res",res)
        setRecipes(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const renderTable = () => {
    if (loading) {
      return (
        <div className={centeredDiv}>
          <Loading />
        </div>
      )
    }
    switch (selectedOption) {
      case 'verUsuarios':
        return (
          <div>
            <div className='col lg-6 mt-5'>
            <h3>Añadir receta:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <i className="material-icons prefix">person</i>
                    <input className={inputText} value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Nombre' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">cake</i>
                    <input className={inputText} value={ingredients} onChange={(e) => setIngredients(parseInt(e.target.value,10))} type="number"
                     placeholder='Edad' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">wc</i>
                    <select className={selectText} value={directions} onChange={(e) => setDirections(e.target.value)}>
                        <option value="" disabled>Seleccionar género</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">mail</i>
                    <input className={inputText} value={prep_time} onChange={(e) => setPrep_time(e.target.value)} type="email" placeholder='Correo' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">location_on</i>
                    <input className={inputText} value={country} onChange={(e) => setCountry(e.target.value)} type="text" placeholder='País' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">contact_phone</i>
                    <input className={inputText} value={cook_time} onChange={(e) => setCook_time(e.target.value)} type="tel"
                        placeholder='Teléfono' />
                    <div className={buttonContainer}>
                        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action">Enviar 
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </div>
              </div>
            </form>
          </div>
          <h4>Limitar cantidad de recetas a mostrar:</h4>
          <div className={buttonContainerOptionsLimit}>
              <input className={inputTextSmall} value={limit} onChange={(e) => setLimit(e.target.value)} 
                type="number" placeholder='Cantidad:' />
              <div className={buttonContainer}>
                  <button className=" btn btn-sm btn-primary waves-effect waves-light right" name="action" 
                  onClick={() => fetchData(limit)}>Limitar 
                    <i className="material-icons prefix" style={{marginLeft: "0.3vw"}}>remove_circle_outline</i>
                  </button>
              </div>
          </div>
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>Receta</th>
                <th>Ingredientes</th>
                <th>Instrucciones</th>
                <th>Tiempo de cocina (min)</th>
                <th>País</th>
                <th>Tiempo de preparación (min)</th>
                <th>Precio ($)</th>
                <th>Restaurantes</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {recipes.map(recipe =>
                      <tr key={recipe._ID}>
                        <td className={leftAligned}>{recipe.title}</td>
                        <td>{recipe.ingredients ? (
                              <ol>
                                {recipe.ingredients.map((ingredient , index) => (
                                  <li key={index}>{ingredient}</li>
                                ))}
                              </ol>
                            ) : (
                              <p>No hay ingredientes disponibles.</p>
                            )}</td>
                        <td>{recipe.directions ? (
                              <ol>
                                {recipe.directions.map((direction , index) => (
                                  <li key={index}>{direction}</li>
                                ))}
                              </ol>
                            ) : (
                              <p>No hay intrucciones disponibles.</p>
                            )}</td>
                        <td>{recipe.cook_time}</td>
                        <td>{recipe.country}</td>
                        <td>{recipe.prep_time}</td>
                        <td>{recipe.price}</td>
                        <td>{recipe.restaurants}</td>
                        <td>
                          <button onClick={() => editrecipes(recipe._ID)} className={editButton} type="submit" name="action">
                            <i className="material-icons ">edit</i>
                          </button>
                        </td>
                        <td>
                          <button onClick={() => deleteData(recipe._ID)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
                            <i className="material-icons ">delete</i>
                          </button>
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
        )
      case 'agruparPorPais':
        return (
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>País</th>
                <th>Cantidad de personas</th>
              </thead>
              <tbody>
                {recipes.map(recipe =>
                      <tr key={recipe._id}>
                        <td className={leftAligned}>{recipe._id}</td>
                        <td>{recipe.total}</td>
                      </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      case 'edadPromedioPorGenero':
        return (
          <div className={scrollableTable}>
          <table className='table'>
            <thead>
              <th>Género</th>
              <th>Edad promedio</th>
            </thead>
            <tbody>
              {recipes.map(recipe =>
                    <tr key={recipe._id}>
                      <td className={leftAligned}>{recipe._id}</td>
                      <td>{recipe.average_age}</td>
                    </tr>
              )}
            </tbody>
          </table>
        </div>
        )
      default:
        return null
    }
  }

  return (
  <div className={crud}>
    <div className='row mt-5'>
      <div className={buttonContainerOptions}>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('verUsuarios')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>person</i> Ver usuarios
        </button>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('agruparPorPais')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>location_city</i> 10 países con más usuarios
        </button>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('edadPromedioPorGenero')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>cake</i> Edad promedio por género
        </button>
      </div>
      {renderTable()}
    </div>
  </div>  
  )
}

export default Recipes