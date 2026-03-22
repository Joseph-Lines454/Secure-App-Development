//modules which have been used for the app
const express = require('express');
var app = express();
const mssql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
var https = require('https');
var fs = require('fs');
const {
  randomBytes,
  Sign,
} = require('node:crypto');
const { error } = require('node:console');
const { buffer } = require('node:stream/consumers');

var cookieParser = require('cookie-parser');
const { resolveSoa } = require('node:dns');

const config = {
  user: 'SecureAppDevLogin',  
  password: 'password1!',  
  server: 'localhost',  
  database: 'SecureAppDev',  
  options: {
    encrypt: true,  
    trustServerCertificate: true  
  },
  port: 1433
}
var connectionData;
// Connection to the mssql database
async function connection()
{
  try{
    connectionData = await mssql.connect(config);
    console.log("Connected to the database!");
  }
  catch(error)
  {
    console.log("No connection!");
  }
}
//Checks if the email that the user has implemented is in the correct format
function EmailCheck(email)
{
  var regex = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/

  if (regex.test(email) === true)
  {
    return true;
  }
  else
  {
    return false;
  }

}
//Checks if the password that the user has implemented is in the correct format
function PasswordChecker(password)
{
  var regex = /([(0-9)(+-=><)(A-Z)])/
  
  if (regex.test(password) === true && String(password).length >= 8)
  {
    return true;
  }
  else
  {
    return false;
  }
}
//Checks if text is correct
function TextChecker(text)
{
  var regex = /([a-z])|([A-Z])/g
  if (text == "" || String(text).length < 4)
  {
    return false;
  }
  else if (regex.test(text) == false)
  {
    return false;
  }
  else if (String(text).length > 25)
  {
    return false;
  }
  return true;
}
//Checks if the description is correct
function DescriptionChecker(text)
{
  var regex = /([a-z])|([A-Z])/g
  if (text == "")
  {
    return false;
  }
  else if (regex.test(text) == false)
  {
    return false;
  }
  else if (String(text).length > 200)
  {
    return false;
  }
  return true;
}

// CORS settings
app.use(cors({ origin: true,
  optionsSuccessStatus: 200,
  credentials: true,
  'X-Content-Type-Options': 'nosniff'
  
 }
));
//using the different modules
app.use(cookieParser());
app.listen(5000, () => {connection()})

app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb',extended: true, parameterLimit: 50000}));

