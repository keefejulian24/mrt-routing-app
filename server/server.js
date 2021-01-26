const express = require('express');
const indexRouter = require('./routes/index');

app = express();
app.use('/', indexRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server started on port ' + port);
});

module.exports = app;
