import './styles.css'
import banner from './images/website_banner.jpg'

import {Link,Navigate,useNavigation,useNavigate} from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

import {PasswordChecker,EmailCheck,
  TextChecker
} from './errochecking';
import { getDefaultNormalizer } from '@testing-library/dom';
import GroupActivities from './ViewPosts'





function GroupsList() {
  //const datavar;
  

  // dataToPass = { name: 'John Doe', age: 25 };
  //const newData = JSON.parse(GetData);
  //console.log(newData);
  const[GroupNameInital, GroupName] = useState("");
  const [imageInital,image] = useState(null);
  const[dataGroupInital,getGroupData] = useState([]);
  const[dataJoinGroupInital,getJoinGroupData] = useState([]);
  const reader  = new FileReader();
  const [blobToDataInital,blobToData] = useState("");
  const [GroupActivitiesInital, GroupActivities] = useState("");
  const [PassDataInital, PassDataPass] = useState({GroupID: 'data.GroupID',GroupName: 'data.GroupName'});
  const usera = { name: 'John' };
  
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
    
    //Data.append('image',event.target.files[0]);
    //console.log(Data);
    
    //console.log(reader);
    blobToData(await DATAA(data));
    
   
    //console.log(await fetch(URL.createObjectURL(event.target.files[0])).then(r => console.log(r.blob())));
    
  };
  
  const JoinGroup = async (GroupIDUpload) =>
    {
      try{
        fetch("http://localhost:5000/JoinGroup", {
           method: "POST",
            credentials: 'include',
            withCredntials: true,
          
          headers: { "Content-Type": "application/json",
            Accept: 'application/json',
          },
          body: JSON.stringify({GroupID: GroupIDUpload}),
        })
        .then((response) => {
          if(response.ok === true){
            
            GetGroups();
            JoinableGroup();
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



  const UploadGroup = async (blobToDataInital,GroupNameInital) =>
  {

    if (TextChecker(GroupNameInital) == false)
    {
      alert("You need to include letters!");
    }
    console.log(blobToDataInital);
    if (blobToDataInital == "")
    {
      alert("Please upload an image");
    }
    else if(TextChecker(GroupNameInital) == true && blobToDataInital != ""){
      fetch("http://localhost:5000/CreateGroups", {
        method: "POST",
      
        credentials: 'include',
        withCredntials: true,
        
        body: JSON.stringify({GroupImage: blobToDataInital, GroupName: GroupNameInital}),
        headers: { "Content-Type": "application/json",
          Accept: 'application/json',
        }
        
      })
      .then((response) => {
        if (response.ok == true)
        {
          alert("The request has been successful");
          GetGroups();
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

  const GetGroups = async ()=>
    {
      try{
        fetch("http://localhost:5000/GetUsersGroups", {
           method: "POST",
            credentials: 'include',
            withCredntials: true,
          
          headers: { "Content-Type": "application/json",
            Accept: 'application/json',
          }
        })
        .then((response) => {
          if(response.ok === true){
            console.log(response);
            //alert("The response was successfull!!");
            //response = response.json();
            return response.json();
          }
          if (response.status === 403)
          {
            alert("Forbidden");
          }
          })
          .then((data) => {
            //console.log(data);
            getGroupData(data);
          })
        .catch((error) => {alert("Somthing unexpected went wrong!");})
      }
      catch(error)
      {
        alert("Somthing unexpected went wrong!");
      }
    }

    const JoinableGroup = async ()=>
      {
        try{
          fetch("http://localhost:5000/GetJoinableGroups", {
             method: "POST",
              credentials: 'include',
              withCredntials: true,
            
            headers: { "Content-Type": "application/json",
              Accept: 'application/json',
            }
          })
          .then((response) => {
            if(response.ok === true){
              
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
              
              getJoinGroupData(data);
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
    GetGroups();
    JoinableGroup();
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
          <h1 className= "ActivitsBodyContent">Create your own group!</h1>
            <div className = "logonpage">
                        
                      
                        <h1 className = "pageinputitems">Group Name</h1>
                        <input type = "text"  onChange={(e) => GroupName(e.target.value)} className = "input" value = {GroupNameInital}  />
                        <h1 className = "pageinputitems">Group Image</h1>
                        {imageInital != null && <img src = {URL.createObjectURL(imageInital)} style = {{width: 'min(20em, 50vw)'}} />}
                        <div className='forminput'>
                          <Link className='button' onClick={OnButtonClick} style = {{backgroundColor: 'blue'}}>Browse</Link>
                          <input id = "image" type ="file" style ={{display: 'none'}} onChange={GetImage} ref = {File} />
                        
                        <Link onClick={() => UploadGroup(blobToDataInital,GroupNameInital)} style = {{backgroundColor: 'Purple'}} className='button'>Upload</Link>
                        </div>
                        
                          
                      </div>



          <h1 className= "FindBodyContent">My Groups</h1>  
          <div>
            
            <div style = {{width: '100%'}}>
            {dataGroupInital != undefined && dataGroupInital.map((data,key) => {
              return (
                    <div key = {key} className = "Container">
                      
                      <h2 sytle = {{width: '30%'}}>{data.GroupName}</h2>
                      <img className = 'ImageGroup' src={data.groupImage} style = {{paddingBottom: '10px'}} />
                      <div className = "ButtonAlign">
                        
                      <Link to = {"/ViewPosts"} state = {{GroupID: data.GroupID, GroupName: data.GroupName, groupImage:data.groupImage}} className='NewButton'>View Groups Posts </Link>
                      
                      </div>
                    </div>
              )
            })}
            </div>
            </div>    
          <h1 className= "Join Groups">Join Groups</h1>  
          {dataJoinGroupInital != undefined && dataJoinGroupInital.map((data,key) => {
              return (
                    <div key = {key} className = "Container">
                      <h2>{data.GroupName}</h2>
                      <img className = 'ImageGroup' src={data.GroupImage} style = {{paddingBottom: '10px'}} />
                      <div className = "ButtonAlign">
                      <Link onClick={() => JoinGroup(data.GroupID, data.GroupName)} className='NewButton'>Join Group</Link>
                      </div>
                    </div>
              )
            })}
           
          
        </div>
        </div>
    
     
</div>
    
   
  );
 
}









export default GroupsList;