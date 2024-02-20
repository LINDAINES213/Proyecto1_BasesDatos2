import { useEffect, useState } from 'react'
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton } from './CRUDoperations.module.css'
import axios from 'axios'

// eslint-disable-next-line react/function-component-definition
const CRUDoperations = () => {
  const [users, setUsers] = useState([])
  const [id, setId] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    axios.get("https://proyecto1bd.onrender.com/ver")
      .then((res) => {
        setUsers(res.data)
        setId(0)
        setName('')
        setEmail('')
        setPassword('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://proyecto1bd.onrender.com/ver", {
        name,
        email,
        password
      }).then(() => {
        fetchData()
        setName('')
        setEmail('')
        setPassword('')
      })
    } else {
      axios.put(`https://proyecto1bd.onrender.com/${id}`, {
        name,
        email,
        password
      }).then(() => {
        fetchData()
        setName('')
        setEmail('')
        setPassword('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://proyecto1bd.onrender.com/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const edit = (id) => {
    axios.get(`https://proyecto1bd.onrender.com/edit/${id}`)
      .then((res) => {
        setName(res.data.name),
        setEmail(res.data.email),
        setPassword(res.data.password),
        setId(res.data._ID)
      })
  }

  const fetchData = () => {
    axios.get("https://proyecto1bd.onrender.com/ver")
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
                <input className={inputText} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' />
            </div>
            <div className={inputContainer}>
                <i className="material-icons prefix">vpn_key</i>
                <input className={inputText} value={password} onChange={(e) => setPassword(e.target.value)} type="password"
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
            <th>Email</th>
            <th>Contraseña</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </thead>
          <tbody>
            {users.map(user =>
                  <tr key={user._ID}>
                    <td className={leftAligned}>{user.name}</td>
                    <td className={leftAligned}>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <button onClick={() => edit(user._ID)} className={editButton} type="submit" name="action">
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
