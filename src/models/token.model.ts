import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true
    },
    expiresAt: {   
        type: Date,
        expires: 3600,  // The token will expire in 1 hour
        default: Date.now
    }
})

const TokenModel = mongoose.model('TokenModel', tokenSchema)

export default TokenModel