import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from './js/layouts/Main'
import Sign from './js/layouts/Sign'
import logo from './logo.svg'

const App = (props) => {
  const [cookies] = useCookies(['token', '_rftok'])
  const [token, setToken] = useState(cookies['token'])
  const userDefault =window.localStorage.getItem('personroot') ? JSON.parse(window.localStorage.getItem('personroot')) : ''
  const [isAdmin, setIsAdmin] = useState(userDefault.level && userDefault.level === 0)
  const [userInfo, setUserInfo] = useState(userDefault)

  useEffect(() => {
    if(token &&  token !== 'undefined') {
      const info = token.split('.')[1]
      const infoObj = JSON.parse(atob(info))
      setUserInfo(infoObj)
      window.localStorage.setItem('personroot', JSON.stringify(infoObj))
      setIsAdmin(infoObj.level === 0 ? true : false)
    }
  }, [token])

  const handleAppSetToken = (data) => {
    setToken(data)
  }

  return (
    <Router>
      <Routes>
        <Route path='/*' element={<Main 
                                    appCallback={handleAppSetToken} 
                                    isAdmin={isAdmin} 
                                    userInfo={userInfo} 
                                    token={token} 
                                    logo={logo} 
                                  />} 
        />
        <Route path='accounts/*' element={token ? <Main 
                                                    appCallback={handleAppSetToken}
                                                    userInfo={userInfo} 
                                                    isAdmin={isAdmin} 
                                                    token={token} 
                                                    logo={logo} 
                                                  /> : 
                                                  <Sign 
                                                    appCallback={handleAppSetToken} 
                                                    logo={logo} 
                                                  />} 
          />
      </Routes>
    </Router>
  )
}

export default App
