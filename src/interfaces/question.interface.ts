import mongoose from "mongoose";

interface QuestionInterface {
  _id: mongoose.Types.ObjectId;
  tryout_id: mongoose.Types.ObjectId; 
  question_text: string;
  question_type: "true_false" | "multiple_choice" | "short_answer"; // Enum for tipe soal
  choices?: string[]; // only for multiple_choice
  correct_answer: string; // 1 correct answer
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId; 
  updatedAt: Date;
}

export default QuestionInterface;
