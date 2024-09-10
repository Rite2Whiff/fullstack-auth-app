const express = require("express");
const JWT_secret = "Valorantislove";
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const users = [];

const auth = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    jwt.verify(token, JWT_secret, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Unauthorized",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "You are signed up",
  });

  console.log(users);
});

app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const currUser = users.find(
    (u) => u.username === username && u.password === password
  );
  if (currUser) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_secret
    );
    res.json({
      token: token,
    });
  } else {
    res.json({
      message: "Invalid credentials",
    });
  }
});

app.get("/me", auth, (req, res) => {
  const user = req.user;
  const currUser = users.find((u) => u.username === user.username);

  res.send({
    username: currUser.username,
    password: currUser.password,
  });
});

app.listen(3000, () => {
  console.log("Server successfully up and running on port 3000");
});