//HTTPS
const privateKey = fs.readFileSync('localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('localhost.pem', 'utf8');


app.post('/logon', (req,res) =>
{
  
  //checks if the
  async function GetLogon()
  {
    if (PasswordChecker(req.body.password) == true && TextChecker(req.body.username) == true) {
      try{
        
        var results = await connectionData.request().input('UserName', mssql.VarChar, req.body.username).input('password', mssql.VarChar, req.body.password).query(`SELECT Users.username, Users.emailaddress FROM Users WHERE Users.password = HASHBYTES('SHA2_256', @password + Users.salt) AND Users.username = @UserName`);
        
        
        if (results.recordset == "") 
        {
          
          res.status(400).send("Invalid credentials");
        }
        else{
  
          var cookieGeneration = randomBytes(16).toString('hex');
          //Create a new Cookie
          
          var cookie = await connectionData.request().input('Cookie', mssql.VarChar,cookieGeneration).input('UserName', mssql.VarChar, req.body.username).input('password', mssql.VarChar, req.body.password).query(`UPDATE Users SET SessionID = @Cookie WHERE Users.password = HASHBYTES('SHA2_256', @password + Users.salt) AND Users.username = @UserName`);
  
  
          //Response to the client with a cookie
          res.set("Access-Control-Allow-Credentials: true");
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.header('Set-Cookie', `${cookieGeneration}; Max-Age=3600; httpOnly = false; Partitioned=false;`);
          
          res.json("Here is some infroatinon");
         
        }
        
      }
     catch(error)
     {res.send(400).send("somthing went wrong")}



    }
    else{
      res.status(401).send("Unauthorized!");
    }
    
  }
  GetLogon();
});

app.post('/signup', (req,res) =>
  {
    async function SignUp()
    {
      try{
        
        randomBytes(16,(error,buffer) => {});
        // input validation
        if (EmailCheck(req.body.email) == true && PasswordChecker(req.body.password) == true)
        {
          var salt = randomBytes(16).toString('hex');
         



          //cookie conversion
          var cookieGeneration = randomBytes(16).toString('hex');
          //Insert the users details, hashing passwords
          
          var results = await connectionData.request().input('email',mssql.VarChar, req.body.email).input('password',mssql.VarChar, req.body.password).input('salt',mssql.VarChar, salt).input('Cookie', mssql.VarChar,cookieGeneration).input('Username', mssql.VarChar,req.body.userName).query(`INSERT INTO Users(emailaddress, password,salt,administrator,SessionID,username) VALUES (@email,HASHBYTES('SHA2_256', @password + @salt),@salt,0,@Cookie,@Username)`);
          
          res.send("all good!");
          
        }
        else
        {
          res.status(403).send("nope");
        }
      }
      
      catch(error)
      {
        console.log(error);
        res.status(400).send("error");
      }
    }
  SignUp();
  });


  

  app.post('/UserActivitiesUpload', (req,res) =>
    {
      async function ActivitiesUpload()
      {
        // input validation
        if(TextChecker(req.body.ActivityName) == true && req.body.Image != "" && DescriptionChecker(req.body.ActivityDescription) == true) {
          try{
          
        
            //uploading the users activities
            var results = await connectionData.request().input('ActivityName', mssql.VarChar, req.body.ActivityName).input('Cookie', mssql.VarChar, req.headers.cookie).input('Image', mssql.VarChar, req.body.Image).input('ActvityDescription', mssql.VarChar, req.body.ActvityDescription).query(`DECLARE @var1 int; SET @var1 = (SELECT UsersID FROM Users WHERE SessionID = @Cookie);
  INSERT INTO UserActivities(activityName,activityImage,UsersID,ActivityDescription) 
  VALUES(@ActivityName,CONVERT(VARBINARY(MAX), @Image),@var1,@ActvityDescription)`);
            res.status(200).send("All Good!");
          }
          catch(error)
          {
            console.log(error);
            res.status(400).send("somthing went wrong!");
          }
        }
        else{
          res.status(401).send("Unauthorized!");
        }

        
      }
      ActivitiesUpload();
    });


    app.post("/UserActivitiesGet", (req,res) => {
      
      async function ActivitiesGet()
      {
        /*Implementing validation for the filtering of activities*/
          try{
          if (req.body.OrderByUpload == 'DESC') {
            var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).query(`SELECT Users.username,UserActivities.activityName,CONVERT(VARCHAR(MAX),UserActivities.activityImage) as activityImage,UserActivities.UserActivitiesID,ActivityDescription FROM UserActivities 
            LEFT JOIN Users ON Users.SessionID = @Cookie WHERE UserActivities.UsersID = Users.UsersID ORDER by UserActivitiesID DESC`);     res.json(results.recordset);


          }
          else if (req.body.OrderByUpload == "Alpha") {
            var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).query(`SELECT Users.username,UserActivities.activityName,CONVERT(VARCHAR(MAX),UserActivities.activityImage) as activityImage,UserActivities.UserActivitiesID,ActivityDescription FROM UserActivities 
            LEFT JOIN Users ON Users.SessionID = @Cookie WHERE UserActivities.UsersID = Users.UsersID ORDER by activityname`);  res.json(results.recordset);
          }
          else if (req.body.OrderByUpload == 'ASC')
          {
              var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).query(`SELECT Users.username,UserActivities.activityName,CONVERT(VARCHAR(MAX),UserActivities.activityImage) as activityImage,UserActivities.UserActivitiesID,ActivityDescription FROM UserActivities 
              LEFT JOIN Users ON Users.SessionID = @Cookie WHERE UserActivities.UsersID = Users.UsersID ORDER by UserActivitiesID ASC`);     res.json(results.recordset);
          }
          else
          {
            res.status(401).send("Not Ok!")
          }
        }
        catch(error)
        {
          res.status(400).send("Bad request");
          
        }
    
      }
      ActivitiesGet();
    
    })

