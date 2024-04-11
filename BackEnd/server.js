import express from 'express';
import mysql2 from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
const salt = 10;


const app= express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const daba = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database: 'sitiowebbuses'


})
app.post('/registro', (req, res) => {
    const sql = "INSERT INTO usuarios (name, username, password, identification) VALUES (?)";

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err) return res.json({Error: "Error for hassing password"});
        const values = [

            req.body.name,
            req.body.username,
            hash,
            req.body.identification
           
           
        ]
        daba.query(sql, [values], (err,result) => {
            if(err) return res.json({Error: "Error in saving the data"});
            return res.json({Status: "Success"});
        })
    })
    
})
app.post('/login',(req, res) =>{
    const sql = 'SELECT * FROM usuarios WHERE username = ?';
    daba.query(sql,[req.body.username], (err, data) => {
        if(err) return res.json({Error: "Login error in server"});
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err) return res.json({Error: "Error in password comparison"});
                if(response){
                    return res.json({Status: "Success"});
                }
                else{
                    return res.json({Error: "La contraseña no coincide"});
                }

            })

        }
        else{
            return res.json({Error: "No email in existence"});

        }
    })
})
app.listen(4000, () => {
    console.log("Running.");


})