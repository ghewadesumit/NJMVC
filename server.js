const express = require('express');

const app = express();

app.get('/api', (req, res) => {
  res.json(`message:Hello from mvc Server`);
});

// Init Middleware
app.use(express.json({ extended: false }));

app.use('/api/mvc_search', require('./routes/mvcSearch'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Start listening ${PORT}`);
});
