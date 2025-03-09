import mongoose from 'mongoose';
import { CallbackError } from "mongoose";
import SubmissionInterface from '../interfaces/submission.interface';

const SubmissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    tryout_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'TryoutModel',
    },
    tryout_title: {
        type: String,
        required: true
    },
    answers: [{
        question_id: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'QuestionModel',
        },
        answer: {
            type: String,  
            required: true,
        },
        is_correct: {
            type: Boolean, 
        },
    }],
    score: {
        type: Number,  
        default: 0,
    },
    submitted_at: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'submitted'],  
        default: 'pending',
    },
}, {
    timestamps: true

});

SubmissionSchema.pre("save", async function (next) {
    try {
        const Question = mongoose.model("QuestionModel");

        const answerChecks = this.answers.map(async (answerObj) => {
            const question = await Question.findById(answerObj.question_id);
            if (question) {
                answerObj.is_correct = question.correct_answer === answerObj.answer;
            } else {
                answerObj.is_correct = false; // Jika pertanyaan tidak ditemukan, anggap salah
            }
        });

        await Promise.all(answerChecks);

        // Hitung skor dalam bentuk persentase
        const totalQuestions = this.answers.length;
        const correctAnswers = this.answers.filter(ans => ans.is_correct).length;
        this.score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        next();
    } catch (err) {
        next(err as CallbackError);
    }
});


const SubmissionModel = mongoose.model<SubmissionInterface & mongoose.Document>('SubmissionModel', SubmissionSchema);

export default SubmissionModel;
