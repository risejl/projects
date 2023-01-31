const express = require('express');
const app = express();
const PORT = 433;

app.use(express.static('frontend'));

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));