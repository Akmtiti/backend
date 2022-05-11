import jwt from "jsonwebtoken"

export default function loginDevice(app) {
 app.post("/authentification/device", async (req, res) => {
   if (
     req.body.password == "{(t!z=NPDF27QzXU" &&
     req.body.deviceId == "Device 1"
   ) {
     const accessToken = jwt.sign(
       { deviceId: req.body.deviceId },
       process.env.ACCESS_TOKEN_SECRET,
       { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRATION_TIME }
     )
     res.send(accessToken)
   }
 })
}
