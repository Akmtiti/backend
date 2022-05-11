// require("crypto").randomBytes(64).toString("hex")

import app from "./config.js"

import loginUser from "./controllers/loginUser.js"
import recoverPassword from "./controllers/recoverPassword.js"
import authenticateToken from "./middleware/authenticateToken.js"
import loginDevice from './controllers/loginDevice.js';
import { deleteToken } from "./controllers/manageAccessToken.js"
import { verifyToken } from './controllers/manageAccessToken.js';
import userRouter from './routes/user.js';
import sensorRouter from './routes/sensor.js';

// Login User
loginUser(app)

// Restore password
recoverPassword(app)

// Manage Token
verifyToken()
deleteToken()

// Middleware: Check authorized Access 
// app.use(authenticateToken)

app.use( userRouter)
