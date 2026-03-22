import './styles.css'
import banner from './images/website_banner.jpg'

import {Link} from "react-router-dom";
import { useState } from 'react';

import {PasswordChecker,EmailCheck, TextChecker} from './errochecking';

function RegisterPage() {
 
  const[NameInital, Name] = useState("");
  const[EmailInital,Email] = useState("");
  const[UserNameInital, Username] = useState("");
  const [PasswordInital, Password] = useState("");

  return (
    <div>
        <div className = "imgBase">
          
          <img alt = "sometext" src = {banner} className = "img" />  
        </div>
        <div className="pagelog">
        

          <div className = "logonpage">
            
            
            <h1 className = "pageinputitems">Email address</h1>
            <input type = "text"  onChange={(e) => Email(e.target.value)} className = "input" value = {EmailInital}  />
            <h1 className = "pageinputitems">UserName</h1>
            <input type = "text"  onChange={(e) => Username(e.target.value)} className = "input" value = {UserNameInital}  />
            <h1 className = "pageinputitems">Password</h1>
            <input type = "password"  onChange={(e) => Password(e.target.value)} className = "input" value = {PasswordInital}  />
            <div className='forminput'>
            
            <Link to = "/" style = {{backgroundColor: 'green'}}className='button'>Login</Link>
            <Link style = {{backgroundColor: 'Purple'}} onClick={() => RegisterFetch(EmailInital,UserNameInital,PasswordInital)} className='button'>Register</Link>
            </div>
            
              
          </div>
        </div>
    </div>
   
  );
}

function RegisterFetch(EmailInital,UserNameInital,PasswordInital)
{
  //Some error checking on sign up!
  
  var emailCheckV = EmailCheck(EmailInital);
  var passwordCheckV = PasswordChecker(PasswordInital);
  var UserNameV = TextChecker(UserNameInital);
  if (passwordCheckV === true && emailCheckV === true && UserNameV == true)
  {
   
    fetch("http://localhost:5000/signup", {
      method: "POST",
      body: JSON.stringify({email: EmailInital, userName: UserNameInital, password: PasswordInital}),
      headers: { "Content-Type": "application/json"}
    })
    .then((response) => {
      if(response.ok === true){
        alert("User has been successfully uploaded!");
      }
      if (response.status === 403)
      {
        alert("Forbidden");
      }
      if (response.status === 400)
      {
        alert("Email address and/or Username already exists");
      }})
    .catch((error) => {alert("Somthing unexpected went wrong!");})
  }
  else if (passwordCheckV === false)
  {
    alert("Please include: Number:(0-9), CapitalLetter:(A-Z), SpecialCharacters : (+-=><) and ensure that your password is 8 or more characters long.");
  }
  else if (UserNameV == false)
  {
    alert("Letters need to be included!");
  }
  else if (emailCheckV === false) {
    alert("Incorrect format for email");
  }
 
  else{
    console.log("This has not worked");
    alert("Unexpected error");
  }
}
export default RegisterPage;