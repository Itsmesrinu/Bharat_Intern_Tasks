
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const path = require("path");

const static_path =path.join(__dirname,"/public")
app.use(express.static(static_path))
//const static_path2 =path.join(__dirname,"/public/popup.js")
//app.use(express.static(static_path2))

//console.log(path.join(__dirname,"/public/popup.js"))


const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");



const JWT_SECRET =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haWx0b21yc3Jpbml2YXN1bHVAZ21haWwuY29tIiwiaWF0IjoxNzAyMTA5OTEwLCJleHAiOjE3MDIxMTA4MTB9.TI6n07etuv_U5Auioe3iKrhJRIn7gyC6vVKgbGjdgN";

const mongoUrl =
'mongodb+srv://Sreenivasulu_Chowdam:Sreenu%402004@cluster1.usezpl8.mongodb.net/';



mongoose
  .connect(mongoUrl).then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./models/userDetails");
require("./models/imageDetails");
require("./models/blogContactMsg");
require("./public/popup2")
//app.get('/', (req, res) => {res.sendFile(__dirname+"/index.html");});
//app.get('/', (req, res) => {res.sendFile(__dirname+"/styles.css");});
//app.get('/', (req, res) => {res.sendFile(__dirname+"/script.js");});
//app.get('/', (req, res) => {res.sendFile(__dirname+"/bg_REG_FORM_1.avif");});
  
const User = mongoose.model("UserInfo");
const Images = mongoose.model("ImageDetails");


app.post("/blogContactMsg", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create a new instance of the model with data from the request body
    const newContactMessage = new mongoose.model("Blog_Contact_Msg_Info")({
      name,
      email,
      subject,
      message,
    });

    // Save the new contact message to MongoDB
    await newContactMessage.save();

    // Respond with a success message
    res.status(201).json({ message: " message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.redirect("/user_exist");
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    //openPopup("Registration successful!");
    //res.send({ status: "ok" });
    res.redirect("/reg_success");
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      //return res.json({ error: "User not found" });
      return res.redirect("/first_register");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "15m"
      }); 
      //app.get('/', (req, res) => {res.sendFile(__dirname+"../backend-registration-form/public/login_success.html");});
      //app.use(express.static(static_path2))
      //openPopup("Login successful!");
      //openModal("Login successful!");
      return res.redirect("/login_success");

    } else {
      //app.get('/', (req, res) => {res.sendFile(__dirname+"../backend-registration-form/public/popup.js");});
      //openPopup("Incorrect password. Please try again.");
      //openModal("Incorrect password. Please try again.");
      //return res.json({ status: "error", error: "Invalid Password" });
      return res.redirect("/inv_pass");
    }
  } catch (error) {
    //app.get('/', (req, res) => {res.sendFile(__dirname+"../backend-registration-form/public/popup.js");});
    //app.use(express.static(static_path2))
    //openPopup("Login failed. Please try again later.");
    return res.json({ status: "error", error: "Internal Server Error" });
  }
});


app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});

//app.get('/login_success', (req, res) => {res.sendFile(__dirname+"/public/login_success.html");});
app.get('/login_success', (req, res) => {res.sendFile(__dirname+"/public/blog_index.html");});
app.get('/user_exist', (req, res) => {res.sendFile(__dirname+"/public/user_exist.html");});
app.get('/reg_success', (req, res) => {res.sendFile(__dirname+"/public/reg_success.html");});
app.get('/user_not_found', (req, res) => {res.sendFile(__dirname+"/public/user_not_found.html");});
app.get('/inv_pass', (req, res) => {res.sendFile(__dirname+"/public/inv_pass.html");});
app.get('/forgot-password', (req, res) => {res.sendFile(__dirname+"/public/forgot_pass.html");});
app.get('/first_register', (req, res) => {res.sendFile(__dirname+"/public/first_register.html");});

app.listen(5000, () => {
  console.log("Server Started:localhost 5000");
});


app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.redirect("/user_not_found")  
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mailtomrsrinivasulu@gmail.com", 
        pass: "zefr ypfp eejm rrkt", //encoded : "Sreenu%402004" // Gmail app password : zefr ypfp eejm rrkt
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "mailtomrsrinivasulu@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.json({ status: "Error sending email" });

      } else {
        console.log("Email sent: " + info.response);
        return res.json({ status: "Password reset link sent successfully." });
      
      }
    });
    console.log(link);
  } catch (error) { }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log("Decoded Token:", jwt.decode(token));
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    console.log("Verification Result:", verify);
    
    if (verify) {
      res.render("index", { email: verify.email, status: "Not Verified" });
    } else {
      console.log("Token verification failed.");
      res.send("Not Verified");
    }
  } catch (error) {
    console.log("Error during token verification:", error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/deleteUser", async (req, res) => {
  const { userid } = req.body;

  try {
    await User.deleteOne({ _id: userid });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", error: "Internal Server Error" });
  }
});



app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then(data => {
      res.send({ status: "ok", data: data })
    })

  } catch (error) {

  }
})

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=allUser.length;
  results.pageCount=Math.ceil(allUser.length/limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results)
})
