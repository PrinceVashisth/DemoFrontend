const bcrypt = require('bcrypt')
const catchAsyncError = require("../Middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Reg = require('../models/reg')
const crypto = require("crypto");
const sendToken = require("../utils/jwtTokens");


//REGESTERING USER---------
exports.register = catchAsyncError(async (req, res, next) => {
 
  const { name, email, password, phoneNo } = req.body;


  const user = await Reg.create({
    name,
    email,
    password,
    phoneNo
  });

  console.log("created user", user);

  sendToken(user, 201, res);
});

exports.logincheck = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Authenticate user (check email and password)
  const user = await Reg.findOne({ email }).select("+password");

  // If user not found or password doesn't match, return error
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Start session and store user data
  req.session.user = user;


  sendToken(user, 200, res);
});





//LOGOUT--------
exports.userLogOut = catchAsyncError(async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/'); // Redirect to the home page after logout
    });
  } catch (error) {
    return next(new ErrorHandler("Logout failed", 500));
  }
});

// Fetch users by IDs
exports.getUsersByIds = async (req, res) => {
  try {
    const userIds = req.query.id.split(','); // Extract user IDs from query params
    const users = await Reg.find({ _id: { $in: userIds } }); // Find users by IDs
    res.status(200).json({ users }); // Send users data in response
  } catch (error) {
    console.error("Error fetching user data", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
};





// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, repassword } = req.body
//         console.log("password:",password);
//         console.log("repassword:",repassword);
//         const cpass = await bcrypt.hash(password, 10)
//         const usercheck = await Reg.findOne({ email: email })
//         if (usercheck == null) {
//             const record = new Reg({ email: email, password: password, name: name, repassword: repassword })
//             record.save()
//             res.status(201).json({
//                 message: `successfully email has been registered`,
//                 status: 201
//             })
//         } else {
//             res.status(400).json({
//                 message: `${email} is already register`
//             })
//         }
//     } catch (error) {
//         res.status(400).json({
//             message: error.message,
//             status: 400
//         })

//     }
// }

// exports.logincheck = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const record = await Reg.findOne({ email: email })
//         if (record !== null) {
//             let compare = await bcrypt.compare(password, record.password)
//             if (compare) {
//                 res.json({
//                     status: 200,
//                     email: record.email
//                 })
//             } else {
//                 res.status(400).json({
//                     status: 400,
//                     message: "Wrong credentails"
//                 })
//             }
//         } else {
//             res.status(400).json({
//                 status: 400,
//                 message: "Wrong credentails"
//             })
//         }
//     } catch (error) {
//         res.status(400).json({
//             status: 400,
//             message: error.message
//         })
//     }
// }