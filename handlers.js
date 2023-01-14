const { client } = require("./dbConfig");

const handleUpdate = async (req, res) => {
  const id = req.params.id;
  console.log("body", req.body);
  const { name, lastName, street, flatNumber, phone } = req.body;
  const query = {
    text: "UPDATE sklepusers SET name = $1, lastName = $2, street = $3, flatNumber = $4, phone = $5 where id = $6",
    values: [name, lastName, street, flatNumber, phone, id],
  };
  try {
    await client.query(query);
    res.json({
      success: true,
    });
  } catch (e) {
    res.json({
      success: false,
    });
  }
};

const handleCheckDB = async (req, res) => {
  try {
    res.send({
      success: true,
    });
  } catch (error) {
    res.send({
      success: false,
    });
  }
};

const handlePlaceOrder = (req, res) => {
  const { dishes, price, customer_id, date } = req.body;
  const dishesToAdd = JSON.stringify(dishes);
  const query = {
    text: "INSERT INTO orders (dishes, price, customer_id, date) VALUES($1, $2, $3, $4)",
    values: [dishesToAdd, price, customer_id, date],
  };
  try {
    client.query(query);
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
};

const handleShowHistory = async (req, res) => {
  const { id } = req.body;
  const query = {
    text: "SELECT * from orders where customer_id = $1",
    values: [id],
  };
  try {
    const response = await client.query(query);
    console.log("responseeee", response.rows);
    res.json({
      message: response.rows,
    });
  } catch (e) {
    console.log("błąd");
    res.json({
      details: "error",
    });
  }
};

module.exports = {
  handleUpdate,
  handleCheckDB,
  handlePlaceOrder,
  handleShowHistory,
};
