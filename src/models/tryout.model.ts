import mongoose from 'mongoose';
import TryoutInterface from '../interfaces/tryout.interface';
import QuestionModel from './question.model';

const TryoutSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Harus ada title"] 
    },  
    category: { 
        type: String, 
        required: [true, "Harus ada category"] 
    },  
    createdAt: { 
        type: Date, 
        default: Date.now 
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
    status: {
        type: String,
        enum: ['draft', 'ready', 'locked'],
        default: 'draft'
    }
}, { timestamps: true });

const TryoutModel = mongoose.model<TryoutInterface & mongoose.Document>('TryoutModel', TryoutSchema);

export async function setTryoutReady(tryoutId: string): Promise<boolean> {
    const questionCount = await QuestionModel.countDocuments({ tryout_id: tryoutId });

    if (questionCount < 3) {
        throw new Error("Tryout must have at least 3 questions to be set as ready.");
    }

    await TryoutModel.findByIdAndUpdate(tryoutId, { status: "ready" });
    return true;
}

export default TryoutModel;

