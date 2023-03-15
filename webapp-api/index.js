import express from 'express';
import cors from 'cors';

import { Person } from './person.js';

const app = express();
const port = 3000;

app.use(express.json(), cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post("/imc/calculate", (req, res) => {
    const {
        height, 
        weight
    } = req.body;
    
    const person = new Person(height, weight)
        .withImc()
        .withImcDescription();
    
    res.send(JSON.stringify(person));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});