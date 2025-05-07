import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      trim: true,
      minLength: 2, 
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please tell us your email!'],
      trim: true,
      minLength: 5,
      maxLength: 255,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 6,
    },
  },
  { timestamps: true } 
);

// ✅ bonne pratique : éviter de re-définir le modèle s’il existe déjà (utile en dev avec nodemon)
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
