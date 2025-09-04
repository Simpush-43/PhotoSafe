import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css'
import './Landingpage.css'
import './Createacoount.css'
import './ProfilePAge.css'
import Landingpage from './Pages/Landingpage'
import Createacoount from './Pages/Createacoount'
import ErrorBoundary from './ErrorBoundary'
import ProfilePAge from './Pages/ProfilePAge'
import SendPage from './Pages/SendPage'
import RecivePage from './Pages/RecivePage'
import VerifyOTP from './Pages/VerifyOTP'
function App() {


  return (
    <>
  <Router>
    <ErrorBoundary>
 <Routes>
  <Route path='/' element={<Landingpage/>}/>
 <Route path='/home' element={<Landingpage/>}/>
 <Route path='/home/createacoount' element={<Createacoount/>}/>
 <Route path='/VerifyOTP' element={<VerifyOTP/>}/>
 <Route path='/home/profile' element={<ProfilePAge/>}/>
 <Route path='/home/send' element={<SendPage/>}/>
 <Route path='/home/recive' element={<RecivePage/>}/>
    </Routes>
    </ErrorBoundary>
  </Router>
    </>
  )
}

export default App
