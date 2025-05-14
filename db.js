const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/paytm")

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,//referece to User model
        ref : 'User',
        required : true
    },
    balance: {
        type : Number,
        required : true
    }
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account",accountSchema)

module.exports = {User,Account};
// module.exports = {Account};

