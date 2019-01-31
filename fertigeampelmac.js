require("dotenv").config()
const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;
const fetch = require("node-fetch");
const DOMParser = require("xmldom").DOMParser;
const username = process.env.username;
const password = process.env.password;
const url = process.env.url;
let data = `${username}:${password}`;
let httpAuth = Buffer.from(data).toString("base64");
const { spawn } = require( "child_process" );


function changeLights (status) {
  if (status === "SUCCESS") {
          cmd = spawn( "./clewarecontrol.dms",
                ["-c" , "1" , "-as" , "2" , "1", "-as", "0", "0"]);
          cmd.stdout.on( ("data") , (data) =>
          console.log( `stdout: ${data}` ) );
          cmd.stderr.on( ("data") , (data) =>
          console.log( `stderr: ${data}` ) );
          cmd.on( ("error"), (code) =>
          console.log( `child process exited with code ${code}` ) );

         } else {
          cmd = spawn( "./clewarecontrol.dms",
                ["-c" , "1" , "-as" , "0" , "1", "-as" , "2" , "0"  ]);
          cmd.stdout.on( ("data") , (data) =>
          console.log( `stdout: ${data}` ) );
          cmd.stderr.on( ("data"), (data) => console.log( `stderr: ${data}` ) );
          cmd.on( ("error") , (code) =>
          console.log( `child process exited with code ${code}` ) );
         }
}
function checkBuildState (callback) {
  fetch(
    url,
    {
        method: "GET",
      headers: {
           "Authorization": "Basic " + httpAuth
    }
    } ).then((results) => {
    	 results.text().then((str) => {
         let responseDoc =
         new DOMParser().parseFromString(str, "application/xml");
         let x = responseDoc.getElementsByTagName("build")[0];
         let status = x.getAttribute("status");
         console.log(status);
         callback(status);
        } );
    } );
 }

checkBuildState(changeLights);
setInterval(checkBuildState, 300000, changeLights);


fun = (req, res) => {
//conslog(req.url)
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Ampel\n");
  var url = req.url;
  let par = url.split("/");
  let light = par[1];
  let onof = par[2];
  if (light ==="red") {
      var colour = 0;
  }
  if (light === "yellow" ) {
      var colour = 1;
  }
  if (light === "green"){
      var colour = 2;
  }
  function l(light) {
  cmd = spawn( "./clewarecontrol.dms",  ["-c" , "1" , "-as" , colour , onof ]);
          cmd.stdout.on( ("data") , (data) =>
          console.log( `stdout: ${data}` ) );
          cmd.stderr.on( ("data") , (data) =>
          console.log( `stderr: ${data}` ) );
          cmd.on( ("error"), (code) =>
          console.log( `child process exited with code ${code}` ) );
  }
  switch (light){
   case "update":
   checkBuildState(changeLights);
   break;
   case "break":
   cmd = spawn( "./clewarecontrol.dms",
         ["-c" , "1" , "-as" , "2" , "0", "-as", "0", "0" , "-as" , "1" , "0"]);
   break;
   default :
   switch (onof) {
     case "0" :
      switch (light) {
        case "green":
          l(light);
          break;
       case "red":
          l(light);
          break;
       case "yellow":
          l(light);
          break;
       default:
        console.log("Cant find colour please only use red, yellow or green");
      }
     break;
     case "1":
      switch (light) {
       case "green":
          l(light);
          break;
       case "red":
         l(light);
          break;
       case "yellow":
         l(light);
          break;
       default:
          console.log("Cant find colour please only use red, yellow or green");
      }
     break;
     default:
        console.log("enter 1 for the light to turn on or 0 to turn it off");
}
res.end("\n");
}
}
const server = http.createServer(fun);
server.listen(port, hostname, () => {
console.log(`Server running at http://${hostname}:${port}/`);
});