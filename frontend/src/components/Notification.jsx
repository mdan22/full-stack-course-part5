import PropTypes from 'prop-types'

const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }
  // display success or error message based on success prop
  return (
    <div className={success ? 'success' : 'error'}>
      {message}
    </div>
  )
}

// define PropTypes of Notification component
Notification.propTypes = {
  message: PropTypes.string,
  success: PropTypes.bool.isRequired
}

export default Notification