const Notification = ({ message, success }) => {
    if (message === null) {
        return null
    }
    // display success or error message based on success prop
    return (
        <div className={success ? "success" : "error"}>
            {message}
        </div>
    )
}

export default Notification;