import axios from "../axios.js"
import User from "../User.js"

import { sha256 } from "js-sha256"


export default async function SignUp(req, res) {
  /* -------------------------------- Get data -------------------------------- */
  const getData = async (url) => {
    return axios.get(url).then((response) => response.data)
  }

  /* ---------------------------- Register new user --------------------------- */
  const registerNewUser = () => {

    
    let userData = {
      username: req.username,
      email: encryptedEmail,
      password: encryptedPassword,
    }

    // Create user
    User.create(userData, (err, data) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(201).send(data)
      }
    })

  }
  
  
  const encryptedEmail = sha256(req.email)
  const encryptedPassword = sha256(req.password)
  

  
   /* -------------------------- Check same email used ------------------------- */
  let dbData = await getData("/getUsers")

  // Loop
  var invalid = false
  dbData.map((elem) => {
    if (elem.email == encryptedEmail) {
      invalid = true
    }
  })

  if (invalid) {
    return res.send("Email already used")
  }
  
  
  /* ------------------------------ Add new user ------------------------------ */
  registerNewUser()
}
