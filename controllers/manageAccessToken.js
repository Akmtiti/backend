import app from "../config.js"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export function deleteToken() {
  app.delete("/logout", (req, res) => {
    User.findOneAndUpdate(
      { refreshToken: req.body.refreshToken },
      { refreshToken: null, accessToken: null },
      () => {
        res.sendStatus(204)
      }
    )
  })
}

export function verifyToken() {
  return app.post("/token", async (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401)

    if (
      !(await User.findOne({
        refreshToken: refreshToken,
      }))
    ) {
      return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRATION_TIME }
      )
      res.send({ accessToken: accessToken })
    })
  })
}
