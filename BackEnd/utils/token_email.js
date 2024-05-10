import crypto from 'crypto';
const token_Email ={
    createToken: async(user)=>{
        const token = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken =crypto.createHash('sha256').update(token).digest('hex');
        user.passwordResetExpires=Date.now()+1*60*1000;
        return token;
    }
}
export default token_Email;