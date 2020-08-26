const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const csurf = require('csurf');
const cookieParser = require('cookie-parser');
app.use(express.urlencoded());
const csrfProtection = csurf({ cookie: true });

app.use(cookieParser())

app.set("view engine", "pug");
const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com",
    age: "35",
    favoriteBeatle:"DungBeatle",
    likesIceCream:true
  },


];

app.get("/", (req, res) => {
  // res.send("Hello World!");
// console.log(users[0])
  res.render("index", {users})
});

app.get("/create", csrfProtection, (req, res)=> {
  const data = {}
  // console.log(req.csrfToken)
  data.csurf = req.csrfToken()
  data.firstName = req.body.firstName
  data.email = req.body.email
  data.lastName = req.body.lastName
  data.password = req.body.password
  data.confirmPassord = req.body.confirmPassord

  console.log(data)
  res.render('create', data)
})

const validateForm = (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body
  const errors = []
  if (!firstName) {
    errors.push("Please fill out the first name field.");
  }
  if (!lastName) {
    errors.push("Please fill out the last name field.");
  }
  if (!email) {
    errors.push("Please fill out the email field.");
  }
  if (!password) {
    errors.push("Please fill out password");
  }
  if (!confirmPassword) {
    errors.push("Passwords do not match!");
  }

  req.errors = errors
  next()
}



app.post("/create", csrfProtection, validateForm, (req, res) => {
      const {firstName, lastName, email, password, confirmPassword } = req.body
      if(req.errors.length>0){
        res.render("create", {
          errors: req.errors,
          csurf: req.csrfToken(),
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          confirmPassword: confirmPassword

        })
        return;
      }

      users.push({
        firstName,
        lastName,
        email,
        password,
        confirmPassord
      })

        res.redirect("/")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;




















