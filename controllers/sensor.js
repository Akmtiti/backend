
import SensorData from "../models/sensorDataModel.js"

export const registerSensorData = async (req, res) => {
  var waterPressureValueToInt = parseInt(req.body.value)

  //  Get all users who want to receive notification
  var usersToNotify = await User.find({
    $and: [
      {
        $or: [
          { minThreshold: { $gt: waterPressureValueToInt } },
          { maxThreshold: { $lt: waterPressureValueToInt } },
        ],
      },

      { token: { $ne: null } },
    ],
  })

  sendEmailAndNotification(usersToNotify, waterPressureValueToInt, req)

  // Register sensor data
  let sensorData = await SensorData.create(req.body)

  // Register to user notification
  User.updateMany(
    {
      $or: [
        { minThreshold: { $gt: waterPressureValueToInt } },
        { maxThreshold: { $lt: waterPressureValueToInt } },
      ],
    },
    {
      $push: { notifications: sensorData._id },
    },
    (err, data) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(201).send(data)
      }
    }
  )
}
export const registerMotionSensorData = async (req, res) => {
  SensorData.create(req.body, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).send(data)
    }
  })
}

export const getAllSensor = async (req, res) => {
    var dateFilter, lastDate
    ;({ dateFilter, lastDate } = Initialization(req, dateFilter, lastDate))

    SensorData.find(
      {
        ...lastDate,
        ...dateFilter,
      },
      function (err, data) {
        if (err) {
          res.send(err)
        }
        res.send(data)
      }
    )
      .sort({ createdAt: -1 })
      .limit(5)
  }
export const getWaterPressureSensor = async (req, res) => {
  
    var dateFilter, lastDate
    ;({ dateFilter, lastDate } = Initialization(req, dateFilter, lastDate))
    SensorData.find(
      {
        device: "Capteur de pression d'eau",
        ...dateFilter,
        ...lastDate,
        $expr: {
          $or: [
            req.query.over
              ? { $gt: [{ $toInt: "$value" }, parseInt(req.query.over)] }
              : { $lt: [{ $toInt: "$value" }, parseInt(req.query.under)] },
            req.query.under
              ? { $lt: [{ $toInt: "$value" }, parseInt(req.query.under)] }
              : { $gt: [{ $toInt: "$value" }, parseInt(req.query.over)] },
          ],
        },
      },
      (err, data) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).send(data)
        }
      }
    )
      .sort({ createdAt: -1 })
      .limit(5)
  

}
export const getMotionSensor = async (req, res) => {

    var dateFilter, lastDate
    ;({ dateFilter, lastDate } = Initialization(req, dateFilter, lastDate))
    SensorData.find(
      { device: "Capteur de mouvement", ...dateFilter, ...lastDate },
      (err, data) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).send(data)
        }
      }
    )
      .sort({ createdAt: -1 })
      .limit(5)
  
}



function sendEmailAndNotification(usersToNotify, waterPressureValueToInt, req) {
  if (usersToNotify) {
    let message = `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>Watch Live a détecté une  pression qui a dépassé le seuil que vous avez définit.</h2>
        <p>Veuillez vous rendre à l'application Watch Live pour plus d'information.</p>
    
         </div>
    `
    //  For each user
    usersToNotify.map((user, key) => {
      EmailSender(
        user.email,
        "Le niveau de pression d'eau est trop " +
          (waterPressureValueToInt < user.minThreshold ? "faible." : "haut."),
        message
      )

      {
        /*// ! ----------- Prepare notification title and message... -------------- */
      }
      const title =
        waterPressureValueToInt < user.minThreshold
          ? "Alerte : Pression d'eau trop faible."
          : "Alerte : Pression d'eau trop haute."

      axios
        .post("https://exp.host/--/api/v2/push/send", {
          to: user.token,
          title: title,
          body:
            "La pression d'eau ( " +
            req.body.value +
            " ) a dépassé le seuil que vous avez définit.",
        })
        .then(
          (response) => {
            console.log("Notification sent")
          },
          (error) => {
            console.log(error)
          }
        )
    })
  }
}

function Initialization(req, dateFilter, lastDate) {
  if (req.query.date) {
    dateFilter = {
      createdAt: {
        $gte: new Date(req.query.date + "T00:00:00.000Z"),
        $lt: req.query.lastDate
          ? new Date(req.query.lastDate)
          : new Date(req.query.date + "T23:59:59.999Z"),
      },
    }
  } else if (req.query.lastDate) {
    lastDate = {
      createdAt: {
        $lt: new Date(req.query.lastDate),
      },
    }
  }
  return { dateFilter, lastDate }
}