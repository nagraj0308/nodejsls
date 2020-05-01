//libraries
const express = require("express");
const logger = require("morgan");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const multer = require("multer");


// constants
const port = process.env.PORT || 3000;

//asignments
const app = express();
app.use("/data", express.static(__dirname.concat("/data")));
app.use(logger("dev"));
app.set('view engine','ejs');

// app assignment
app.use(express.json());
app.disable('etag');

//storage engine
const storage = multer.diskStorage({
  destination:'./data/',filename(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});
//init Upload
const upload = multer({storage : storage}).single('mydp');


//port listening
app.listen(port, function () {
  console.log("MySelf app requests are beeing listening on port =>", port);
});

//db

// const pool = new Pool({
//   user: "vszqmhhumfddob",
//   host: "ec2-18-213-176-229.compute-1.amazonaws.com",
//   database: "dfmvc3rid4e361",
//   password: "07c49b343b0cb069917b70722dfe8aeb8e02205e9ae2f2eef01a6ce857bc0102",
//   port: 5432,
//   uri:
//     "postgres://vszqmhhumfddob:07c49b343b0cb069917b70722dfe8aeb8e02205e9ae2f2eef01a6ce857bc0102@ec2-18-213-176-229.compute-1.amazonaws.com:5432/dfmvc3rid4e361",
// });



/*F-------Load Feeds-----------*/
// app.get("/api/loadfeeds", function (req, res) {
//   pool.query(query_load_feeds, function (err, result) {
//     if (err) {
//       res.send({ isTrue: 0, error: err.message });
//     } else {
//       const feeds = result.rows;
//       for (let index = 0; index < result.rows.length; index++) {
//         const filename =
//           __dirname +
//           `/data/feeds/${feeds[index].username}${feeds[index].feedid}.txt`;
//         try {
//           feeds[index]["content"] = fs.readFileSync(filename, "utf8");
//         } catch (ex) {
//           feeds[index]["content"] = "no data file";
//         }
//       }
//       res.send({ loadFeedsResult: feeds, isTrue: 1, error: "" });
//     }
//   });
// });

/*F -------Login Api-----------*/
app.post("/api/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  res.send({ isTrue: 0, error: "user not found!!" });
  
});

//upload api
app.post("/abc",(req,res)=>{
  console.log(req);
upload(req,res,(err)=>{
    if(err){
      res.render('index',{msg:err});
    }else{
      console.log(req.file);
      res.send({ isTrue: 1, error: "" });
    }
  });

});

///beta apis
app.get("/", (req, res) => {
  res.render('index');
  //res.send("Welcome to NagRaj android server !!");
});
