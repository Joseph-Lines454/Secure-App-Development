import './styles.css'
import banner from './images/website_banner.jpg'

import {Await, data, Link, UNSAFE_getTurboStreamSingleFetchDataStrategy} from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

import {PasswordChecker,EmailCheck} from './errochecking';
import { getDefaultNormalizer } from '@testing-library/dom';
import { TextChecker } from './errochecking';





function Finds() {
  //const datavar;
  
  
  //const newData = JSON.parse(GetData);
  //console.log(newData);
  const[FindNameInital, FindName] = useState("");
  const [imageInital,image] = useState(null);
  const[dataFindInital,getFindData] = useState([]);
  
  const reader  = new FileReader();
  const [testResultInital,testResult] = useState("");
  const [blobToDataInital,blobToData] = useState("");
  
  
  
  
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

  const UploadFind = async (blobToDataInital,FindNameInital) =>
  {
    if (TextChecker(FindNameInital) == false)
    {
      alert("The group Name has to be 4 or more and less than 26 characters!");
    }
    if (blobToDataInital == "")
    {
        alert("Please upload an image");
    }
    else{

        
    fetch("http://localhost:5000/PostFinds", {
          method: "POST",
        
          credentials: 'include',
          withCredntials: true,
          
          body: JSON.stringify({Image: blobToDataInital, FindName: FindNameInital}),
          headers: { "Content-Type": "application/json",
            Accept: 'application/json',
          }
          
        })
        .then((response) => {
          if (response.ok == true)
          {
            alert("Success!");
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

  const GetFinds = async (GetFindsOrder)=>
    {
      if (GetFindsOrder == undefined)
      {

        GetFindsOrder = "ASC";
      }
      try{
        fetch("http://localhost:5000/GetFinds", {
           method: "POST",
            credentials: 'include',
            withCredntials: true,
            body: JSON.stringify({GetFindsOrderUpload: GetFindsOrder}),
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
            getFindData(data);
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
    GetFinds();
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
          <h1 className= "FindsBodyContent">Add Finds</h1>
            
            <div className = "logonpage">
                        
                      
                        <h1 className = "pageinputitems">Find Name</h1>
                        <input type = "text"  onChange={(e) => FindName(e.target.value)} className = "input" value = {FindNameInital}  />
                        <h1 className = "pageinputitems">Find Image</h1>
                        {imageInital != null && <img src = {URL.createObjectURL(imageInital)} style = {{width: 'min(20em, 50vw)'}} />}
                        <div className='forminput'>
                          <Link className='button' onClick={OnButtonClick} style = {{backgroundColor: 'blue'}}>Browse</Link>
                          <input id = "image" type ="file" style ={{display: 'none'}} onChange={GetImage} ref = {File} />
                        
                        <Link onClick={() => UploadFind(blobToDataInital,FindNameInital)} style = {{backgroundColor: 'Purple'}} className='button'>Upload</Link>
                        </div>
                        
                          
                      </div>



          <h1 className= "FindsBodyContent">My Finds</h1> 
          <div style = {{display: 'flex', justifyContent: 'center'}}>
          <button className='UploadActivities button' >Filter Activities</button>
          <div className='FilterOptions'>
          <div className='AlignMe'>
            <button onClick={() => GetFinds("ASC")} className = "button">Date Asc</button>
            <button onClick={() => GetFinds("DESC")} className = "button">Date Des</button>
            <button onClick={() => GetFinds("Alpha")}  className = "button">Alphabetical</button>
          </div>
          </div> 
          </div>
          <div>
            {dataFindInital != undefined && dataFindInital.map((data,key) => {
              return (
                <div key = {key} >
                  <h2 sytle = {{width: '50%'}}>{data.findName}</h2>
                  <img src={data.findImage} />
                  {console.log(data.findImage)}
                  </div>
              )




            })}
           
          </div>
        </div>
       
    </div>
</div>
    
   
  );
 
}









export default Finds;