app.post('/PostFinds', (req,res) =>
  {
    async function PostFind()
    {
      if (TextChecker(req.body.FindName) == true && req.body.Image != "") {
        try{
          
          
          //Inputting the users finds into the database
          var results = await connectionData.request().input('FindName', mssql.VarChar, req.body.FindName).input('Cookie', mssql.VarChar, req.headers.cookie).input('Image', mssql.VarChar, req.body.Image).query(`DECLARE @var1 int; SET @var1 = (SELECT UsersID FROM Users WHERE SessionID = @Cookie);INSERT INTO UsersFinds(findName,findImage,UsersID) VALUES(@FindName,CONVERT(VARBINARY(MAX), '${req.body.Image}'),@var1)`);
          res.status(200).send("All is Ok");
        }
        catch(error)
        {
          res.send(400).send("Somthing went wrong!");
        }


      }
      else{
        res.status(401).send("Unauthorized");
      }
      
    }
    PostFind();
  });

app.post("/GetFinds", (req,res) => {
  
  async function GetFinds()
  {
    
    try{
      // Get finds based on filter
      if (req.body.GetFindsOrderUpload == 'DESC'){
      var results = await connectionData.request().query(`SELECT Users.username,UsersFinds.findName,CONVERT(VARCHAR(MAX),UsersFinds.findImage) as findImage,UsersFinds.UserFindsID FROM UsersFinds LEFT JOIN Users ON Users.SessionID = '${req.headers.cookie}' WHERE UsersFinds.UsersID = Users.UsersID ORDER by UserFindsID DESC;`); res.json(results.recordset);}
      else if (req.body.GetFindsOrderUpload == "Alpha") {
        var results = await connectionData.request().query(`SELECT Users.username,UsersFinds.findName,CONVERT(VARCHAR(MAX),UsersFinds.findImage) as findImage,UsersFinds.UserFindsID FROM UsersFinds LEFT JOIN Users ON Users.SessionID = '${req.headers.cookie}' WHERE UsersFinds.UsersID = Users.UsersID ORDER by findName;`); res.json(results.recordset);
      }
      else if(req.body.GetFindsOrderUpload == "ASC") {
        var results = await connectionData.request().query(`SELECT Users.username,UsersFinds.findName,CONVERT(VARCHAR(MAX),UsersFinds.findImage) as findImage,UsersFinds.UserFindsID FROM UsersFinds LEFT JOIN Users ON Users.SessionID = '${req.headers.cookie}' WHERE UsersFinds.UsersID = Users.UsersID ORDER by UserFindsID ASC;`); res.json(results.recordset);
      }
      else
      {
        res.status(401).send("Not Ok!")
        

      }

     
    }
    catch(error)
    {
      res.status(400).send("Bad request");
      
    }

  }
  GetFinds();

});

/* Listing Groups which a user is apart of */

app.post("/GetUsersGroups", (req,res) => {

  async function GetUsersGroups() {
    try{
      // Get users groups
      var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).query(`DECLARE @var1 int; 
      SET @var1 = (SELECT UsersID FROM Users WHERE SessionID = @Cookie);
      SELECT Groups.GroupID,GroupName,CONVERT(VARCHAR(MAX),groupImage) as groupImage FROM Groups
      LEFT JOIN UsersGroups ON UsersGroups.GroupID = Groups.GroupID
      WHERE UsersGroups.UsersID = @var1;`);
     
      if (results.recordset == "") 
      {
        
        res.status(400).send("Invalid Credentials!");
      }
      else{
        
        res.json(results.recordset);
      }
    }
    catch(error)
    {
    
      res.status(400).send("Bad request!");
    }
  }
  GetUsersGroups();



})

app.post("/CreateGroups", (req,res) => {
  //some input sanitization
  async function CreateGroup()
  {
    if(TextChecker(req.body.GroupName) == true && req.body.GroupImage != "")
    {
      try{
        // creates a group and adds the user to the link table
        var results = await connectionData.request().input('GroupName', mssql.VarChar, req.body.GroupName).input('Cookie', mssql.VarChar, req.headers.cookie).input('GroupImage', mssql.VarChar, req.body.GroupImage).query(`DECLARE @var1 int; 
        SET @var1 = (SELECT UsersID FROM Users WHERE SessionID = @Cookie);
        INSERT INTO Groups (GroupName,groupImage) VALUES (@GroupName,CONVERT(varbinary(MAX),@GroupImage))
        DECLARE @var2 int;
        SELECT @var2 = Groups.GroupID 
        FROM UsersGroups
        RIGHT JOIN Groups ON Groups.GroupID = UsersGroups.GroupID
        WHERE UsersGroups.GroupID IS NULL
        INSERT INTO UsersGroups(GroupID,UsersID) VALUES (@var2,@var1)
        `);
        
        res.status(200).send("All good");
    
      }
      catch(error)
      {
      
        res.status(400).send("Bad request!");
      }  
    }
    else{
      req.status(401).send("Unauthorized!");
    }
    
  }
  
  CreateGroup();





})

