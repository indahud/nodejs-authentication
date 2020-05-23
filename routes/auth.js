const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

//Sign Up Route 
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);

  if(error){
    return res.status(400).json({
      error: error.details[0].message
    })
  }

  const isEmailExists = await User.findOne({ email: req.body.email});

  if(isEmailExists){
    return res.status(400).json({error: 'Email already exists'});
  }
  
  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });  
  try {
    const savedUser = await user.save();
    res.json({data: savedUser});
  } catch (error) {
    res.status(400).json({ error });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  // Validate JOI Schema
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ error:   error.details[0].message });
  // Find if the email is correct or not
  const user = await User.findOne({
    email: req.body.email
  });

  if(!user){
    return res.status(400).json({error: 'Email id in incorrect'});
  }

  // Check if the password is correct
  const validatePassword = await bcrypt.compare(req.body.password, user.password);
  if(!validatePassword){
    return res.status(400).json({error: 'Password is incorrect'})
  }

  // Create Token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: {
      token,
    },
  })

  res.json({
    error: null,
    data: {
      message: "Login Successful"
    },
  });
});

module.exports = router;