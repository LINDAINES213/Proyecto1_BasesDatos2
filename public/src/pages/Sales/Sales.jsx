import { useEffect, useState } from 'react'
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputContainerMenu, inputContainerFirst
 } from './Sales.module.css'
 import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Loading, SelectOption } from '../../components'
import axios from 'axios'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [date, setDate] = useState('')
  const [id, setId] = useState(0)
  const [id_recipe, setIdRecipe] = useState('')
  const [recipe, setRecipe] = useState()
  const [newRecipe, setNewRecipe] = useState('')
  const [availableRecipes, setAvailableRecipes] = useState([])
  const [id_restaurant, setIdRestaurant] = useState()
  const [restaurant, setRestaurant] = useState()
  const [newRestaurant, setNewRestaurant] = useState('')
  const [availableRestaurants, setAvailableRestaurants] = useState([])
  const [id_user, setIdUser] = useState('')
  const [user, setUser] = useState()
  const [newUser, setNewUser] = useState('')
  const [availableUsers, setAvailableUsers] = useState([])
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [total, setTotal] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (restaurant && restaurant._id !== undefined) {
      setIdRestaurant(restaurant._id)
    }
    console.log("id_restaurant",id_restaurant)
  }, [restaurant])

  useEffect(() => {
    if (date && date !== undefined) {
      console.log("date",date)
    }
  }, [date])

  useEffect(() => {
    if (recipe && recipe._id !== undefined) {
      setIdRecipe(recipe._id)
      axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/restaurantsIds")
      .then((res) => {
        console.log("user ",res)
        res.data.map(restaurant => {
          if (restaurant._ID === recipe._id){
            setAvailableRestaurants(restaurant.restaurants)
          }
        })
      })
      .catch((error) => {
        console.error('Error fetching restaurants data:', error)
      })
    }
    console.log("id_recipe",id_recipe)
  }, [recipe])

  useEffect(() => {
    if (price && price !== undefined && quantity && quantity !== undefined) {
      setTotal(price*quantity)
    }
    console.log("total",total)
  }, [price, quantity])

  useEffect(() => {
    if (user && user._id !== undefined) {
      setIdUser(user._id)
    }
    console.log("id_user",id_user)
  }, [user])

  const handleButtonClick = (option) => {
    setSelectedOption(option)
    switch (option) {
      case 'verUsuarios':
        fetchData()
        setLimit()
        break
      case 'totalVentasPorReceta':
        fetchTotalSalePerRecipe()
        break
      case 'totalVentasPorRestaurantePorMes':
        fetchTotalSalePerRestaurantPerMonth()
        break
      case 'totalVentasPorPais':
        fetchTotalSalePerCountry()
        break
      default:
        console.log("Error fetching data")
    }
  }

  useEffect(() => {
    setLoading(true)
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/sales")
      .then((res) => {
        setSales(res.data)
        console.log("res", res.data)
        setId(0)
        setDate('')
        setIdRecipe('')
        setIdRestaurant('')
        setIdUser('')
        setQuantity('')
        setPrice('')
        setTotal('')
        setRecipe('')
        setRestaurant('')
        setUser('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
        axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/check_recipeId")
        .then((res) => {
          console.log("recipes",res)
          setAvailableRecipes(res.data)
        })
        .catch((error) => {
          console.error('Error fetching restaurants data:', error)
        }).finally(()=>{
          axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/check_usersId")
          .then((res) => {
            console.log("user ",res)
            setAvailableUsers(res.data)
          })
          .catch((error) => {
            console.error('Error fetching restaurants data:', error)
          })
        })
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("http://127.0.0.1:5000/sales", {
      date,
      id_recipe,
      id_restaurant,
      id_user,
      quantity,
      price,
      total,  
      }).then(() => {
        fetchData()
        setDate('')
        setIdRecipe('')
        setRecipe('')
        setRestaurant('')
        setUser('')
        setIdRestaurant('')
        setRestaurant('')
        setIdUser('')
        setQuantity('')
        setPrice('')
        setTotal('')
      })
    } else {
      axios.put(`https://proyecto-basesdatos2-uvg.koyeb.app/sales/${id}`, {
        date,
        id_recipe,
        id_restaurant,
        id_user,
        quantity,
        price,
        total, 
      }).then(() => {
        fetchData()
        setDate('')
        setIdRecipe('')
        setRecipe('')
        setRestaurant('')
        setUser('')
        setIdRestaurant('')
        setIdUser('')
        setQuantity('')
        setPrice('')
        setTotal('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://proyecto-basesdatos2-uvg.koyeb.app/sales/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const editusers = (id) => {
    axios.get(`http://127.0.0.1:5000/editsales/${id}`)
      .then((res) => {
        console.log("edit",res)
        setDate(res.data.date)
        setRecipe(res.data.id_recipe[0]),
        setRestaurant(res.data.id_restaurant[0]),
        setUser(res.data.id_user[0]),
        setQuantity(res.data.quantity),
        setPrice(res.data.price)
        setTotal(res.data.total)
        setId(res.data._ID)
      })
  }

  const fetchData = (limit) => {
    setLoading(true)
  
    const parsedLimit = parseInt(limit)
    const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = isLimitInteger
      ? `https://proyecto-basesdatos2-uvg.koyeb.app/sales?limit=${limit}`
      : 'https://proyecto-basesdatos2-uvg.koyeb.app/sales'
  
    axios.get(url)
      .then((res) => {
        setSales(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })  
  }
  
  
  const fetchTotalSalePerRecipe = () => {
    setLoading(true)
    axios.get("http://127.0.0.1:5000/total_sales_per_recipe")
      .then((res) => {
        setSales(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchTotalSalePerRestaurantPerMonth = () => {
    setLoading(true)
    axios.get("http://127.0.0.1:5000/total_sales_per_restaurant_month")
      .then((res) => {
        console.log("Per Month",res)
        setSales(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchTotalSalePerCountry = () => {
    setLoading(true)
    axios.get("http://127.0.0.1:5000/sold_recipes_per_country")
      .then((res) => {
        console.log("Per Country",res)
        setSales(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDateChange = (date) => {
    setDate(date.toISOString().split('T')[0])
  }



  const renderTable = () => {
    if (loading) {
      console.log("info", sales)
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
            <h3>Añadir venta:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainerFirst}>
                  <div style={{marginBottom: '2vh'}}>
                    <i className="material-icons prefix">local_dining</i>
                  </div>
                    <SelectOption
                      menu={"Receta a seleccionar"}
                      selectedOption={recipe}
                      setSelectedOption={setRecipe}
                      newOption={newRecipe}
                      setNewOption={setNewRecipe}
                      availableOptions={availableRecipes}
                      setAvailableOptions={setAvailableRecipes}
                      allowAdd={false}
                  />
                </div>
                <div className={inputContainerMenu}>
                  <div style={{marginBottom: '2vh'}}>
                    <i className="material-icons prefix">filter_9_plus</i>                      
                  </div>
                  <SelectOption
                      menu={"Restaurante a seleccionar"}
                      selectedOption={restaurant}
                      setSelectedOption={setRestaurant}
                      newOption={newRestaurant}
                      setNewOption={setNewRestaurant}
                      availableOptions={availableRestaurants}
                      setAvailableOptions={setAvailableRestaurants}
                      allowAdd={false}
                  />
                </div>
                <div className={inputContainerMenu}>
                  <div style={{marginBottom: '2vh'}}>
                    <i className="material-icons prefix">wc</i>
                  </div>
                    <SelectOption
                      menu={"Usuario a seleccionar"}
                      selectedOption={user}
                      setSelectedOption={setUser}
                      newOption={newUser}
                      setNewOption={setNewUser}
                      availableOptions={availableUsers}
                      setAvailableOptions={setAvailableUsers}
                      allowAdd={false}
                  />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <i className="material-icons prefix">wc</i>
                    <input className={inputText} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value,10))} 
                      type="number" placeholder='Cantidad' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">wc</i>
                    <DatePicker
                      selected={date}
                      onChange={handleDateChange}
                      className={inputText}
                      dateFormat="yyyy-MM-dd" // Establece el formato de fecha deseado
                      placeholderText="Fecha YYYY-MM-DD"
                    />
                </div>
                <div className={inputContainer}>
                <i className="material-icons prefix">local_offer</i>
                    <input className={inputText} value={price} onChange={(e) => setPrice(parseInt(e.target.value,10))} 
                      type="number" placeholder='Precio ($)' />
                    <div className={buttonContainer}>
                        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action">Enviar 
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </div>
              </div>
            </form>
          </div>
          <h4>Limitar cantidad de ventas a mostrar:</h4>
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
                <th>Id de venta</th>
                <th>Fecha de venta</th>
                <th>Id de la receta</th>
                <th>Id del restaurante</th>
                <th>Id del usuario</th>
                <th>Precio ($)</th>
                <th>Cantidad</th>
                <th>Total ($)</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {sales.map(sale =>
                      <tr key={sale._ID}>
                        <td className={leftAligned}>{sale._ID}</td>
                        <td>{sale.date}</td>
                        { sale.id_recipe[0] && <td key={sale.id_recipe[0].id}>{sale.id_recipe[0].title + ` - ` +  sale.id_recipe[0].id}</td> }
                        { sale.id_restaurant[0] && 
                          <td key={sale.id_restaurant[0].id}>{sale.id_restaurant[0].name + ` - ` + sale.id_restaurant[0].id}</td> }
                        { sale.id_user[0] && <td key={sale.id_user[0].id}>{sale.id_user[0].name + ` - ` + sale.id_user[0].id}</td> }
                        <td>{sale.price}</td>
                        <td>{sale.quantity}</td>
                        <td>{sale.total}</td>
                        <td>
                          <button onClick={() => editusers(sale._ID)} className={editButton} type="submit" name="action">
                            <i className="material-icons ">edit</i>
                          </button>
                        </td>
                        <td>
                          <button onClick={() => deleteData(sale._ID)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
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
      case 'totalVentasPorReceta':
        return (
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>Receta</th>
                <th>Total de ventas</th>
              </thead>
              <tbody>
                {sales.map(sale =>
                  <tr key={sale._id}>
                    <td className={leftAligned}>{sale._id}</td>
                    <td>{sale.total_sales}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      case 'totalVentasPorRestaurantePorMes': 
        return (
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>Restaurante</th>
                <th>Mes</th>
                <th>Total de ventas</th>
              </thead>
              <tbody>
                {sales.map(sale =>
                  <tr key={sale._id}>
                    { sale._id && <td className={leftAligned}>{sale._id.restaurant}</td> }
                    { sale._id && <td className={leftAligned}>{sale._id.month}</td> }
                    <td>{sale.total_sales}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )      
      case 'totalVentasPorPais': 
        return (
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>País</th>
                <th>Receta</th>
                <th>Total de ventas</th>
              </thead>
              <tbody>
                {sales.map(sale =>
                  <tr key={sale._id}>
                    { sale._id && <td className={leftAligned}>{sale._id.country}</td> }
                    { sale._id && <td className={leftAligned}>{sale._id.recipe}</td> }
                    <td>{sale.total_ventas}</td>
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
            <i className="material-icons right" style={{marginRight: "1vh"}}>local_dining</i> Ver ventas
        </button>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('totalVentasPorReceta')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>monetization_on</i> Total de ventas por receta
        </button>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('totalVentasPorRestaurantePorMes')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>pie_chart</i> Total de ventas por restaurante por mes
        </button>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('totalVentasPorPais')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>language</i> Los 10 países con más ingresos por ventas</button>
      </div>
      {renderTable()}
    </div>
  </div>  
  )
}

export default Sales
