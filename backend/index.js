const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index");
const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Only allows requests from this origin
    methods: "GET, POST, PUT, DELETE", // Limits allowed HTTP methods
    credentials: true // Allows authentication tokens/cookies to be sent
}));

app.use(express.json());
  
app.use("/api/v1",rootRouter);
app.listen(3000);


