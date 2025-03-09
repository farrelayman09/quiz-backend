import mongoose from "mongoose";

interface TryoutInterface {
  _id: mongoose.Types.ObjectId; // ObjectId otomatis dari MongoDB
  title: string;
  category: string;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId; // ref ke User
  updatedAt: Date;
  status: "draft" | "ready" | "locked";
}

export default TryoutInterface;
