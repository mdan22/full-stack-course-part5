// extract the toggle funvtionality into a seperate component
import { useState, forwardRef, useImperativeHandle } from "react"

// the fct that creates component is wrapped inside a
// forwardRef fct call -> the component can access the ref(s)
const Togglable = forwardRef((props, refs) => {
    // state 'visible' = visibility of props.children (here: LoginForm) 
    // set default to false, meaning not visible: 
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
      setVisible(!visible)
    }

    // useImperativeHandle hook is used to expose/make...available
    // toggleVisibility fct to the parent component
    useImperativeHandle(refs, () => {
      return {
        toggleVisibility
      }
    })

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => toggleVisibility()}>{props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
        {/* props.children is automatically added by React and always exists */}
          {props.children}
          <button onClick={() => toggleVisibility()}>cancel</button>
        </div>
      </div>
    )
  }
)

// Set the display name for the component
Togglable.displayName = 'Togglable'

export default Togglable