import bcrypt from "bcrypt";

const handlePassword ={
    hashPassword : async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        return hashed;
    },
     comparePassword : async (password, hashedPassword) => {
        const compare = await bcrypt.compare(password, hashedPassword);
        return compare;
    }
}
export default handlePassword;
 
