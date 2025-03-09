import { Router } from "express";
import { 
    createQuestion, 
    getQuestionsByTryoutId, 
    updateQuestion, 
    deleteQuestion, 
    getQuestionsByTryoutIdAuthorized,
    getMyQuestionsByTryoutId
} from "../controllers/question.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const questionRouter: Router = Router();

questionRouter.get('/:tryoutId/my-questions', authenticateUser, getMyQuestionsByTryoutId); // GETMINE
questionRouter.get('/:tryoutId/auth-questions', authenticateUser, getQuestionsByTryoutIdAuthorized); // GET
questionRouter.get('/:tryoutId/questions', authenticateUser, getQuestionsByTryoutId); // GETALL
questionRouter.post('/:tryoutId/questions', authenticateUser, createQuestion); // POST
questionRouter.put('/:tryoutId/questions/:questionId', authenticateUser, updateQuestion); // PUT
questionRouter.delete('/:tryoutId/questions/:questionId', authenticateUser, deleteQuestion); // DELETE

export default questionRouter;
