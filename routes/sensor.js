import express from "express"
const router = express.Router()

import {
  registerMotionSensorData,
  registerSensorData,
  getAllSensor,
  getWaterPressureSensor,
  getMotionSensor,
} from "../controllers/sensor.js"

router.post("/registerMotionSensorData", registerMotionSensorData)
router.post("/registerSensorData", registerSensorData)

router.get("/getAllSensor", getAllSensor)
router.get("/getWaterPressureSensor", getWaterPressureSensor)
router.get("/getMotionSensor", getMotionSensor)

export default router
