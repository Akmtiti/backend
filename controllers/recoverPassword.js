import EmailSender from "../functions/EmailSender.js"
import User from "../models/userModel.js"
import { sha256 } from "js-sha256"
import bcrypt from "bcrypt"

export default function PasswordRestoration(app) {
  // Recover user password
  app.post("/passwordRecovery", async (req, res) => {
    var user = await User.findOne({
      email: req.body.email.toLowerCase().trim(),
    })

    // If Email exist in Database
    if (user) {
      if (user.passwordRecovery == null) {
        return res
          .status(500)
          .send("Un nouveau mot de passe est déjà envoyé à ce email.")
      }
      let generatedPassword = makeid(5)
      let message = `<div className="email" style="
      border: 1px solid black;
      padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>Voici votre nouveau mot de passe :</h2>
        <p>Vous pouvez le changer à nouveau dans le menu 'paramètre du compte'.</p>
        <p>Ce mot de passe expire dans 60 secondes.</p>
        <p>${generatedPassword}</p>
        
         </div>
    `
      const encryptedPassword = await bcrypt.hash(sha256(generatedPassword), 10)

      // Set Recovery password to user
      await User.findOneAndUpdate(
        { email: req.body.email },
        {
          passwordRecovery: encryptedPassword,
        }
      )

      // Send email
      EmailSender(req.body.email, "Restoration de mot de passe", message)

      // Recovery Password Expire
      setTimeout(async () => {
        await User.findOneAndUpdate(
          { email: req.body.email },
          {
            passwordRecovery: null,
          }
        )
      }, 60000)

      res.send("Un email a été envoyé à votre boîte mail.")
    } else res.status(500).send("Email introuvable.")
  })
}

function makeid(length) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
