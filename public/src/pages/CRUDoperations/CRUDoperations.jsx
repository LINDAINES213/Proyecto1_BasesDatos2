import { useEffect, useState } from 'react'
import { crud } from './CRUDoperations.module.css'
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
        <form onSubmit={(e) => submit(e, id)}>
            <div className="input-field col s12">
              <i className="material-icons prefix">person</i>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Name' />
            </div>
            <div className="input-field col s12">
              <i className="material-icons prefix">mail</i>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter Email' />
            </div>
            <div className="input-field col s12">
              <i className="material-icons prefix">vpn_key</i>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter Password' />
            </div>
            <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action">Submit
              <i className="material-icons right">send</i>
            </button>
          </form>
      </div>
      <div className='col lg-6 mt-5'>
        <table className='table'>
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Edit</th>
            <th>Delete</th>
          </thead>
          <tbody>
            {users.map(user =>
                  <tr key={user._ID}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <button onClick={() => edit(user._ID)} className="btn btn-sm btn-primary" type="submit" name="action">
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
