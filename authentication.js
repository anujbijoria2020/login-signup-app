const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5500']
}));
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

let UserData = [];
app.post("/signup",(req,res)=>{
let user = req.body;
let UserAlreadyExists = false;
for(let i = 0;i<UserData.length;i++){
  if(UserData[i].username==user.username){
UserAlreadyExists = true;
break;
  }
}
if(UserAlreadyExists){
  res.status(400).send("username already exists");
}
else{
 UserData.push(user);
 res.status(200).send("signup completed");
 console.log("Current users after signup:", UserData);
}
})


app.post('/login',(req,res)=>{
let userdetails = req.body;
let userFound = null;
for(let i = 0;i<UserData.length;i++){
    if(UserData[i].username==userdetails.username&& UserData[i].password==userdetails.password){
         userFound = UserData[i];
        break;
    }
}
if(userFound){
    res.status(201).json({
        firstName:userFound.name,
        lastName:userFound.lastname,
    })
    console.log("Trying to login with:", userdetails);
    console.log("Stored users:", UserData);

}
else{
    res.status(401).send("invalid credentials : password and username did not matched");
}
})


app.get("/data", (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    let userFound = false;

    for (let i = 0; i < UserData.length; i++) {
        if (UserData[i].username === username && UserData[i].password === password) {
            userFound = true;
            break;
        }
    }

    if (userFound) {
        console.log("Headers received:", req.headers);

        let usersToReturn = [];
        for (let i = 0; i < UserData.length; i++) {
            usersToReturn.push({
                firstName: UserData[i].name,
                lastname: UserData[i].lastname,
                username: UserData[i].username
            });
        }
        res.json({
            users: usersToReturn
        });
    } else {
        res.sendStatus(401);
    }
});


app.get("/debug-users", (req, res) => {
    res.json(UserData);
});

function started(){
    console.log(`backend listeing on port  ${PORT}`);
}
app.listen(PORT,started);