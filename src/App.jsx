

//import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './Components/LoginForm/LoginForm'
import HomePage from './Components/HomePage/HomePage'

function App() {
 

  return (

    <div className='App'>
    <Router>
        <Routes>
            <Route path = '/' element = {<LoginForm />} />
            <Route path = '/home' element = {<HomePage />} />
        </Routes>
    </Router>
      
    </div>
  )
}

export default App
