//app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./db.js";
import newuserRouter from "./Routes/newuser.route.js";
import doctorRouter from  "./Routes/doctor.route.js";

dotenv.config();

const port = process.env.PORT || 3000;


const app = express();
connectdb()

app.use(cors({
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

//Routes
app.use('/api/newuser', newuserRouter);
app.use('/api/doctor', doctorRouter);

app.get('/', (req, res) => {
    res.send("HELLO WORLD");
});

app.listen(port, () => {
    console.log(`server is listening ${port}`);
});

export default app;