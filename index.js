import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import express from 'express';

const app = express();

const db = await sqlite.open({
    filename: './data_plan.do',
    driver: sqlite3.Database
});

console.log('do initialized');


await db.migrate();

app.get('/api/price_plans', async function(req, res) {

    const price_plans = await db.all('select * fromprice_plan');

    res.json({
        price_plans
    })

});

console.log("done!")


const PORT = 6001;
app.listen(PORT, function(){
    console.log('Price plan API started on port ${PORT}')
});