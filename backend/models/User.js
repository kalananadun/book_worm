import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:''
    }

})
// hash the password 
userSchema.pre('save',async (next)=>{
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(100);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})


const User = mongoose.model('User',userSchema);

export default User;
