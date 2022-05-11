import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const insertSettings = async (req, res) => {
    User.findOneAndUpdate(
        { username: req.body.username },
        {
            minThreshold: req.body.minThreshold,
            maxThreshold: req.body.maxThreshold,
            alert: req.body.alert,
        },
        {
            new: true,
        },
        (err, doc, raw) => {
            if (err) {
                return res.status(500).send("Erreur lors de la modification");
            }
            res.send("Modification accomplie");
        }
    );
};
export const getUserSettings = async (req, res) => {
    await User.findOne({ username: req.body.username }).then((user) => {
        res.send([user.minThreshold, user.maxThreshold, user.alert]);
    });
};
export const addUser = async (req, res) => {
    // Password arrives already encrypted... we use bcrypt on them
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    //  Register new user
    const registerNewUser = () => {
        User.create(
            {
                username: req.body.username,
                email: req.body.email.toLowerCase().trim(),
                password: encryptedPassword,
                privilege: "User",
            },
            (err, data) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(201).send("Compte crée");
                }
            }
        );
    };

    // Check if username or email already used
    User.findOne(
        {
            $or: [
                { username: req.body.username },
                { email: req.body.email.toLowerCase().trim() },
            ],
        },
        (err, data) => {
            if (data) {
                if (data.username == req.body.username) {
                    res.status(500).send("Nom d'utilisateur déjà utilisé");
                }
                if (data.email == req.body.email) {
                    res.status(500).send("Email déjà utilisé");
                }
            } else {
                registerNewUser();
            }
        }
    );
};

export const blockUser = async (req, res) => {
    User.findOne({ username: req.body.username }, function (err, User) {
        User.block = !User.block;
        if (User.block == true) {
            User.refreshToken = null;
            User.accessToken = null;

            res.send(req.body.username + " a été bloqué");
        } else {
            res.send(req.body.username + " a été débloqué");
        }
        User.save();
    });
};
export const deleteUser = async (req, res) => {
    console.log(req.body);
    await User.deleteOne({ username: req.body.username });
    res.send(req.body.username + " a été supprimé");
};
export const modifyUser = async (req, res) => {
    // Check Valid Email
    if (checkValidEmail(req.body.email)) {
        var replaceWith;
        // Check if no new password is sent...
        if (!req.body.password) {
            replaceWith = {
                username: req.body.username,
                email: req.body.email,
            };
            // If a new password is sent...
        } else if (req.body.password.length > 3) {
            replaceWith = {
                username: req.body.username,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
            };
            // Password too short
        } else {
            return res.send("Mot de passe doit dépasser 3 caractères");
        }

        // Modify user credentials
        await User.findOneAndUpdate(
            { username: req.body.originalUsername },
            replaceWith
        );

        res.send(req.body.originalUsername + " a été modifier");
    } else {
        res.send("Email Invalide");
    }
};

export const changePassword = async (req, res) => {
    app.post("/changePassword", async (req, res) => {
        // Find user credentials
        const user = await User.findOne({
            username: req.body.username,
        });

        if (await bcrypt.compare(req.body.initialPassword, user.password)) {
            User.findOneAndUpdate(
                { username: req.body.username },
                {
                    password: await bcrypt.hash(req.body.newPassword, 10),
                },
                (err, doc, raw) => {
                    res.send("Mot de passe changé");
                }
            );
        } else {
            res.status(500).send("Mot de passe initial est incorrect");
        }
    });
};
export const savePushToken = async (req, res) => {
    await User.findOneAndUpdate(
        { username: req.body.username },
        { token: req.body.token },
        {
            new: true,
        }
    );

    res.send(req.body);
};
export const getPushToken = async (req, res) => {
    await User.findOne({ username: req.body.username }, function (err, user) {
        if (user) {
            res.send(User.token);
        }
    });
};
export const getUsers = async (req, res) => {
    User.find({ privilege: "User" }, function (err, user) {
        if (err) {
            res.send(err);
        }
        res.send(user);
    });
};
export const getUserNotification = async (req, res) => {
    var date, sensorType;
    req.query.date
        ? (date = {
              $expr: {
                  $eq: [
                      req.query.date,
                      {
                          $dateToString: {
                              date: "$createdAt",
                              format: "%Y-%m-%d",
                          },
                      },
                  ],
              },
          })
        : (date = {});

    req.query.sensorType
        ? (sensorType = {
              device: req.query.sensorType,
          })
        : (sensorType = {});

    // Get username notification
    User.findOne(
        {
            username: req.query.username,
        },
        { notifications: 1 }
    )
        .populate({
            path: "notifications",

            match: {
                $and: [sensorType, date],
            },
        })
        .exec(function (err, data) {
            if (err) {
                res.send(err);
            }
            res.send(data);
        });
};

function checkValidEmail(x) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(x);
}

export const signin = async (req, res) => {
    console.log(req.body);

    let count = await User.countDocuments({email : req.body.email});


    if (count === 0) {
      return res.status(500).send('Compte introuvable.')
    }

let result = await User.find({password : req.body.password})

if (result) {
  res.send("trouvé")
  
}else{
  res.status(500).send('Mot de passe incorrect..')
}
};

export const signUp = async (req, res) => {
    console.log(req.body);

    User.create(req.body, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
    return;

    const getData = async (url) => {
        return axios.get(url).then((response) => response.data);
    };

    const registerNewUser = () => {
        let userData = {
            username: req.username,
            email: encryptedEmail,
            password: encryptedPassword,
        };

        // Create user
        User.create(userData, (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send(data);
            }
        });
    };

    const encryptedEmail = sha256(req.email);
    const encryptedPassword = sha256(req.password);

    /* -------------------------- Check same email used ------------------------- */
    let dbData = await getData("/getUsers");

    // Loop
    var invalid = false;
    dbData.map((elem) => {
        if (elem.email == encryptedEmail) {
            invalid = true;
        }
    });

    if (invalid) {
        return res.send("Email already used");
    }

    /* ------------------------------ Add new user ------------------------------ */
    registerNewUser();
};
