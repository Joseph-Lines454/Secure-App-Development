import './styles.css'
import banner from './images/website_banner.jpg'

import {Route,Await, data, Link, useLocation, useParams} from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

import {PasswordChecker,EmailCheck} from './errochecking';
import { getDefaultNormalizer } from '@testing-library/dom';
import React from 'react'





const GroupActivities = () => {
  //const datavar;
  
  
  //const {state} = props.location;
  //const {GroupID,GroupName} = state;
  
  const location = useLocation();
  // this is that data
  const data = location.state.GroupID
  const data2 = location.state.GroupName
  const data3 = location.state.groupImage
  const [AcitivitiesUploadOptionsInital, AcitivitiesUploadOptions] = useState([]);
  const[ActivityNameInital, ActivityName] = useState("");
  const [imageInital,image] = useState(null);
  const[dataActivitiesInital,getActivitiesData] = useState([]);
  
  const reader  = new FileReader();
  const [testResultInital,testResult] = useState("");
  const [blobToDataInital,blobToData] = useState("");
  

  const GetDetails = async () =>
  {
    fetch("http://localhost:5000/GetUserActivitesForUpload", {
          method: "POST",
        
          credentials: 'include',
          withCredntials: true,
          
          body: JSON.stringify({GroupID: data}),
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
            
          }})
          .then((data) => {
            AcitivitiesUploadOptions(data);
            console.log(data);
          })
        .catch((error) => {
          alert("Unexpected issue!");
          
        })

  }

  const GetGroupActivities = async () =>
    {
      try{
        fetch("http://localhost:5000/GetActivitiesGroup", {
           method: "POST",
          credentials: 'include',
          withCredntials: true,
          body: JSON.stringify({GroupID: data}),
          headers: { "Content-Type": "application/json",
            Accept: 'application/json',
          }
        })
        .then((response) => {
          if(response.ok === true){
            
            
            //response = response.json();
            return response.json();
          }
          if (response.status === 403)
          {
            alert("Forbidden");
          }
          if (response.status === 400)
          {
            alert("Bad Request");
          }})
          .then((data) => {
            getActivitiesData(data);
            console.log(data);
          })
        .catch((error) => {alert("Somthing unexpected went wrong!");})
      }
      catch(error)
      {
        alert("Somthing unexpected went wrong!");
      }
    }

    const UploadAcitivityToGroup = async (ActivityIDUpload) =>
      {
        try{
          fetch("http://localhost:5000/UploadActivitiesGroup", {
             method: "POST",
            credentials: 'include',
            withCredntials: true,
            body: JSON.stringify({GroupID: data,ActivityID: ActivityIDUpload}),
            headers: { "Content-Type": "application/json",
              Accept: 'application/json',
            }
          })
          .then((response) => {
            if(response.ok === true){
              GetDetails();
              GetGroupActivities();
              
            }
            if (response.status === 403)
            {
              alert("Forbidden");
            }
            if (response.status === 400)
            {
              alert("Bad Request");
            }})
            
          .catch((error) => {alert("Somthing unexpected went wrong!");})
        }
        catch(error)
        {
          alert("Somthing unexpected went wrong!");
        }
      }




  useEffect(() => {
    GetGroupActivities();
    GetDetails();
  }, [false]);
  
  


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
          <h1 className= "ActivitsBodyContent">{data2}</h1>
          <img className = '' src={data3} style = {{paddingBottom: '10px'}} />
            <div className = "logonpage">
                        
                      {/*Gets the finds which have not been uploaded to the group and displays them*/}
                        <h1 className = "pageinputitems">Upload All of Your Finds!</h1>
                        <button className = 'UploadActivities button'>Upload Finds</button>
                        <div className = "ScrollActivitiesUpload">
                          {AcitivitiesUploadOptionsInital.map((data,key) => {
                          return (
                            <div key = {key} className = "DropDownStyle" >
                              <div className = 'DropDownWidth'>
                              <p style = {{textAlign: 'center', wordWrap: 'break-word'}}>{data.activityname}</p>
                              </div>
                              <div className = 'DropDownWidth Disapear' style = {{width: '33.3%'}}>
                                <img src={data.activityImage} style = {{height: 50, width: 50,marginTop: '5px', marginBottom: '5px',}} className = "ImageDis" />
                              </div>
                              <div className = 'DropDownWidth'>
                                <button style = {{backgroundColor: 'blue'}} className='button' onClick={() => UploadAcitivityToGroup(data.UserActivitiesID)}> Upload Find</button>
                              </div>
                              
                              </div>
                          )
                          })}

                        </div>



                        {/*e
                           <input type = "text"  onChange={(e) => ActivityName(e.target.value)} className = "input" value = {ActivityNameInital}  />
                        
                        */}
                       
                     
                        
                      </div>
          <h1 className= "FindBodyContent">Activities</h1>  
          <div>
            {dataActivitiesInital.map((data,key) => {
              return (
                <div key = {key} >
                  <h2>{data.activityname}</h2>
                  <img src={data.activityImage} />
                  <div className='ActivityContentContainer'>
                  <p className='activityDesctiption'>{data.ActivityDescription}</p>
                  </div>
                  <h2>Posted By: {data.username}</h2>
                  </div>
              )
            })}
          </div>
        </div>
    </div>
</div>
  );
}


export default GroupActivities;