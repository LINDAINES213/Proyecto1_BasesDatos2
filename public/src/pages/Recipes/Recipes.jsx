import { useEffect, useState } from 'react'
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputContainerMenu
 } from './Recipes.module.css'
import { Loading, ElementsMenu, ElementsMenuId } from '../../components'
import axios from 'axios'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [id, setId] = useState(0)
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [directions, setDirections] = useState('')
  const [cook_time, setCook_time] = useState('')
  const [country, setCountry] = useState('')
  const [prep_time, setPrep_time] = useState('')
  const [price, setPrice] = useState('')
  const [restaurants, setRestaurants] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)
  const [menuRestaurants, setMenuRestaurants] = useState([])
  const [newIngredient, setNewIngredient] = useState('')
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [newDirections, setNewDirections] = useState('')
  const [availableDirections, setAvailableDirections] = useState([])
  const [newRestaurants, setNewRestaurants] = useState('')
  const [availableRestaurants, setAvailableRestaurants] = useState([])

  useEffect(() => {
    setRestaurants('[' + menuRestaurants.map(item => `'${item._id}'`).join(', ') + ']')
  }, [menuRestaurants])


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
  
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/recipes")
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
        setMenuRestaurants([])  
        setAvailableDirections([])
        setAvailableIngredients([])   
      })
      .catch((error) => {
        console.error('Error fetching recipes data:', error)
      })
      .finally(() => {
        setLoading(false)
  
        // Luego de que la primera solicitud haya terminado (ya sea exitosa o con error),
        // realiza la segunda solicitud
        axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/check_restaurantsId")
          .then((res) => {
            setAvailableRestaurants(res.data)
          })
          .catch((error) => {
            console.error('Error fetching restaurants data:', error)
          })
      })
  }, [])
  
  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://proyecto-basesdatos2-uvg.koyeb.app/recipes", {
        title,
        ingredients,
        directions,
        cook_time,
        country,
        prep_time,
        price,
        restaurants,
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
        setMenuRestaurants([])  
        setAvailableDirections([])
        setAvailableIngredients([]) 
      })
    } else {
      axios.put(`https://proyecto-basesdatos2-uvg.koyeb.app/recipes/${id}`, {
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
        setMenuRestaurants([])  
        setAvailableDirections([])  
        setAvailableIngredients([])     
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://proyecto-basesdatos2-uvg.koyeb.app/recipes/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const editrecipes = (id) => {
    axios.get(`https://proyecto-basesdatos2-uvg.koyeb.app/editrecipes/${id}`)
      .then((res) => {
        setTitle(res.data.title)
        setIngredients(res.data.ingredients)
        setDirections(res.data.directions)
        setCook_time(res.data.cook_time)
        setCountry(res.data.country)
        setPrep_time(res.data.prep_time)
        setPrice(res.data.price)
        setMenuRestaurants(res.data.restaurants)
        setAvailableDirections(res.data.directions)
        setAvailableIngredients(res.data.ingredients)      
        setId(res.data._ID)
      })
  }

  const fetchData = (limit) => {
    setLoading(true)
  
    const parsedLimit = parseInt(limit)
    const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = isLimitInteger
      ? `https://proyecto-basesdatos2-uvg.koyeb.app/recipes?limit=${limit}`
      : 'https://proyecto-basesdatos2-uvg.koyeb.app/recipes'
  
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
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/recipes_per_country")
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
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/age_average_per_gender")
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
                    <i className="material-icons prefix">local_dining</i>
                    <input className={inputText} value={title} onChange={(e) => setTitle(e.target.value)} type="text"
                    placeholder='Nombre de la receta' />
                </div>
                <div className={inputContainerMenu}>
                    <i className="material-icons prefix">filter_9_plus</i>
                    <ElementsMenu 
                      menu={"Ingredientes"}
                      selectedElements={ingredients}
                      setSelectedElements={setIngredients} 
                      newElement={newIngredient}
                      setNewElement={setNewIngredient} 
                      availableElements={availableIngredients}
                      setAvailableElements={setAvailableIngredients}
                      allowAdd={true}
                      />
                </div>
                <div className={inputContainerMenu}>
                    <i className="material-icons prefix">filter_9_plus</i>
                    <ElementsMenu 
                      menu={"Indicaciones"}
                      selectedElements={directions}
                      setSelectedElements={setDirections} 
                      newElement={newDirections}
                      setNewElement={setNewDirections} 
                      availableElements={availableDirections}
                      setAvailableElements={setAvailableDirections}
                      allowAdd={true}
                      />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">alarm_on</i>
                    <input className={inputText} value={cook_time} onChange={(e) => setCook_time(parseInt(e.target.value,10))} type="number"
                     placeholder='Tiempo de cocina (min)' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">location_on</i>
                    <input className={inputText} value={country} onChange={(e) => setCountry(e.target.value)} type="text" placeholder='País' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">alarm</i>
                    <input className={inputText} value={prep_time} onChange={(e) => setPrep_time(parseInt(e.target.value,10))} type="number"
                      placeholder='Tiempo de preparación (min)' />
                </div>
              </div>
              <div className={formGrid} style={{marginTop: "10px"}}>
                <div className={inputContainer}>
                    <i className="material-icons prefix">local_offer</i>
                    <input className={inputText} value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} type="number"
                      placeholder='Precio ($)' />
                </div>
                <div className={inputContainerMenu}>
                    <i className="material-icons prefix">filter_9_plus</i>
                    <ElementsMenuId
                      menu={"Restaurantes"}
                      selectedElements={menuRestaurants}
                      setSelectedElements={setMenuRestaurants} 
                      newElement={newRestaurants}
                      setNewElement={setNewRestaurants} 
                      availableElements={availableRestaurants}
                      setAvailableElements={setAvailableRestaurants}
                      allowAdd={false}
                      />
                    <div className={buttonContainer} style={{marginLeft: "22.5vw", marginTop: "-2vh"}}>
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
                  <button className=" btn btn-sm btn-primary waves-effect waves-light right"  name="action" 
                  onClick={() => fetchData(limit)}>Limitar 
                    <i className="material-icons prefix" style={{marginLeft: "0.3vw"}}>remove_circle_outline</i>
                  </button>
              </div>
          </div>
          <div className={scrollableTable} style={{maxHeight: "46vh"}}>
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
                        <td>{recipe.restaurants ? (
                              <ol>
                                {recipe.restaurants.map((restaurant) => (
                                  <li key={restaurant.id}>{restaurant.name}</li>
                                ))}
                              </ol>
                            ) : (
                              <p>No hay restaurantes disponibles.</p>
                            )}
                          </td>
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
            <i className="material-icons right" style={{marginRight: "1vh"}}>rotate_left</i> Refrescar
        </button>
      </div>
      {renderTable()}
    </div>
  </div>  
  )
}

export default Recipes
