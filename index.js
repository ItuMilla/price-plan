import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import express from 'express';

const app = express();

// make re.body work
app.use(express.json());

const db = await sqlite.open({
    filename: './data_plan.db',
    driver: sqlite3.Database
});

console.log('db initialized');


// await db.migrate();  

app.get('/', async function (req, res) {
    const pricePlans = await db.all(`select * from price_plan`)
    res.json({
        price_plans: pricePlans
    })
})

app.post('/api/price_plan/update', async function (req, res) {
    const { name, call_cost, sms_cost } = req.body;
    await db.all(`update price_plan set plan_name = ?, sms_price = ?, call_price = ? where plan_name = ?`,
    name,sms_cost,call_cost,name)
    console.log(req.body)
    // res.json({
    //     status: 'success'
    // })

    // const someData = {
    //     sms_price,
    //     call_price,
    //     // price_plan} = req.body;
    // }

});

app.post('/api/phonebill/', async function (req, res) {

    const price_plan = await db.get(`SELECT id, plan_name, sms_price, call_price 
    FROM price_plan where plan_name = ?`, req.body.price_plan);

    const activity = req.body.actions;

    //totalPhonebill logic
    const activities = activity.split(",");
    let total = 0;

    activities.forEach(action => {
        if (action.trim() === 'sms') {
            total += price_plan.sms_price;
        } else if (action.trim() == 'call') {
            total += price_plan.call_price;
        }
    });

    res.json({
        total
    })
})


app.get('/api/price_plans', async function (req, res) {

    const price_plans = await db.all('select * from price_plan');

    res.json({
        price_plans
    })

});

app.post('/api/price_plan/delete', async function (req, res) {
    const { plan_name } = req.body;
    await db.all(`delete from price_plan where plan_name = ?`, plan_name);
});

app.post('/api/price_plan/add', async function (req, res) {
    const { plan_name, sms_price, call_price } = req.body;

    await db.all(`insert into price_plan (plan_name, sms_price, call_price) values (?, ?, ?)`,
        plan_name, sms_price, call_price)
})

console.log("done!")


const PORT = process.env.PORT || 6001;
app.listen(PORT, function () {
    console.log(`Price plan API started on port ${PORT}`)
});