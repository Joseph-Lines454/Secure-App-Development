import './styles.css'
import banner from './images/website_banner.jpg'

import {Link,Navigate} from "react-router-dom";
import { use, useState} from 'react';
import {PasswordChecker,TextChecker} from './errochecking';
import Cookies from 'js-cookie';

function Logins() {
  
  {/*Checks the users details and checks if username and password is correct*/}
  const[redirectinital,redirect] = useState(false);
  const[data, data1] = useState(false);
  function LoginFetch(username,password)
  {
    
    if (PasswordChecker(password) == true && TextChecker(username) == true)
    {
      fetch("http://localhost:5000/logon", {
        method: "POST",
       
        
        credentials: 'include',
        withCredntials: true,
        
        body: JSON.stringify({username: username, password: password}),
        headers: { "Content-Type": "application/json",
          Accept: 'application/json',
          
        }
        
      })
      .then((response) => {
        if (response.ok == true)
        {
          Cookies.set(response.headers.getSetCookie());
          redirect(true);
        }
        else if (response.status == 400)
        {
          alert("Invalid Login!");
          
        }
        else if (response.status == 401)
        {
          alert("Unauthorized!");
        }
    
    
      })
      .catch((error) => {
        alert("Unexpected issue!");
        
      })
    }
    else if (PasswordChecker(password) == false)
    {
      alert("The password has to be 8 or more characters with special characters, the username has to be more than 4 characters and less than 26");
      
    }
    else if (TextChecker(username) == false)
    {
      alert("The username does not include letters");
    }
    
    
    
    
  }


  console.log(data)
  const [usernameInital, username] = useState("Username");
  const [passwordInital, password] = useState("Password");

  return (
    
       <div>
        {/*If the users input is correct, redirect them to the homepage */}
        {redirectinital == true ? (
          <Navigate to ="/home" />) : (
            <div>
               {/*Logo */}
            <div className = "imgBase">
          
          <img alt = "here is the alt text!" src = {banner} className = "img" />  
        </div>
        <div className="pagelog">
        
           {/*Gets the username and password*/}
          <div className = "logonpage">
            <form>
              <h1 className = "pageinputitems">Username</h1>

              <input type = "text"  onChange={(e) => username(e.target.value)} className = "input" value = {usernameInital}  />
              
              <h1 className = "pageinputitems">Password</h1>
              <input type = "password"  onChange={(e) => password(e.target.value)} className = "input" value = {passwordInital}  />
            </form>
            <div className='forminput'>
            <Link style = {{backgroundColor: 'Purple'}} to = "/Register" className='button'>Register</Link>
            <Link style = {{backgroundColor: 'Green'}} onClick={() => LoginFetch(usernameInital,passwordInital)}
             className='button'>Login</Link>
            
            
            </div>
            
              
          </div>
        </div>
        </div>
          )}
        </div>
   
  );
}
export default Logins;