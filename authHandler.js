const { client } = require("./dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "sklep secret", { expiresIn: maxAge });
};

// Middleware checking if user is logged in based on JWT token
const requireAuth = (req, res, next) => {
  const token = req.body.token;

  // ckeck json webtoken exists

  console.log("token is truthy?", token);

  if (token) {
    console.log("jwt", jwt);
    jwt.verify(token, "sklep secret", (err, decodedToken) => {
      if (err) {
        console.log("preszło tutaj");
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
    // console.log(client);
    const foundUsers = await client.query(query);
    const isEmailVerified = foundUsers.rows.length > 0;
    if (isEmailVerified) {
      return res.json({
        ifEmailExists: true,
        message: "email already exists",
      });
    }

    if (!isEmailVerified) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = {
        text: "INSERT INTO sklepusers (name, lastname, email, street, flatnumber, password, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)",
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
      console.log("przeszlo2", lastName);

      await client.query(query);
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
    res.status(403).send("Coś nie tak");
    console.log(error);
  }
};

const handleLogin = async (req, res) => {
  const { password, email } = req.body;
  const text = "SELECT * from sklepusers where email = $1";
  const values = [email];

  try {
    const foundUsers = await client.query(text, values);
    const isEmailFound = foundUsers.rows.length > 0;

    console.log({ password });

    if (!isEmailFound) {
      return res.json({
        message: "User does not exist",
        userExists: false,
        details: {},
      });
    }

    const { id, name, lastname, street, flatnumber, phone } =
      foundUsers.rows[0];
    const databasePassword = foundUsers.rows[0].password;
    console.log({ databasePassword });

    if (databasePassword) {
      const auth = await bcrypt.compare(password, databasePassword);
      console.log({ auth });
      if (auth) {
        const token = createToken(foundUsers.rows[0].id);
        console.log({ token });
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
          userExists: true,
        });
      } else {
        res.json({
          message: "wrong password",
          details: {},
          userExists: true,
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
