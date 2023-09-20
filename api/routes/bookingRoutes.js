const express = require("express");
const router = express.Router();
const cors = require("cors");
const mysql = require("mysql2"); // Require the MySQL module

router.use(cors());
router.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Create a new booking (HTTP POST)
router.post("/create-booking", async (req, res) => {
  const { name, email, phone, guests, dateIn, dateOut } = req.body;

  if (!name || !email || !phone || !guests || !dateIn || !dateOut) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create a MySQL INSERT query to add the booking to the database
  const insertQuery = `
	  INSERT INTO bookings (name, email, phone, guests, date_in, date_out)
	  VALUES (?, ?, ?, ?, ?, ?)
	`;

  // Values to be inserted into the query
  const values = [name, email, phone, guests, dateIn, dateOut];

  // Execute the query
  connection.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error creating booking:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while creating the booking" });
    }

    // Return the newly created booking ID or any other response as needed
    res.status(201).json({
      bookingId: result.insertId,
      message: "Booking created successfully",
    });
  });
});

// Get all booked dates
router.get("/get-all-booked-dates", (req, res) => {
	const query = `
	  SELECT date_in, date_out
	  FROM bookings
	`;

	connection.query(query, (err, results) => {
	  if (err) {
		console.error("Error fetching booked dates:", err);
		return res
		  .status(500)
		  .json({ error: "An error occurred while fetching booked dates" });
	  }
	  const bookedDates = results.map((row) => {
		return { startDate: row.date_in, endDate: row.date_out };
	  });

	  res.json(bookedDates);
	});
  });


// Get all bookings (HTTP GET)
router.get("/get-bookings", (req, res) => {
  const query = "SELECT * FROM bookings";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching bookings" });
    }

    res.status(200).json(results);
  });
});

// Delete a booking by ID (HTTP DELETE)
router.delete("/delete-booking/:id", (req, res) => {
  const bookingId = req.params.id;

  const query = "DELETE FROM bookings WHERE id = ?";

  connection.query(query, [bookingId], (err, result) => {
    if (err) {
      console.error("Error deleting booking:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the booking" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Booking with the specified ID not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  });
});

// Update a booking by ID (HTTP PUT or PATCH)
router.put("/update-booking/:id", (req, res) => {
  const bookingId = req.params.id;
  const updateFields = req.body;

  // Ensure that at least one field to update is provided
  if (Object.keys(updateFields).length === 0) {
    return res
      .status(400)
      .json({ error: "At least one field to update is required" });
  }

  // SQL query to update the booking based on ID
  const query = `
	  UPDATE bookings
	  SET ?
	  WHERE id = ?
	`;

  // Execute the query with the provided fields and booking ID
  connection.query(query, [updateFields, bookingId], (err, result) => {
    if (err) {
      console.error("Error updating booking:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the booking" });
    }

    // Check if any rows were affected (if the booking was found and updated)
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Booking not found or no changes made" });
    }

    // Return a success response
    res.status(200).json({ message: "Booking updated successfully" });
  });
});

module.exports = router;
