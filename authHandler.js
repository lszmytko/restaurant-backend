const { client } = require("./dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyEmail = async (email) => {
  try {
    let verificationResult = await client.query("SELECT * from sklepusers");
    res.json({
      message: "udało się",
    });
  } catch (error) {
    console.log(error);
  }
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "sklep secret", { expiresIn: maxAge });
};

// Middleware checking if user is logged in based on JWT token
const requireAuth = (req, res, next) => {
  const token = req.body.token;

  console.log("tokennnnnnn", req.body);

  // ckeck json webtoken exists

  if (token) {
    jwt.verify(token, "sklep secret", (err, decodedToken) => {
      if (err) {
        return res.json("user is not logged in");
      } else {
        console.log("decoded", decodedToken);
        next();
      }
    });
  } else {
    return res.json({
      isUserLogged: false,
      message: "You are not logged in",
    });
  }
};

const handleRegister = async (req, res) => {
  const { name, lastName, email, street, flatNumber, password, phone } =
    req.body;

  const query = {
    text: "SELECT name from sklepusers where email = $1",
    values: [email],
  };
  try {
    let verifiedEmail = await client.query(query);
    if (verifiedEmail.rows[0]) {
      const answer = await res.json({
        ifEmailExists: true,
        message: "email already exists",
      });
    }

    if (!verifiedEmail.rows[0]) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const query = {
        text: "INSERT INTO sklepusers (name, lastName, email, street, flatNumber, password, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        values: [
          name,
          lastName,
          email,
          street,
          flatNumber,
          hashedPassword,
          phone,
        ],
      };

      const insertedData = await client.query(query);
      res.json({
        ifEmailExists: false,
        message: "insert complete",
        data: {
          name,
          lastName,
          email,
          street,
          flatNumber,
        },
      });
    }
  } catch (error) {
    res.status(404).send("Coś nie tak");
  }
};

const handleLogin = async (req, res) => {
  const { password, email } = req.body;
  const text = "SELECT * from sklepusers where email = $1";
  const values = [email];

  try {
    const userDetails = await client.query(text, values);

    if (!userDetails.rows[0]) {
      res.json({ message: "User does not exist", userExists:false });
    }

    const { id, name, lastname, street, flatnumber, phone } =
      userDetails.rows[0];
    const databasePassword = userDetails.rows[0].password;
    if (databasePassword) {
      const auth = await bcrypt.compare(password, databasePassword);
      if (auth) {
        const token = createToken(userDetails.rows[0].id);
        console.log(token);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json({
          message: "correct password",
          details: {
            id,
            name,
            lastname,
            street,
            flatnumber,
            phone,
          },
          jwtToken: {
            token,
            maxAge: maxAge * 1000,
          },
          userExists: true
        });
      } else if (!auth) {
        res.json({
          message: "wrong password",
          details: {},
          userExists: true
        });
      }
    }
  } catch (error) {
    res.json({
      error: "somethiiiing wrong",
    });
  }
};

module.exports = { handleRegister, handleLogin, requireAuth };
