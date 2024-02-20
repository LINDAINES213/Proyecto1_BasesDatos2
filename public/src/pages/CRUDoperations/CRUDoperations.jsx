import { useEffect, useState } from 'react'
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton } from './CRUDoperations.module.css'
import axios from 'axios'

// eslint-disable-next-line react/function-component-definition
const CRUDoperations = () => {
  const [users, setUsers] = useState([])
  const [id, setId] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [contact, setContact] = useState('')

  useEffect(() => {
    axios.get("https://proyecto1bd.onrender.com/users")
      .then((res) => {
        setUsers(res.data)
        setId(0)
        setName('')
        setAge('')
        setGender('')
        setCountry('')
        setContact('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://proyecto1bd.onrender.com/users", {
        name,
        age,
        gender,
        country,
        contact
      }).then(() => {
        fetchData()
        setName('')
        setAge('')
        setGender('')
        setCountry('')
        setContact('')
      })
    } else {
      axios.put(`https://proyecto1bd.onrender.com/users/${id}`, {
        name,
        age,
        gender,
        country,
        contact
      }).then(() => {
        fetchData()
        setName('')
        setAge('')
        setGender('')
        setCountry('')
        setContact('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://proyecto1bd.onrender.com/users/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const editusers = (id) => {
    axios.get(`https://proyecto1bd.onrender.com/editusers/${id}`)
      .then((res) => {
        setName(res.data.name),
        setAge(res.data.age),
        setGender(res.data.gender),
        setCountry(res.data.country),
        setContact(res.data.contact),
        setId(res.data._ID)
      })
  }

  const fetchData = () => {
    axios.get("https://proyecto1bd.onrender.com/users")
      .then((res) => {
        setUsers(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  return (
  <div className={crud}>
    <div className='row mt-5'>
      <div className='col lg-6 mt-5'>
        <h3>Añadir usuario:</h3>
        <form onSubmit={(e) => submit(e, id)}>
            <div className={inputContainer}>
                <i className="material-icons prefix">person</i>
                <input className={inputText} value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Nombre' />
            </div>
            <div className={inputContainer}>
                <i className="material-icons prefix">mail</i>
                <input className={inputText} value={age} onChange={(e) => setAge(e.target.value)} type="age" placeholder='age' />
            </div>
            <div className={inputContainer}>
                <i className="material-icons prefix">vpn_key</i>
                <input className={inputText} value={gender} onChange={(e) => setGender(e.target.value)} type="gender"
                    placeholder='Contraseña' />
                <div className={buttonContainer}>
                    <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action">Submit
                        <i className="material-icons right">send</i>
                    </button>
                </div>
            </div>

        </form>
      </div>
      <div className='col lg-6 mt-5'>
        <table className='table'>
          <thead>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Genero</th>
            <th>Pais</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </thead>
          <tbody>
            {users.map(user =>
                  <tr key={user._ID}>
                    <td className={leftAligned}>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.gender}</td>
                    <td>{user.country}</td>
                    <td>{user.contact.email}</td> {/* Mostrar el email */}
                    <td>{user.contact.phone}</td> {/* Mostrar el teléfono */}
                    <td>
                      <button onClick={() => editusers(user._ID)} className={editButton} type="submit" name="action">
                        <i className="material-icons ">edit</i>
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteData(user._ID)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
                        <i className="material-icons ">delete</i>
                      </button>
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  </div>  
  )
}

export default CRUDoperations
