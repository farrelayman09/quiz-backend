import UserInterface from '../user.interface';
import { Request } from 'express';

interface UserRequestInterface extends Request {
    user: UserInterface
};

declare module 'express-serve-static-core' {
    interface Request {
        user: UserInterface
    }
}


export default UserRequestInterface;