import mongoose from "mongoose";
import { Document, Schema, model } from "mongoose";
import QuestionInterface from "../interfaces/question.interface";


const QuestionSchema: Schema<QuestionInterface> = new Schema(
  {
    tryout_id: {
      type: Schema.Types.ObjectId, // Foreign key ke Tryout
      ref: "TryoutModel",
      required: true,
    },
    question_text: {
      type: String,
      required: true,
    },
    question_type: {
      type: String,
      enum: ["true_false", "multiple_choice", "short_answer"],
      required: true,
    },
    choices: {
      type: [String], // Hanya digunakan untuk multiple_choice
      validate: {
        validator: function (v: string[]): boolean {
          return this.question_type === "multiple_choice" ? v.length > 1 : true;
        },
        message: "Multiple choice harus memiliki minimal dua pilihan.",
      },
    },
    
    correct_answer: {
      type: String, // Hanya satu jawaban benar
      required: true,
      validate: {
        validator: function (v: string): boolean {
          if (this.question_type === "true_false") {
            return ["true", "false"].includes(v);
          }
          if (this.question_type === "multiple_choice") {
            return this.choices?.includes(v) || false;
          }
          return true; // Untuk short_answer bebas asalkan ada isinya
        },
        message: "Jawaban benar harus valid sesuai tipe soal.",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model("QuestionModel", QuestionSchema);

export default QuestionModel;
