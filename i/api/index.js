require("dotenv").config()
const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// import controllers
// const userController = require("./controllers/userControllers");
// const serviceController = require("./controllers/servicesController");
// const serviceRequestController = require("./controllers/serviceRequestController");
// const reviewRatingControllers = require("./controllers/reviewRatingControllers");
// const transactionControllers = require('./controllers/transactionController');


// models import
const User = require("./models/User");
// const updatedUser = require("./models/updatedUser")

// middleware
const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// enable CORS for all routes
const corsOptions = {
    origin: "http://localhost:3000",
    Credential: true
}
app.use(cors(corsOptions));

// JWTSECRETE
const secretKey = process.env.JWT_SECRET
// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Multer configuration for file upload 
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("Please upload an image"), false);
    }
};

const upload = multer({ storage, fileFilter });


// controllers
// app.use("/users", userController);
// app.use("/services", serviceController);
// app.use("/serviceRequest", serviceRequestController);
// app.use("/reviewRating", reviewRatingControllers);
// app.use("/transaction", transactionControllers);

app.get("/test", async (req, res) => {
    res.status(200).json("okay working")
})

// connect mongoDB 
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlPArser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB: ", err);
    });


// register
app.post("/register", async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;

    try {

        // check if user exist 
        const findUser = await User.findOne({ email });

        if (findUser) {
            return res.status(403).json({ errorMessaage: "User already exist", findUser })
        }
        // res.json(req.body)
        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10);
        // create a new user
        const createdUser = await User.create({
            email, password: hashedPassword
        });
        // console.log(createdUser);
        jwt.sign({ userID: createdUser._id }, secretKey, {}, (err, token) => {
            // if (err) throw err;
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            // const { password, ...others } = createdUser._doc;
            // console.log({ ...others });

            res.status(201).json({ message: "User Created", token, /*user: { ...others },*/ success: true })
        })
    } catch (err) {
        console.log("register error :", err.message);
        res.status(500).json({ errorMessage: err.message })
    }
})
// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if user exist
        const foundUser = await User.findOne({ email });
        if (!foundUser) { return res.status(401).json("Invalid email.") };

        // check password
        const checkedPassword = await bcrypt.compare(password, foundUser.password);
        if (!checkedPassword) { return res.status(401).json("Incorrect password.") }

        const token = jwt.sign({ userID: foundUser._id }, secretKey, { expiresIn: "1h" });

        // encrypt token
        const encryptedToken = await bcrypt.hash(token, 10);
        res.status(200).json({ success: true, token: encryptedToken, email: foundUser.email, username: foundUser.fullname })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ errorLogin: err.message })
    }


});
// update user
app.post("/update", upload.single("image"), async (req, res) => {
    const { email, fullname, phoneNumber1, phoneNumber2, homeAddress, city, localgvt, state, profession, bio, artisan, isAdmin } = req.body;
    // console.log(req.body);
    // console.log({ email, fullname, phoneNumber1, phoneNumber2, homeAddress, city, localgvt, state, profession, bio });
    // console.log({ email, fullname, phoneNumber, address, profession, artisan, isAdmin });

    try {

        // Get the file path of the uploaded img from multer
        const imagePath = req.file.path;

        // upload img to cloudinary
        const uploadResult = await cloudinary.uploader.upload(imagePath);


        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    image: uploadResult.secure_url,
                    fullname,
                    phoneNumber: [phoneNumber1, phoneNumber2],
                    address: {
                        homeAddress, city, localgvt, state
                    },
                    profession,
                    artisan,
                    isAdmin,
                    bio
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            console.log("Email not registered");
            res.status(401).json({ error: "Email not registered." })
        }

        // console.log("user profile updated ", updatedUser);
        res.status(200).json({ status: "User profile updated", updatedUser });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ updateError: err.message });
    }
});
// search
// app.get("/search", async (req, res) => {
//     const { profession } = req.query;
//     console.log(profession);

//     try {

//         if (!profession) {
//             console.log("Profession parameter is missing");
//             return res.status(404).json({ error: "Profession parameter is missing" })
//         }

//         const users = await User.find({ profession })

//         if (!users || users.length === 0) {
//             console.log("No user found");
//             res.status(404).json({ error: "No user found" })
//         }

//         res.status(200).json(users)


//     } catch (err) {
//         console.log(err.message);
//         res.status(404).json({ error: err.message })
//     }
// })
// app.get("/search", async (req, res) => {
//     const { profession, email } = req.query;
//     // console.log(profession, email); 

//     try {
//         if (!profession) {
//             console.log("Profession parameter is missing");
//             return res.status(400).json({ error: "Profession parameter is missing" });
//         };

//         if (!email) {
//             console.log("Email is missing");
//             return res.status(400).json({ error: "Email parameter is missing" });
//         };


//         // Case-insensitive search by converting both to lowercase
//         const users = await User.find({ profession: { $regex: new RegExp(profession, 'i') } });

//         if (!users || users.length === 0) {
//             console.log("No user found");
//             return res.status(404).json({ error: "No user found" });
//         }

//         // filter the search result by address
//         const loggedInUser = await User.findOne( { email });
//         const loggedInUserAddress =  loggedInUser.address;

//         // console.log(users.address.state, "===", loggedInUserAddress.state);

//         users.map((user)=> {
//             if(loggedInUserAddress.state === user.address.state){
//                 // console.log(user.address.state, "===", loggedInUserAddress.state);
//                 for(let i = 0; i <= user.length; i++){
//                     if(loggedInUserAddress.localgvt == user.address.localgvt){
//                         console.log(user);
//                     }
//                 }
//                 // console.log(`in the "if" `, user);
//                 // console.log(user.address?.state);
//             }
//         })

//         // console.log(loggedInUserAddress);


//         // return res.status(200).json(users);
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// });

app.get("/search", async (req, res) => {
    // console.log("Entered search");
    const { profession, email } = req.query;
    // console.log("parameters:", profession, email);

    try {

        // console.log("in try");
        if (!email) {
            console.log("Email is missing");
            return res.status(400).json({ error: "Please Login" });
        };

        const users = await User.find({ profession: { $regex: new RegExp(profession, 'i') } });
        // console.log("users found ", users);

        if (!users || users.length === 0) {
            // console.log("No user found");
            return res.status(404).json({ error: "No user found" });
        }

        const loggedInUser = await User.findOne({ email });
        const loggedInUserAddress = loggedInUser?.address;

        const filteredUsers = users.filter(user => {
            if (
                loggedInUserAddress.state === user.address.state &&
                loggedInUserAddress.localgvt === user.address.localgvt &&
                loggedInUserAddress.city === user.address.city
            ) {
                return true;
            }
            return false;
        });

        if (filteredUsers.length === 0) {
            const localGvtUsers = users.filter(user =>
                loggedInUserAddress.state === user.address.state &&
                loggedInUserAddress.localgvt === user.address.localgvt &&
                loggedInUserAddress.city !== user.address.city
            );

            if (localGvtUsers.length > 0) {
                return res.status(200).json({ message: "No user found in the city but found in the local government area", users: localGvtUsers })
            } else {
                console.log([]);
                return res.status(200).json({ message: "Profession not found within your city", user: [] })
            }
        }

        // console.log(filteredUsers);
        return res.status(200).json({ filteredUsers });
    } catch (err) {
        console.error("Error from here", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// getMyProfile
app.get("/profile", async (req, res) => {
    const { email } = req.query;

    try {
        const foundUser = await User.findOne({ email });
        res.status(200).json(foundUser)
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})




// start the server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}}`);
})
