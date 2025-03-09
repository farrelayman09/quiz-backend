import mongoose from "mongoose"

interface UserInterface extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
  }

  export default UserInterface;