import { Router } from "express";
import { 
    createSubmission, 
    getSubmissionById, 
    getSubmissionByIdAuthorized,
    getSubmissionsByUserId, 
    getMySubmissions
} from "../controllers/submission.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const submissionRouter: Router = Router();

submissionRouter.post('/', authenticateUser, createSubmission); // POST
submissionRouter.get('/by-me', authenticateUser, getMySubmissions); //
submissionRouter.get('/auth-sub/:submissionId/', authenticateUser, getSubmissionByIdAuthorized); // GETAuth
submissionRouter.get('/by-user/:userId', authenticateUser, getSubmissionsByUserId); // 
submissionRouter.get('/:submissionId/', authenticateUser, getSubmissionById); // GET



export default submissionRouter;