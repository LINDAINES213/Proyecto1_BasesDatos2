/*
import { buttonContainer, inputContainer, inputText, selectText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit
 } from './Profiles.module.css'
import axios from 'axios'
Loading, */
import { useEffect, useState } from 'react'
import { UserProfileCard } from '../../components'
import { container } from './Profiles.module.css'
import axios from 'axios'

const Profiles = () => {
  const [users, setUsers] = useState([])
  const [id, setId] = useState(0)
  const [userImage, setUserImage] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState()
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios.get("http://127.0.0.1:5000/usersImage")
      .then((res) => {
        console.log("res", res.data)
        setUsers(res.data)
        setId(0)
        setName('')
        setAge('')
        setCountry('')
        setEmail('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
        getImage()
      })
  }, [])

  const getImage = ()=> {
    axios.get(`http://127.0.0.1:5000/usersImage/65e0af3f10b741c51e0d9233`)
      .then((res) => {
        console.log("image", res)
        setUserImage(res.data.image_url)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  } 

  const editImage = (id, file)=> {
    const formData = new FormData()
    formData.append('profile_image', file)
    setLoading(false)
    axios.put(`http://127.0.0.1:5000/usersImage/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then((res) => {
        console.log('Image uploaded:', res.data)
      })
      .catch((error) => {
        console.error('Error uploading image:', error)
      }).finally(() => {
        setLoading(false)
        getImage()
      })
  } 

  
  return (
    <div className={container}>
      {users.map(user => 
        <UserProfileCard
          key={user._ID}
          IDImage={user.profile_image}
          image={`http://127.0.0.1:5000/usersImage/${user.profile_image}`}
          name={user.name}
          age={user.age}
          contact={user.contact.email}
          country={user.country}
          selectedFile={selectedFile}
          id={id}
          setId={setId}
          setSelectedFile={setSelectedFile}
          editImage={editImage}
          loadingImage={loading}
        />  
      )}
    </div>
  )
}

export default Profiles
