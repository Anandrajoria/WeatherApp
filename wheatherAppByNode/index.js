const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal =(tempval,orgval)=>{
    const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2) +"°C";
    let temperature=tempval.replace("{%tempval%}",kelvinToCelsius(orgval.main.temp));
    temperature=temperature.replace("{%tempmin%}",kelvinToCelsius(orgval.main.temp_min));
    temperature=temperature.replace("{%tempmax%}",kelvinToCelsius(orgval.main.temp_max));
    temperature=temperature.replace("{%location%}",orgval.name);
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    return temperature;
};

const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=dubai&appid=32eda0f9485c9a218d83f8ac9bf86d8c"
        )
        .on("data",(chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData=[objData]
            // console.log(arrData[0].main.temp);
            const realTimeData=arrData
            .map((val)=>replaceVal(homeFile,val)).join();
                // console.log(val.main)
                res.write(realTimeData)
                // console.log(realTimeData);
        })
        .on("end",(err)=>{
            if(err) return console.log("connetction failed",err);
            res.end();
        })
    }
})

server.listen(5000,"127.0.0.1");