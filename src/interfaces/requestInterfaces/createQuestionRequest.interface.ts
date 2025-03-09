

export default interface CreateQuestionRequest {
    // tryoutId: mongoose.Types.ObjectId;
    question_text: string;
    question_type: "multiple_choice" | "short_answer"; // Sesuaikan dengan jenis pertanyaan yang diperbolehkan
    choices?: string[]; // Hanya diperlukan jika `question_type` adalah "multiple_choice"
    correct_answer: string;
}


