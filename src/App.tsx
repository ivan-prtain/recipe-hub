import logo from './logo.svg';
import Login from './components/Login/Login';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import RegisterForm from './components/Login/RegisterForm';
import Homepage from './components/Homepage/Homepage';
import { useEffect, useState } from 'react';

export type AppUserType = {
  id: string,
  recipeIds: string[],
  name: string,
  email: string
}

function App() {

  const [appUser, setAppUser] = useState<AppUserType | null>()
  const [loginChecked, setLoginChecked] = useState(false)

  const logout = () => {
    setAppUser(null)
    localStorage.removeItem('appUser')
  }

  useEffect(() => {
    if (!appUser) {
      const storedUser = localStorage.getItem('appUser');
      console.log("from start page")
      console.log(storedUser)
      if (storedUser) {
        const parsedStoredUser = JSON.parse(storedUser);
        setAppUser(parsedStoredUser);
      }
    }

    setLoginChecked(true)

  }, [appUser])

  if (!loginChecked) {
    return <div></div>
  }



  return (
    <Router>
      <div className="App">
        <header >
          {appUser && <button onClick={logout}>logout</button>}
        </header>
        <Routes>
          <Route
            path='/'
            element={appUser ? <Homepage /> : <Login onLogin={setAppUser} />}
          />

          <Route
            path='/register'
            element={<RegisterForm />}
          />

        </Routes>



      </div>
    </Router>

  );
}

export default App;
