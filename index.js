//libraries
const express = require("express");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");
const { Pool, Client } = require("pg");

// constants
const port = process.env.PORT || 3000;

//asignments
const app = express();
app.use("/data", express.static(__dirname.concat("/data")));
app.use(logger("dev"));

// app assignment
app.use(express.json());

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

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "@nagraj",
  port: 5432,
});

/*F -------Save Feeds-----------*/
app.post("/api/savefeed", function (req, res) {
  const query_save_feed = `insert into userfeeds(username,feedid,feeddate,likes) values( '${req.body.username}','${req.body.feedid}',CURRENT_TIMESTAMP,${req.body.likes});`;
  pool.query(query_save_feed, function (err, result) {
    if (err) {
      res.send({ isTrue: 0, error: err.message });
    } else {
      if (result.rowCount === 1) {
        const query_select_feed = `select username,max(feedid) as maxtime from userfeeds where username = '${req.body.username}' group by username;`;
        pool.query(query_select_feed, (err, result) => {
          if (err) {
            res.send({ isTrue: 0, error: err.message });
          } else {
            const filename =
              __dirname +
              `/data/feeds/${result.rows[0].username}${result.rows[0].maxtime}.txt`;
            fs.writeFile(filename, `'${req.body.feed}'`, (err) => {
              if (err) {
                res.send({ isTrue: 0, error: err.message });
              } else {
                res.send({ error: "file created!!", isTrue: 1 });
              }
            });
          }
        });
      } else {
        res.send({ error: "user not found!!", isTrue: 0 });
      }
    }
  });
});

/*F-------Load Feeds-----------*/
app.get("/api/loadfeeds", function (req, res) {
  const query_load_feeds = `select * from userfeeds order by feeddate desc;`;
  pool.query(query_load_feeds, function (err, result) {
    if (err) {
      res.send({ isTrue: 0, error: err.message });
    } else {
      const feeds = result.rows;
      for (let index = 0; index < result.rows.length; index++) {
        const filename =
          __dirname +
          `/data/feeds/${feeds[index].username}${feeds[index].feedid}.txt`;
        try {
          feeds[index]["content"] = fs.readFileSync(filename, "utf8");
        } catch (ex) {
          feeds[index]["content"] = "no data file";
        }
      }
      res.send({ loadFeedsResult: feeds, isTrue: 1, error: "" });
    }
  });
});

/*F -------Login Api-----------*/
app.post("/api/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  const query_login = `select * from userdetails where username = '${username}' AND password ='${password}';`;
  pool.query(query_login, function (err, result) {
    if (err) {
      res.send({ isTrue: 0, error: err.message });
    } else {
      if (result.rowCount === 1) {
        res.send({ loginResult: result.rows[0], isTrue: 1, error: "" });
      } else {
        res.send({ isTrue: 0, error: "user not found!!" });
      }
    }
  });
});

/*F-------Complete Profile-----------*/
app.post("/api/completeprofile", function (req, res) {
  const query_update_userdetail = `update userdetails set mobileno='${req.body.mobileno}',firstname='${req.body.firstname}' ,lastname='${req.body.lastname}',
  age=${req.body.age} ,dob='${req.body.dob}',gender=${req.body.gender},dp='${req.body.dp}' where username='${req.body.username}';`;
  pool.query(query_update_userdetail, function (err, result) {
    if (err) {
      res.send({ error: err.message, isTrue: 0 });
    } else {
      res.send({ error: "profile updated successfully", isTrue: 1 });
    }
  });
});

///beta apis
app.get("/", (req, res) => {
  res.send("Welcome to NagRaj android server !!");
});
