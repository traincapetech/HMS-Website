import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express();

const port = process.env.PORT 

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}))

app.get('/', (req, res)=>{
    res.send('hello world')
});

app.listen(3000, ()=> {
    console.log(`server is running on port ${port}`);
    
})