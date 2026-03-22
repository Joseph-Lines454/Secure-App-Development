
import './styles.css'
import banner from './images/website_banner.jpg'
import { BrowserRouter, Route, Routes,Router} from "react-router-dom";

import Logins from './Login';
import RegisterPage from './Register';
import HomePage from './home';
import Finds from './MyFinds'
import Activities from './MyActivities';
import GroupsList from './GroupsDisplay';
import GroupActivities from './ViewPosts';
function App() {
 
  {/*Navigation between different pages*/}
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/home" element={<HomePage/>}/>
        <Route path = "/" element={<Logins/>}/>
        <Route path = "/Register" element={<RegisterPage/>}/>
        <Route path = "/MyFinds" element = {<Finds />} />
        <Route path = "/MyActivities" element={<Activities/>}/>
        <Route path = "/GroupsDisplay" element={<GroupsList/>} />
        <Route path = "/ViewPosts" element = {<GroupActivities/>} />
      </Routes>
     
    </BrowserRouter>
    
    
  );
}

export default App;
