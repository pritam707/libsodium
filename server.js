const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())
require('dotenv').config()
const cors = require('cors')

app.use(cors())

const sodium = require('./sodium')

mongoose.set("strictQuery", true);
mongoose.connect(process.env.url, { useNewUrlParser: true });


const userScheema = {
    email: String,
    name: String,
    age: String,
    password: String
}

const userModel = mongoose.model('user', userScheema)


app.post('/signup', (req, res) => {
    try {
        const { email, name, age, password } = req.body

        const userDetails = new userModel({
            email: sodium.createCiphertext(email),
            name: sodium.createCiphertext(name),
            age: sodium.createCiphertext(String(age)),
            password: sodium.createCiphertext(password)
        })

        userDetails.save()

        res.send({ msg: 'user signup sucessfully' })

    }
    catch (err) {
        res.send(err)
    }
})

app.get('/login', async (req, res) => {
    try {
        const { email, password } = req.query
        console.log("sdfghjsdfghjsdfghj", req.query);
        const user = await userModel.findOne({ email: sodium.createCiphertext(email) }).lean()

        if (!user) {
            throw { err: 'User is not available' }
        }

        if (!(password == sodium.decodeCiphertext(user.password))) {
            throw { err: 'password is not correct' }
        }

        if (user) {
            const userObj = {
                msg: "Login successfully",
                userDetails: {
                    email: sodium.decodeCiphertext(user.email),
                    name: sodium.decodeCiphertext(user.name),
                    age: +(sodium.decodeCiphertext(user.age)),
                }
            }

            console.log(userObj)

            res.send(userObj)
        }
        else {
            res.send({ err: "User or password is not correct" })
        }
    }
    catch (err) {
        res.send(err)
    }

})



app.listen(3005)