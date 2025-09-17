const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address'],
  },
  password: {
    type: String,
  },
  phone_number:{
      type:String,
      unique:true,
      match:[
        /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/,
        'Please enter a valid Phone Number'
      ]
    },
    profilePicUrl: {
      type: String,
      default: "https://res.cloudinary.com/mycloudupload/image/upload/v1757170353/profilepic/oqqga1etealzaal5ocxn.jpg"
    },
    publicId:{
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpires: {
      type: Date
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }

});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);