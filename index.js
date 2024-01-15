const express = require('express');
require("dotenv").config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// const dbConnet = async () => {
// try {
    
// } catch (error) {
    
// }
// }


app.get("/", (req, res) => {
    res.send("Recipe server is cooking.")
});

app.listen(port, () => {
    console.log(`Recipe server is cooking at port ${port}`);
})