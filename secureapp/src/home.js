import './styles.css'
import banner from './images/website_banner.jpg'
import badgeOne from './images/BadgeOne.png'
import badgeTwo from './images/BadgeTwo.png'
import badgeThree from './images/BadgeThree.png'

import {Link} from "react-router-dom";
import { useEffect, useState } from 'react';

import {PasswordChecker,EmailCheck} from './errochecking';

function HomePage() {
 
  const[LeaderboardInital, Leaderboard] = useState([]);
  const[findDataInital, FindData] = useState([]);

  const GetLeaderboard = async () =>
    {
  
      
      fetch("http://localhost:5000/GetLeaderboard", {
            
            headers: { "Content-Type": "application/json",
              Accept: 'application/json',
            }
            
          })
          .then((response) => {
            if (response.ok == true)
            {
              return response.json();
            }
            else if (response.status == 400)
            {
              alert("Bad Request");
            }
          }).then((data) => {
            Leaderboard(data);
            console.log(data);
          })
          .catch((error) => {
            alert("Unexpected issue!");
            
          })
          
        }
    


        useEffect(()=> {
          GetLeaderboard();


        }, [false])

        const GetTopFinds = async () =>
          {
        
            
            fetch("http://localhost:5000/topFind", {
                  
                  headers: { "Content-Type": "application/json",
                    Accept: 'application/json',
                  }
                  
                })
                .then((response) => {
                  if (response.ok == true)
                  {
                    return response.json();
                  }
                  else if (response.status == 400)
                  {
                    alert("Bad Request");
                  }
                }).then((data) => {
                  FindData(data);
                  console.log(data);
                })
                .catch((error) => {
                  alert("Unexpected issue!");
                  
                })
                
              }
          
      
      
              useEffect(()=> {
                GetLeaderboard();
                GetTopFinds();
      
              }, [false])






  return (
    <div>
    <div className = "imgBase">
      
      <img alt = "sometext" src = {banner} className = "img" />  
    </div>
    <div className="pagebody">
    

      <div className = "navigationbar">
        
        
       
        <div className='HomeNav'>
        
        <Link to = "/home" className='buttonHome'>Home</Link>
        <Link to = "/MyFinds" className='buttonHome'>My Finds</Link>
        <Link to = "/GroupsDisplay" className='buttonHome'>Groups</Link>
        <Link to = "/MyActivities" className='buttonHome'>My Activties</Link>
        </div>
        
          
      </div>
      <div className = "FindsBody">
        <h1 style = {{textAlign: 'center', backgroundColor: 'azure'}}>Top Finds</h1>
        <div className = "homePage">
        
          <div style = {{}}>
              {findDataInital != undefined && findDataInital.map((data,key) => {
                return (
                  <div key = {key} className = "ContainerHome">
                        <h2 className='FontSizeHomeTitle'>{data.findName}</h2>
                        <img src={data.findImage} className='HomeFinds' style = {{paddingBottom: '10px'}} />
                        
                      </div>
                )




              })}
            
            </div>
            </div>
        <div className = "homePage">
          <div>
          
          
          <h1 className = 'headings' style = {{textAlign: 'center'}}>Leaderboard</h1>
          <table>
            <tbody>
              <tr style = {{backgroundColor: 'white'}}>
                <td style = {{height: '40px'}} className='FontSizeHomeTitle'>Username</td>
                <td style = {{height: '40px'}} className='FontSizeHomeTitle'>Total Finds</td>
                <td style = {{height: '40px'}} className='FontSizeHomeTitle'>Award</td>
              </tr>
              
              {LeaderboardInital != undefined && LeaderboardInital.map((data,key) => {
                return (
                  <tr key = {key} >
                    <td className='FontSizeHome'>{data.username}</td>
                    
                    <td className='FontSizeHome'>{data.Find}</td>
                     {key == 0 && <td><img alt = "sometext" src = {badgeOne} className='awardsStyles' /></td>   }
                     {key == 1 && <td><img alt = "sometext" src = {badgeTwo} className='awardsStyles' /></td>   }
                     {key == 2 && <td><img alt = "sometext" src = {badgeThree} className='awardsStyles' /></td>   }
                  </tr>
                    
                )




              })}
              </tbody>
          </table>
          </div>
        </div>
  </div>
  </div>
  </div>
   
  );
}




export default HomePage;