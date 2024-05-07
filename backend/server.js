const express = require("express");
const mongoose = require("mongoose");
const dataModel = require("./modules/data_schema");
const userSchema = require("./modules/users_schema");
const tokensSchema = require("./modules/token_schema");
const url = "mongodb+srv://sherry:w4m0X1k7Q9Iq5B68@db-mongodb-nyc3-37835-3abdbc46.mongo.ondigitalocean.com/budgeting?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-37835";
const bodyParser = require("body-parser");
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json({ extended: false });

const jwt = require("jsonwebtoken");
const { expressjwt: exjwt } = require("express-jwt");
const jwtDecode = require("jwt-decode");

const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});
app.use(cors());
const port = 3001;

const secretKey = "My super secret key";

const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

app.use(function (err, req, res, next) {
  console.log(err.name === "UnauthorizedError");
  console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      err,
    });
  } else {
    next(err);
  }
});

app.get("/mongo", async (req, res) => {
  try {
    await mongoose.connect(url);
    console.log("mongo connected!!")
    mongoose.connection.close();
    return res.status(200).json({msg: "mongo connected"})
  } catch {
    console.log(error);
    res.json({
      errorCode: 500,
      message: error.writeErrors[0].err.errmsg,
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  await mongoose.connect(url);
  const userData = await userSchema.findOne({
    username,
    createpassword: password,
  });

  if (!userData) {
    res.status(401).json({
      success: false,
      token: null,
      err: "username or password is incorrect",
    });
  } else {
    const userId = userData._id;
    const tokenExpiresBy = Date.now() + 60 * 1000;
    const token = jwt.sign({ id: userId }, secretKey, { expiresIn: tokenExpiresBy });
    const refreshTokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const refreshToken = jwt.sign({ id: userId }, secretKey, {
      expiresIn: refreshTokenExpiry,
    });
    const tokensData = new tokensSchema({
      userId,
      refreshToken,
      expirationTime: refreshTokenExpiry,
    });
    await tokensSchema.insertMany(tokensData);
    mongoose.connection.close()
    res.json({
      success: true,
      err: null,
      token,
      refreshToken,
      expiresBy: tokenExpiresBy,
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const mongoConnection = await mongoose.connect(url);
    const newData = new userSchema(req.body);
    console.log("Inserting data: ", req.body);
    console.log("Inserting data: ", newData);
    const data = await userSchema.insertMany(newData);
    const userId = newData._id;
    console.log(`userId: ${userId}`);

    const tokenExpiresBy = Date.now() + 60 * 1000;
    const token = jwt.sign({ id: userId }, secretKey, {
      expiresIn: tokenExpiresBy,
    });
    const refreshTokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const refreshToken = jwt.sign({ id: userId }, secretKey, {
      expiresIn: refreshTokenExpiry,
    });
    const tokensData = new tokensSchema({
      userId,
      refreshToken,
      expirationTime: refreshTokenExpiry,
    });
    const tokenInsert = await tokensSchema.insertMany(tokensData);
    console.log("successfully inserted data and token");
    mongoose.connection.close();

    res.json({
      success: true,
      err: null,
      token,
      refreshToken,
      expiresBy: tokenExpiresBy,
    });
  } catch (error) {
    console.log(error);
    res.json({
      errorCode: 500,
      message: error.writeErrors[0].err.errmsg,
    });
  }
});

app.post("/configure", (req, res) => {
  const { title, budget, actualSpent, color } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  const parsedToken = JSON.parse(atob(token.split(".")[1]));

  const userId = parsedToken.id;

  console.log("signed in for", title, budget, actualSpent, color);
  mongoose
    .connect(url)
    .then(() => {
      const newData = new dataModel({
        title,
        budget,
        actualSpent,
        color,
        userId,
      });
      console.log("Inserting data: ", req.body);
      console.log("Inserting data: ", newData);
      dataModel
        .insertMany(newData)
        .then((data) => {
          console.log("successfully inserted data");
          res.sendStatus(200);
          mongoose.connection.close();
        })
        .catch((error) => {
          res.json({
            errorCode: 500,
            message: error.writeErrors[0].err.errmsg,
          });
          console.log(error);
        });
    })
    .catch((connectionError) => {
      console.log(connectionError);
    });
});

app.get("/budget", (req, res) => {
  console.log("fetching budget...");
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token found: ", token);
  const parsedToken = JSON.parse(atob(token?.split(".")[1]));
  console.log(`budget fetch -- parsedToken: ${JSON.stringify(parsedToken)}`)
  const tokenExpiry = parsedToken?.exp;
  console.log(`budget fetch -- tokenExpiry: ${tokenExpiry}, now: ${Date.now()}`)
  if (!!tokenExpiry && tokenExpiry > Date.now()) {
    console.log("parsed token: ", parsedToken);
    const userId = parsedToken.id;
    console.log("user id in token: ", userId);
    mongoose
      .connect(url)
      .then(() => {
        console.log("Connected to Database");
        dataModel
          .find({ userId })
          .then((data) => {
            mongoose.connection.close();
            res.json(data);
          })
          .catch((connectionError) => {
            console.log(connectionError);
          });
      })
      .catch((connectionError) => {
        console.log(connectionError);
      });
  } else {
    res.status(401).json({
      success: false,
      token: null,
      err: "no authorized",
    });
  }
});

app.post("/refresh-token", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("refreshing token: ", refreshToken);
  try {
    await mongoose.connect(url);
    const refreshTokenData = await tokensSchema.findOne({ refreshToken });
    console.log("token data in db : ", refreshTokenData);
    const refreshTokenInDb = refreshTokenData?.refreshToken;
    const userInDb = refreshTokenData?.userId;
    // const parsedRefreshTokenInDb = JSON.parse(
    //   atob(refreshTokenInDb?.split(".")[1])
    // );
    // const refreshTokenExpiry = parsedRefreshTokenInDb?.exp;
    const refreshTokenExpiry = refreshTokenData?.expirationTime;
    const hasRefreshTokenExpired = refreshTokenExpiry
      ? Date.now() > refreshTokenExpiry
      : true;
    const token = req.headers.authorization.split(" ")[1];
    console.log("token found: ", token);
    const parsedToken = JSON.parse(atob(token.split(".")[1]));
    console.log("parsed token: ", parsedToken);
    const userId = parsedToken.id;
    console.log("user id in token: ", userId);
    console.log("Connected to Database");
    console.log(`refresh token-- checking conditions -- 
      userId: ${userId}, 
      userIdInDb: ${userInDb}, 
      refreshTokenInDb: ${refreshTokenInDb}, 
      refreshToken: ${refreshToken}, 
      refreshTokenExpiry: ${refreshTokenExpiry}, 
      now: ${Date.now()},
      hasRefreshTokenExpired: ${hasRefreshTokenExpired}`
    )
    if (
      userId == userInDb &&
      refreshTokenInDb &&
      refreshTokenInDb == refreshToken &&
      !hasRefreshTokenExpired
    ) {
      const tokenExpiresBy = Date.now() + 60 * 1000;
      const token = jwt.sign({ id: userId }, secretKey, { expiresIn: tokenExpiresBy });
      // const refreshToken = jwt.sign(
      //   { id: userId },
      //   secretKey,
      //   { expiresIn: "30d" }
      // );
      // const tokensData = new tokensSchema({
      //   userId,
      //   refreshToken,
      //   expirationTime: tokenExpiresBy
      // })
      // const tokenInsert = await tokensSchema.insertMany(tokensData)
      console.log("successfully inserted data and token");
      mongoose.connection.close();
      res.json({
        success: true,
        err: null,
        token,
        expiresBy: tokenExpiresBy,
      });
    } else {
      mongoose.connection.close();
      res.status(401).json({
        success: false,
        token: null,
        err: "no authorized",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      errorCode: 500,
      message: error.writeErrors[0].err.errmsg,
    });
  }
});

app.get("/logout", async (req, res) => {
  try {
    const mongoConnection = await mongoose.connect(url);
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      console.log("token found for logout: ", token);
      const parsedToken = JSON.parse(atob(token.split(".")[1]));
      console.log("parsed token for logout: ", parsedToken);
      const userId = parsedToken.id;
      console.log("user id in token for logout: ", userId);
      console.log("Connected to Database");
      const deleteToken = await tokensSchema.deleteMany({ userId });
      console.log("successfully deleted user token");
      mongoose.connection.close();
      console.log("mongoose connection closed");
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(401).json({
        success: false,
        err: "no authorized",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      errorCode: 500,
      message: error.writeErrors[0].err.errmsg,
    });
  }
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
