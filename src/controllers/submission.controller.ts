import { Request, Response } from "express";
import mongoose from "mongoose";
import SubmissionModel from "../models/submission.model";
import UserRequestInterface from "../interfaces/requestInterfaces/userRequest.interface";
import CreateSubmissionRequest from "../interfaces/requestInterfaces/createSubmissionRequest.interface";
import TryoutModel from "../models/tryout.model";

// Membuat submission (hanya pengguna yang login)
const createSubmission = async (req: UserRequestInterface, res: Response): Promise<any> => {
    const { tryout_id, answers }: CreateSubmissionRequest = req.body;
    try {
        const tryout = await TryoutModel.findById(tryout_id.toString());
        const tryout_title = tryout ? tryout.title : null;

        // Checkings
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }
        if (tryout.status === "draft") {
            return res.status(400).json({ message: "Tryout belum siap untuk dikerjakan" });
        }

        const submission = new SubmissionModel({
            user_id: req.user._id,
            tryout_id,
            tryout_title: tryout_title,
            answers,
        });
        console.log(submission);
        await submission.save();

        tryout.status = "locked";
        await tryout.save();
        
        res.status(201).json(submission);
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

const getSubmissionById = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const { submissionId } = req.params;
        const submission = await SubmissionModel.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission tidak ditemukan" });
        }
        res.json(submission);
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

// Mengambil submission berdasarkan ID (hanya pemiliknya)
const getSubmissionByIdAuthorized = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const { submissionId } = req.params;
        const submission = await SubmissionModel.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission tidak ditemukan" });
        }
        if (submission.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Anda tidak memiliki akses untuk melihat submission ini" });
        }
        res.json(submission);
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

// Mengambil semua submission berdasarkan user_id (hanya pengguna yang login bisa cek)
const getSubmissionsByUserId = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const userId = req.params.userId;
        const submissions = await SubmissionModel.find({ user_id: userId });
        res.json(submissions);
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

// Mengambil semua submission berdasarkan user_id (hanya pengguna yang login)
const getMySubmissions = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const submissions = await SubmissionModel.find({ user_id: req.user._id });
        res.json(submissions);
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

export { createSubmission, getSubmissionByIdAuthorized, getSubmissionById, getSubmissionsByUserId, getMySubmissions };

