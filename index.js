const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
	res.send('OK');
});

app.post('/notification', (req, res) => {
    console.log(req.headers['x-auth']);
	console.log(req.body);
	res.send('OKKK');
});

app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
});
