import express from "express"
const router = express.Router()

import {
  insertSettings,
  getUserSettings,
  addUser,
  blockUser,
  deleteUser,
  modifyUser,
  changePassword,
  savePushToken,
  getPushToken,
  getUsers,
  getUserNotification,
  signUp,
  signin,
} from "../controllers/user.js"

router.post("/savePushToken", savePushToken)
router.post("/getPushToken", getPushToken)


router.post("/changePassword", changePassword)
router.post("/modifyUser", modifyUser)
router.post("/addUser", addUser)
router.post("/blockUser", blockUser)
router.post("/getUserSettings", getUserSettings)
router.delete("/deleteUser", deleteUser)

router.get("/getUsers", getUsers)
router.get("/getUserNotification", getUserNotification)






router.post("/user/singup", signUp)
router.post("/user/singin", signin)
export default router
