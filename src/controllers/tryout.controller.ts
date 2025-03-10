import CreateTryoutRequest from "../interfaces/requestInterfaces/createTryoutRequest.interface";
import UserRequestInterface from "../interfaces/requestInterfaces/userRequest.interface";
import TryoutModel from "../models/tryout.model";
import QuestionModel from "../models/question.model";
import { Response } from "express";


const createTryout = async (req: UserRequestInterface, res: Response) => {
    const { title, category }:CreateTryoutRequest = req.body as CreateTryoutRequest
    try {
        const tryout = new TryoutModel({ title, category, creator: req.user.username, createdBy: req.user._id })
        await tryout.save()
        res.json(tryout)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

//  (including draft)
const getAllTryouts = async (req: UserRequestInterface, res: Response) => {
    try {
        res.json(await TryoutModel.find({}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getReadyTryouts = async (req: UserRequestInterface, res: Response) => {
    try {
        res.json(await TryoutModel.find({ status: { $in: ["ready", "locked"] } }));
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getTryoutById = async (req: UserRequestInterface, res: Response) => {
    try {
        const tryoutId = req.params.tryoutId
        res.json(await TryoutModel.findById(tryoutId))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getTryoutsByUserId = async (req: UserRequestInterface, res: Response) => {
    try {
        const userId = req.params.userId
        res.json(await TryoutModel.find({createdBy: userId}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getMyTryouts = async (req: UserRequestInterface, res: Response) => {
    try {
        res.json(await TryoutModel.find({createdBy: req.user._id}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: "blabla" });
        else res.sendStatus(500);
    }
}

const updateTryout = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const tryoutId = req.params.tryoutId;
        const { title, category } = req.body;

        // Cek apakah tryout dengan ID ini ada
        const tryout = await TryoutModel.findById(tryoutId);
        if (!tryout) {
            return res.status(404).json({ message: "Tryout tidak ditemukan" });
        }

        // Validasi authorized user
        if (req.user._id.toString() != tryout.createdBy.toString()) {
            return res.status(404).send("Anda tidak memiliki akses untuk mengedit tryout ini");
        }
        if (tryout.status === "locked") {
            return res.status(403).json({ message: "Tryout sudah dikunci. Tidak bisa mengedit tryout." });
        } 

        // Update hanya field yang diizinkan
        tryout.title = title || tryout.title;
        tryout.category = category || tryout.category;
        tryout.updatedAt = new Date(); // otomatis update waktu

        // Simpan perubahan
        await tryout.save();

        res.json({ message: "Tryout berhasil diperbarui", tryout });
    } catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};


const deleteTryoutById = async (req: UserRequestInterface, res: Response): Promise<any> => {
    try {
        const tryoutId = req.params.tryoutId
        const tryout = await TryoutModel.findById(tryoutId);
        if (!tryout) return res.status(404).send("tryout tidak ditemukan");
        console.log(req.user._id.toString(), tryout.createdBy.toString())

        // Validasi authorized user
        if (req.user._id.toString() != tryout.createdBy.toString()) {
            return res.status(404).send("Anda tidak memiliki akses untuk menghapus tryout ini");
        }  
        if (tryout.status === "locked") {
            return res.status(403).json({ message: "Tryout sudah dikunci. Tidak bisa menghapus tryout." });
        }      

        await QuestionModel.deleteMany({ tryout_id: tryoutId });
        await tryout.deleteOne();

        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { createTryout, getAllTryouts, getReadyTryouts, getTryoutById, getTryoutsByUserId, getMyTryouts, updateTryout, deleteTryoutById }