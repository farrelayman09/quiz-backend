import mongoose from "mongoose";

interface SubmissionAnswerInterface {
  question_id: mongoose.Types.ObjectId; // Referensi ke Question
  answer: string; 
  is_correct?: boolean; 
}

interface SubmissionInterface {
  _id: mongoose.Types.ObjectId; 
  user_id: mongoose.Types.ObjectId; 
  tryout_id: mongoose.Types.ObjectId;
  answers: SubmissionAnswerInterface[]; 
  score: number; 
  submitted_at: Date; 
  status: "pending" | "submitted"; // Status pengiriman
  createdAt: Date;
  updatedAt: Date;
}

export default SubmissionInterface;
