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
function App() {


  return (
    <>
  <Router>
    <ErrorBoundary>
 <Routes>
  <Route path='/' element={<Landingpage/>}/>
 <Route path='/home' element={<Landingpage/>}/>
 <Route path='/home/createacoount' element={<Createacoount/>}/>
 <Route path='/home/profile' element={<ProfilePAge/>}/>
 <Route path='/home/send' element={<SendPage/>}/>
    </Routes>
    </ErrorBoundary>
  </Router>
    </>
  )
}

export default App
