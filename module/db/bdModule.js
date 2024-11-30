const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({ 
    fild:String,
    value:Number
});

var countermodul = mongoose.model('paamotocounter', counterSchema);

const userSchema = new mongoose.Schema({ 
    userName:String,
    userID:Number,
    userPhoto:String,
    email:String,
    password:String,
    mobile:Number,
    reffrom:String,
    refby:String,
    otp:Number,
    city:String,
    country:String,
    state:String,
    address:String,
    postCode:String,
    status:{ type: String, default: "New" },
    regdate: { type: Date, default: Date.now },
    rating:{type:Number, default:0}
});
var usermodul = mongoose.model('paamotouser', userSchema);

const citySchema = new mongoose.Schema({ 
    city:String,
    branch:String,
    country:String,
    state:String,
});
var citymodul = mongoose.model('paamotocity', citySchema);


const branchSchema = new mongoose.Schema({ 
    branch:String,
    country:String,
    state:String,

});
var branchmodul = mongoose.model('paamotobranch', branchSchema);





module.exports={
    counter:countermodul,
    user:usermodul,
    city:citymodul,
    branch:branchmodul
    
}