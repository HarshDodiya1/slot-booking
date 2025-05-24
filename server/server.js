const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

dotenv.config();
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN1, process.env.CORS_ORIGIN1],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Imported Routes
const bookingRoutes = require("./routes/bookingRoutes.js");

// Routes
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Slot Booking App Backend APIs",
    creator: "Harsh Dodiya",
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`⚙️  Server is running at port: ${process.env.PORT}`);
});