app.post("/GetJoinableGroups", (req,res) => {

  async function GetJoinableGroups() {

    try{
      // Selects all of the groups a user is not apart of
      var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).query(`DECLARE @var1 int;
      SET @var1 = (SELECT UsersID FROM Users WHERE SessionID = @Cookie)
      SELECT Groups.GroupID,Groups.GroupName,CONVERT(VARCHAR(MAX),Groups.GroupImage) as GroupImage, UsersGroups.UsersID FROM Groups 
      LEFT JOIN UsersGroups ON UsersGroups.GroupID  = Groups.GroupID AND UsersGroups.UsersID = @var1
      WHERE UsersGroups.UsersID IS NULL`);
      res.json(results.recordset);
    }
    catch(error)
    {
    
      res.status(400).send("Unauthorized");
    }
    
  }
  GetJoinableGroups();



})


app.post("/JoinGroup", (req,res) => {
  async function JoinTheGroup()
  {
    try{
      // Join a group
      var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).input('GroupID', mssql.Int, req.body.GroupID).query(`DECLARE @var1 int;
      SET @var1 = (SELECT UsersID FROM Users WHERE SessionID = @Cookie)
      INSERT INTO UsersGroups (UsersID,GroupID) VALUES (@var1,@GroupID);`);
      res.send("All good!, I should probably use a HTTP RESPONSE CODE HERE!! HAHAH");
    }
    catch(error)
    {
      res.status(400).send("Unauthorized");
    }
  }
  JoinTheGroup();
})

app.post("/UploadAcitvities", (req,res) => {
  async function GetActivitiesGroup()
  {
    try{

      var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).input('GroupID', mssql.Int, req.body.GroupID).query(`
      SELECT UsersGroups.GroupID, UsersGroups.UsersID FROM UsersGroups
      LEFT JOIN Users ON sessionID = @Cookie
      WHERE UsersGroups.GroupID = @GroupID`);
      
      if(results.recordset == "")
      {
        res.status(401).send("Unauthorised");
      }

      else{
        var resultsGroup = await connectionData.request().input('GroupID', mssql.Int, req.body.GroupID).query(`
          SELECT activityname,CONVERT(VARCHAR(MAX),activityImage) as activityImage,ActivityDescription, Users.username FROM UserActivitiesLinkTable
          LEFT JOIN UserActivities ON UserActivities.UserActivitiesID = UserActivitiesLinkTable.UserActivitiesID
          LEFT JOIN Users ON UserActivities.UsersID = Users.UsersID
          WHERE UserActivitiesLinkTable.GroupID = @GroupID`);
          res.json(resultsGroup.recordset);
      }
    }
    catch(error)
    {
     
      res.status(400).send("Unauthorized");
    }
  }
  GetActivitiesGroup();
})


app.post("/GetActivitiesGroup", (req,res) => {
  async function GetActivitiesGroup()
  {
    try{
      var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).input('GroupID', mssql.Int, req.body.GroupID).query(`
      SELECT UsersGroups.GroupID, UsersGroups.UsersID FROM UsersGroups
      LEFT JOIN Users ON sessionID = @Cookie
      WHERE UsersGroups.GroupID = @GroupID`);
      
      if(results.recordset == "")
      {
        res.status(401).send("Unauthorised");
      }

      else{
        var resultsGroup = await connectionData.request().input('GroupID', mssql.Int, req.body.GroupID).query(`
          SELECT activityname,CONVERT(VARCHAR(MAX),activityImage) as activityImage,ActivityDescription, Users.username FROM UserActivitiesLinkTable
          LEFT JOIN UserActivities ON UserActivities.UserActivitiesID = UserActivitiesLinkTable.UserActivitiesID
          LEFT JOIN Users ON UserActivities.UsersID = Users.UsersID
          WHERE UserActivitiesLinkTable.GroupID = @GroupID`);
          res.json(resultsGroup.recordset);
      }
    }
    catch(error)
    {
      res.status(400).send("Unauthorized");
    }
  }
  GetActivitiesGroup();
})


