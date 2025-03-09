import mongoose from "mongoose";

export default interface CreateSubmissionRequest {
  user_id: mongoose.Types.ObjectId; // Referensi ke User
  tryout_id: mongoose.Types.ObjectId; // Referensi ke Tryout
  answers: {
    question_id: mongoose.Types.ObjectId; // Referensi ke Question
    answer: string; // Jawaban user
  }[];
}