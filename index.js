if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
} else {
  require('dotenv').config({ path: '.env.development' });
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require("./config/dbConnection");
const userRoutes = require("./routes/Userroutes");
const bodyParser = require("body-parser");

dotenv.config();

connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Middleware

// app.use(bodyParser.json());
// app.use(cors());

// Routes
app.use("/api", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 5001;
const host = '0.0.0.0';
debug = 'true';
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
