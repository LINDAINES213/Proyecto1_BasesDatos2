import { useEffect, useState } from 'react'
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Sales.module.css'
import { Loading } from '../../components'
import axios from 'axios'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [id, setId] = useState(0)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [stars, setStars] = useState(1)
  const [Female, setFemale] = useState('')
  const [Male, setMale] = useState('')
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
      case 'agruparPorEstrellasPromedio':
        fetchDataStarsAvgPerCuisine()
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
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/sales")
      .then((res) => {
        setSales(res.data)
        setId(0)
        setName('')
        setCountry('')
        setStars(1)
        setFemale('')
        setMale('')
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
      axios.post("https://proyecto-basesdatos2-uvg.koyeb.app/sales", {
        name,
        country,
        stars,
        employees_quantity: {
          Female,
          Male
        }
      }).then(() => {
        fetchData()
        setName('')
        setCountry('')
        setStars(1)
        setFemale('')
        setMale('')
      })
    } else {
      axios.put(`https://proyecto-basesdatos2-uvg.koyeb.app/sales/${id}`, {
        name,
        country,
        stars,
        employees_quantity: {
          Female,
          Male
        }
      }).then(() => {
        fetchData()
        setName('')
        setCountry('')
        setStars(1)
        setFemale('')
        setMale('')
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
    axios.get(`https://proyecto-basesdatos2-uvg.koyeb.app/editsales/${id}`)
      .then((res) => {
        setName(res.data.name),
        setCountry(res.data.country),
        setStars(res.data.stars),
        setFemale(res.data.employees_quantity.Female),
        setMale(res.data.employees_quantity.Male)
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
  
  
  const fetchDataStarsAvgPerCuisine = () => {
    setLoading(true)
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/stars_average_per_cuisine")
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

  const fetchDataAvgAgePerGender = () => {
    setLoading(true)
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/age_average_per_gender")
      .then((res) => {
        console.log("res",res)
        setSales(res.data)
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
                <div className={inputContainer}>
                    <i className="material-icons prefix">local_dining</i>
                    <input className={inputText} value={name} onChange={(e) => setName(e.target.value)} type="text" 
                      placeholder='Nombre del restaurante' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">language</i>
                    <input className={inputText} value={country} onChange={(e) => setCountry(e.target.value)} type="text" placeholder='País' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">grade</i>
                    <input 
                      className={inputTextSlider}
                      type="range"
                      id="ratingSlider"
                      min="1"
                      max="5"
                      step="1"
                      value={stars}
                      onChange={(e) => setStars(parseInt(e.target.value, 10))}
                    />
                    <label htmlFor="ratingSlider">{stars}</label>
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <i className="material-icons prefix">wc</i>
                    <input className={inputText} value={Female} onChange={(e) => setFemale(parseInt(e.target.value,10))} 
                      type="number" placeholder='Cantidad mujeres' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">wc</i>
                    <input className={inputText} value={Male} onChange={(e) => setMale(e.target.value)} type="number"
                        placeholder='Cantidad hombres' />
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
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {sales.map(sale =>
                      <tr key={sale._ID}>
                        <td className={leftAligned}>{sale._ID}</td>
                        <td>{sale.date}</td>
                        <td>{sale.id_recipe}</td>
                        <td>{sale.id_restaurant}</td>
                        <td>{sale.id_user}</td>
                        <td>{sale.quantity}</td>
                        <td>{sale.price}</td>
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
      case 'agruparPorEstrellasPromedio':
        return (
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>País</th>
                <th>Estrellas promedio</th>
              </thead>
              <tbody>
                {sales.map(sale =>
                  <tr key={sale._id}>
                    <td className={leftAligned}>{sale._id}</td>
                    <td>{sale.avg_stars}</td>
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
          onClick={() => handleButtonClick('agruparPorEstrellasPromedio')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>grade</i> Promedio de estrellas por país
        </button>
      </div>
      {renderTable()}
    </div>
  </div>  
  )
}

export default Sales
