import jwt from "jsonwebtoken";
const middlewareControllers = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.MY_private_key, (error, user) => {
                if (error) {
                    res.status(404).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        }
        else {
            res.status(401).json("U're not authenticated");
        }
    },
    verifyTokenAdminAuth: (req, res, next) => {
        middlewareControllers.verifyToken(req, res, () => {
            if (req.user.id  || req.user.admin) {
                next();
            }
            else {
                res.status(403).json("U're not admin");
            }
        });
    }
}

export default middlewareControllers;