import { useState } from 'react'
import PropTypes from 'prop-types'
import './UserProfileCard.css'

const UserProfileCard = ({ IDImage, image, name, age, contact, country, selectedFile, setSelectedFile, id, setId, editImage}) => {
  const [editMode, setEditMode] = useState(false)

  const handleEditClick = () => {
    setEditMode(!editMode)
    setSelectedFile(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    setId(IDImage)
    editImage(IDImage, file)
  }

  const handleFileUpload = () => {
    setEditMode(false)
    console.log('Nuevo archivo:', selectedFile)
    // Aquí puedes realizar la lógica para cargar el archivo.
  }

  return (
    <div className={`user-profile-card ${editMode ? 'edit-mode' : ''}`}>
      <div className="user-profile-image">
        {editMode ? (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ textAlign: 'left' }}
            />
            <div className='button-container2' style={{ marginTop: '0.5vh' }}>
              <button className='button2'onClick={handleFileUpload}><i className="material-icons right">save</i></button>
            </div>
          </div>
        ) : (
          <img className='image' src={image} alt={name} />
        )}
      </div>
      <div className="user-profile-details">
        <h2>{name}</h2>
        <p><strong>Edad:</strong> {age}</p>
        <p><strong>Contacto:</strong> {contact}</p>
        <p><strong>País:</strong> {country}</p>
        <div className='button-container'>
          <button onClick={handleEditClick}>
            {editMode ? <i className="material-icons right">cancel</i> : <i className="material-icons right">create</i>}
          </button>
        </div>
      </div>
    </div>
  )
}

UserProfileCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  contact: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
}

export default UserProfileCard
