import mongoose from 'mongoose';
import UserInterface from '../interfaces/user.interface';


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });


const UserModel  =  mongoose.model<UserInterface & mongoose.Document>('UserModel', UserSchema);

export default UserModel;