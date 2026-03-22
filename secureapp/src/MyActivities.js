import './styles.css'
import banner from './images/website_banner.jpg'

import {Await, data, Link} from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

import {PasswordChecker,EmailCheck} from './errochecking';
import { getDefaultNormalizer } from '@testing-library/dom';
import { TextChecker,DescriptionChecker } from './errochecking';





function Activities() {
  

  const[ActivityNameInital, ActivityName] = useState("");
  const [imageInital,image] = useState(null);
  const[dataActivityInital,getActivityData] = useState([]);
  
  const reader  = new FileReader();
  const [testResultInital,testResult] = useState("");
  const [blobToDataInital,blobToData] = useState("");
  const[ActivityDescriptionInital,activityDescription] = useState("");

  
  
  const GetImage = async(event) => {
    image(event.target.files[0]);

    
    const data = event.target.files[0];
    const DATAA = (data) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(data)
      })
    }
    
    
    blobToData(await DATAA(data));
    
   
   
    
  };

  const UploadActivity = async (blobToDataInital,ActivityNameInital, ActivityDescriptionInital) =>
  {
    {/*Upload the users activities, includes error checking*/}
    if (TextChecker(ActivityNameInital) == false)
    {
      alert("The group Name has to be 4 or more and less than 26 characters!");
    }
    else if (blobToDataInital == "")
    {
        alert("Please upload an image");
    }
    else if (DescriptionChecker(ActivityDescriptionInital) == false)
    {
      alert("Maximum of 200 words");
    }
    else if (TextChecker(ActivityNameInital) == true && blobToDataInital != "" && DescriptionChecker(ActivityDescriptionInital) == true ){

    fetch("http://localhost:5000/UserActivitiesUpload", {
          method: "POST",
        
          credentials: 'include',
          withCredntials: true,
          
          body: JSON.stringify({Image: blobToDataInital, ActivityName: ActivityNameInital, ActvityDescription: ActivityDescriptionInital}),
          headers: { "Content-Type": "application/json",
            Accept: 'application/json',
          }
          
        })
        .then((response) => {
          if (response.ok == true)
          {
            alert("Successfull!")
          }
          else if (response.status == 400)
          {
            alert("Bad Request");
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
  }

  const GetActivitys = async (OrderBy)=>
    {
      {/*Get activities based on Order that the user chooses*/}
      if(OrderBy == undefined)
      {
        OrderBy = "ASC";
      }
      try{
        fetch("http://localhost:5000/UserActivitiesGet", {
           method: "POST",
            
            credentials: 'include',
            withCredntials: true,
            body: JSON.stringify({OrderByUpload: OrderBy}),
          headers: { "Content-Type": "application/json",
            Accept: 'application/json',
          }
        })
        .then((response) => {
          if(response.ok === true){
        
            return response.json();
          }
          if (response.status === 401)
          {
            alert("Forbidden");
          }
          if (response.status === 400)
          {
            alert("Bad Request");
          }})
          .then((data) => {
            getActivityData(data);
          })
        .catch((error) => {alert("Somthing unexpected went wrong!");})
      }
      catch(error)
      {
        alert("Somthing unexpected went wrong!");
      }
    }

  
  const File = useRef(null);
  const OnButtonClick = () => {
    File.current.click();
  }

  useEffect(() => {
    GetActivitys();
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
          <h1 className= "ActivitsBodyContent">Activities Name</h1>
          
            <div className = "logonpage">
                        
                      
                        <h1 className = "pageinputitems">Activity Name</h1>
                        <input type = "text"  onChange={(e) => ActivityName(e.target.value)} className = "input" value = {ActivityNameInital}  />
                        <h1 className = "pageinputitems">Activity Description</h1>
                        <textarea type = "text"  onChange={(e) => activityDescription(e.target.value)}  value = {ActivityDescriptionInital}  />
                        <h1 className = "pageinputitems">Activity Image</h1>
                        {imageInital != null && <img src = {URL.createObjectURL(imageInital)} style = {{width: 'min(20em, 50vw)'}} />}
                        <div className='forminput'>
                          <Link className='button' onClick={OnButtonClick} style = {{backgroundColor: 'blue'}}>Browse</Link>
                          <input id = "image" type ="file" style ={{display: 'none'}} onChange={GetImage} ref = {File} />
                        
                        <Link onClick={() => UploadActivity(blobToDataInital,ActivityNameInital,ActivityDescriptionInital)} style = {{backgroundColor: 'Purple'}} className='button'>Upload</Link>
                        </div>
                        
                          
                      </div>



          <h1 className= "FindBodyContent">My Activities</h1>  
          
            <div style = {{display: 'flex', justifyContent: 'center'}}>
          <button className='UploadActivities button' >Filter Activities</button>
          <div className='FilterOptions'>
          <div className='AlignMe'>
            <button onClick={() => GetActivitys("ASC")} className = "button">Date Asc</button>
            <button onClick={() => GetActivitys("DESC")} className = "button">Date Des</button>
            <button onClick={() => GetActivitys("Alpha")}  className = "button">Alphabetical</button>
          </div>
          </div>
          
            
            </div>
          <div>
            {/*Displays the data*/}
            {dataActivityInital != undefined && dataActivityInital.map((data,key) => {
              return (
                <div key = {key} >
                  <h2>{data.activityName}</h2>
                  <img src={data.activityImage} />
                  {console.log(key)}
                  <div className='ActivityContentContainer'>
                  <p className='activityDesctiption'>{data.ActivityDescription} </p>
                  </div>
                  </div>
              )




            })}
           
          </div>
        </div>
       
    </div>
</div>
    
   
  );
 
}









export default Activities;