app.post("/GetUserActivitesForUpload", (req,res) => {
  async function GroupActivitiesUpload()
  {
    try{

      //Code that checks that the user is apart of the group. If the user is not apart of the group, the user is not added.
      var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).input('GroupID', mssql.Int, req.body.GroupID).query(`
      SELECT UsersGroups.GroupID, UsersGroups.UsersID FROM UsersGroups
      LEFT JOIN Users ON sessionID = @Cookie
      WHERE UsersGroups.GroupID = @GroupID`);
      
      
      if(results.recordset == "")
      {
        res.status(401).send("Unauthorised");
      }
      // Gets the Users activities which have not been uploaded to the 
      else{
        var resultsGroup = await connectionData.request().input('GroupID', mssql.Int, req.body.GroupID).input('Cookie', mssql.VarChar, req.headers.cookie).query(`
          DECLARE @var1 int;
          SET @var1 = (SELECT Users.UsersID FROM Users WHERE SessionID = @Cookie)
          SELECT activityname,CONVERT(VARCHAR(MAX),activityImage) as activityImage, UserActivities.UserActivitiesID FROM UserActivities 
          LEFT JOIN UserActivitiesLinkTable ON UserActivitiesLinkTable.UserActivitiesID = UserActivities.UserActivitiesID AND UserActivitiesLinkTable.GroupID = @GroupID
          LEFT JOIN Users ON UserActivities.UsersID = Users.UsersID
          WHERE Users.UsersID = @var1 AND UserActivitiesLinkTable.UserActivitiesID IS NULL`);
          res.json(resultsGroup.recordset);
      }
    }
    catch(error)
    {
  
      res.status(400).send("Unauthorized");
    }
  }
  GroupActivitiesUpload();
})

app.post("/UploadActivitiesGroup", (req,res) => {
  async function GroupActivitiesUpload()
  {
    try{

      //Checks that the user is apart of the group. If the user isnt, the User Gets 
      var results = await connectionData.request().input('Cookie', mssql.VarChar, req.headers.cookie).input('GroupID', mssql.Int, req.body.GroupID).input('ActivityID', mssql.Int, req.body.ActivityID).query(`
     SELECT UsersGroups.GroupID, UsersGroups.UsersID, UserActivities.activityname FROM UsersGroups
      LEFT JOIN Users ON sessionID = @Cookie
	  LEFT JOIN UserActivities ON UserActivities.UsersID = Users.UsersID
      WHERE UsersGroups.GroupID = @GroupID AND UserActivities.UserActivitiesID = @ActivityID`);
      
   
      if(results.recordset == "")
      {
        res.status(401).send("Unauthorised");
      }
      // We need to Check that when the user uploads their ID, the user needs 
      else{
        var resultsGroup = await connectionData.request().input('GroupID', mssql.Int, req.body.GroupID).input('Cookie', mssql.VarChar, req.headers.cookie).input('ActivityID', mssql.Int, req.body.ActivityID).query(`
          INSERT INTO UserActivitiesLinkTable(UserActivitiesID,GroupID) VALUES (@ActivityID,@GroupID)`);
          res.json(resultsGroup.recordset);
      }
    }
    catch(error)
    {
      
      res.status(400).send("Unauthorized");
    }
  }
  GroupActivitiesUpload();
})

app.get("/GetLeaderboard", (req,res) => {
  async function GetLeaderboard()
  {
    try {
      var results = await connectionData.request().query(`
       SELECT TOP 10 Users.username, COUNT (UsersFinds.UserFindsID) as Find FROM Users 
LEFT JOIN UsersFinds ON UsersFinds.UsersID = Users.UsersID
GROUP BY (Users.username) ORDER BY Find DESC `);
       res.json(results.recordset);

    }
    catch(error)
    {
      res.status(400).send("Bad request");
    }
   
  }
  GetLeaderboard();
 



})


app.get("/topFind", (req,res) => {
  async function GetLeaderboard()
  {
    try {
      var results = await connectionData.request().query(`SELECT TOP 3 UsersFinds.findName, CONVERT(VARCHAR(MAX),UsersFinds.findImage) as findImage, UsersFinds.UserFindsID, Users.username FROM UsersFinds
LEFT JOIN Users ON Users.UsersID = UsersFinds.UsersID
ORDER BY NEWID() `);
       res.json(results.recordset);

    }
    catch(error)
    {
      res.status(400).send("Bad request");
    }
   
  }
  GetLeaderboard();
})

