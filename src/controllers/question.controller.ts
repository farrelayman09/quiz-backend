import { Request, Response } from "express";
import QuestionModel from "../models/question.model";
import TryoutModel from "../models/tryout.model";
import UserRequestInterface from "../interfaces/requestInterfaces/userRequest.interface";
import CreateQuestionRequest from "../interfaces/requestInterfaces/createQuestionRequest.interface";
import mongoose from "mongoose";

// Membuat pertanyaan (bisa dilakukan oleh semua user yang login)
const createQuestion = async (req: UserRequestInterface, res: Response): Promise<any> => {
    const { question_text, question_type, choices, correct_answer }: CreateQuestionRequest = req.body;
    const { tryoutId } = req.params; // Ambil tryoutId dari route params

    try {
        const tryout = await TryoutModel.findById(tryoutId);

        // Checkings
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }
        if (req.user._id.toString() != tryout.createdBy.toString()) {
            return res.status(404).send("Anda tidak memiliki akses untuk menambah pertanyaan di tryout ini");
        }
        if (tryout.status === "locked") {
            return res.status(400).json({ message: "Tidak bisa menambah pertanyaan pada tryout yang sudah dikunci." });
        }

        const question = new QuestionModel({ tryout_id: tryoutId, question_text, question_type, choices, correct_answer, createdBy: req.user._id });
        await question.save();

        // Hitung ulang jumlah pertanyaan
        const totalQuestions = await QuestionModel.countDocuments({ tryout_id: tryoutId });
        if (tryout.status === "draft" && totalQuestions >= 1) {
            await TryoutModel.findByIdAndUpdate(tryoutId, { status: "ready" });
        }
        // json semua pertanyaan yang  di tryout ini
        const allQuestions = await QuestionModel.find({ tryout_id: tryoutId });
        res.json(allQuestions);
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

// HMMM bedain antr pembuat/user biasa?
// Mengambil semua pertanyaan berdasarkan tryoutId (hanya jika status Tryout "ready","locked", atau user adalah pembuatnya)
const getQuestionsByTryoutIdAuthorized = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const { tryoutId } = req.params;
        const tryout = await TryoutModel.findById(tryoutId);
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }

        const isOwner = req.user._id.toString() === tryout.createdBy.toString();
        if (!isOwner && tryout.status === "draft" ) {
            return res.status(403).json({ message: "Pertanyaan hanya bisa diakses jika Tryout sudah ready." });
        }
        const questions = await QuestionModel.find({ tryout_id: tryoutId });
        res.json(questions);

    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

const getMyQuestionsByTryoutId = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const { tryoutId } = req.params;
        const tryout = await TryoutModel.findById(tryoutId);
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }

        const isOwner = req.user._id.toString() === tryout.createdBy.toString();
        if (!isOwner) {
            return res.status(403).json({ message: "Anda tidak memiliki akses untuk mengedit tryout ini." });
        }
        const questions = await QuestionModel.find({ tryout_id: tryoutId });
        res.json(questions);

    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

const getQuestionsByTryoutId = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const { tryoutId } = req.params;
        const tryout = await TryoutModel.findById(tryoutId);
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }
        const questions = await QuestionModel.find({ tryout_id: tryoutId });
        res.json(questions);

    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

// Mengupdate pertanyaan (hanya oleh pembuatnya)
const updateQuestion = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const tryoutId = req.params.tryoutId;
        const questionId  = req.params.questionId;
        const { question_text, question_type, choices, correct_answer } = req.body;

        // Checking
        const tryout = await TryoutModel.findById(tryoutId);
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }
        if (req.user._id.toString() != tryout.createdBy.toString()) {
            return res.status(404).send("Anda tidak memiliki akses untuk mengedit tryout ini");
        }
        if (tryout.status === "locked") {
            return res.status(403).json({ message: "Tryout sudah dikunci. Tidak bisa mengedit pertanyaan." });
        }

        const question = await QuestionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Pertanyaan tidak ditemukan" });
        }
        if (req.user._id.toString() !== question.createdBy.toString()) {
            return res.status(403).json({ message: "Anda tidak memiliki akses untuk mengedit pertanyaan ini" });
        }

        question.question_text = question_text || question.question_text;
        question.question_type = question_type || question.question_type;
        question.choices = choices || question.choices;
        question.correct_answer = correct_answer || question.correct_answer;
        question.updatedAt = new Date();

        await question.save();
        res.json({ message: "Pertanyaan berhasil diperbarui", question });
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

// Menghapus pertanyaan (hanya oleh pembuatnya)
const deleteQuestion = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        
        const tryoutId = req.params.tryoutId;
        const questionId = req.params.questionId;
        const tryout = await TryoutModel.findById(tryoutId);
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }
        if (tryout.status === "locked") {
            return res.status(400).json({ message: "Tidak bisa hapus pertanyaan setelah tryout dimulai." });
        }

        const question = await QuestionModel.findById(questionId);
        if (!question ) {
            return res.status(404).json({ message: "Pertanyaan tidak ditemukan" });
        }
        if (req.user._id.toString() !== question.createdBy.toString()) {
            return res.status(403).json({ message: "Anda tidak memiliki akses untuk menghapus pertanyaan ini" });
        }

        // // Misal mau limit minimal 3 pertanyaan uncomment ini
        // const questionCount = await QuestionModel.countDocuments({ tryoutId });
        // if (questionCount <= 3) {
        //     return res.status(403).json({ message: "Tidak bisa menghapus pertanyaan. Minimal harus ada 3 pertanyaan dalam Tryout." });
        // }

        // Cek jumlah sisa pertanyaan
        const remainingQuestions = await QuestionModel.countDocuments({ tryout_id: tryoutId });
        // console.log("Sisa pertanyaan sebelum delete:", remainingQuestions);

        // Jika kurang dari 1, ubah status ke "draft"
        if (remainingQuestions <= 1) {
            await TryoutModel.findByIdAndUpdate(tryoutId, { status: "draft" });
        }

        await QuestionModel.findByIdAndDelete(questionId);
        res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

export { createQuestion, getQuestionsByTryoutId, getQuestionsByTryoutIdAuthorized, 
    getMyQuestionsByTryoutId, updateQuestion, deleteQuestion };
