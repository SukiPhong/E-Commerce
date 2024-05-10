import User from "../models/user.js";
import handlePassword from "../utils/hash_password.js"
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"
import dotenv from "dotenv";
import token_Email from "../utils/token_email.js";
import sendMail from "../utils/sendmail.js";
import crypto from "crypto";
dotenv.config()
const authControllers = {
    // Register
    registerUser: asyncHandler(async (req, res) => {
        const hashed = await handlePassword.hashPassword(req.body.password)
        const CheckEmailExiSt = await User.findOne({ email: req.body.email })
        if (CheckEmailExiSt) {
            return res.status(400).json({ success: false, msg: "Email already exists" })
        }
        // Create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashed,
        });
        const savedUser = await newUser.save();
        return res.status(201).json({
            success: savedUser ? true : false,
            CreateUser: savedUser ? savedUser : "Cannot create user"
        })

    }),//accessToken
    functionAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.MY_private_key, {
            expiresIn: "1d"
        }
        );
    },
    functionRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.MY_fresh_key, {
            expiresIn: "365d"
        });
    },
    //login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) 
               throw new Error ("Wrong email!");
            
            const validPassword = await handlePassword.comparePassword(
                req.body.password,
                user.password)
            if (!validPassword) 
                throw new Error("Wrong password");
            if (user && validPassword) {
                const AccessToken = authControllers.functionAccessToken(user)
                const refreshToken = authControllers.functionRefreshToken(user);
                // refreshTokens.push(refreshToken);
                user.refresh_token = refreshToken;
                await user.save();
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    samSite: "strict",
                });
                const { password, ...others } = user._doc; // if u want json => out not password then u change user =...others in line res.status(200).json({user,AccessToken});
                res.status(200).json({ user, AccessToken });
            };
        } catch (error) {
            // res.status(500).json({
            //     message: "cannot login user"
            // });
        }
    },
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookie.refreshToken;
        if (!refreshToken) throw new Error("you're not authenticated");
        const foundUser = await User.findOne({ refresh_token: req.body.refreshToken });//{ email: req.body.email
        if (!foundUser) {
            throw new Error("Invalid refreshToken"); // Token không tồn tại trong cơ sở dữ liệu
        }
        jwt.verify(refreshToken, process.env.MY_fresh_key, async (error, user) => {
            if (error) {
                console.log(error);
            }

            const newAccessToken = authControllers.functionAccessToken(user);
            const newRefreshToken = authControllers.functionRefreshToken(user);
            user.refresh_token = newRefreshToken;
            await user.save();
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            });
            res.status(200).json({ AccessToken: newAccessToken });
        })
    },
    logout: async (req, res) => {
        try {
            const refreshToken = req.body.refreshToken;
            res.clearCookie("refreshToken");
            const user = await User.findOne({ refresh_token: refreshToken });
            if (!user) {
                throw new Error ({mes:'Invalid refresh token' });
            }
            user.refresh_token = null;
            await user.save();
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch {
            res.status(500).json("error");
        }
    },
    forgotPassword:asyncHandler( async (req, res) => {
            const { email } = req.query;
            //console.log(email);
            if (!email)  throw new Error("Please enter a valid email");
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");
            const resetToken = await token_Email.createToken(user);
            console.log(resetToken);
             await user.save();
            const html = ` Please click the link below to reset your password of you account. 
            <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

            const data = {
                email,
                html,
            }
            const response = await sendMail(data);
            setTimeout(async () => {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save();
                // console.log(user.passwordResetToken, user.passwordResetExpires);
            }, 15 * 60 * 1000)
            res.status(200).json({
                success: response ? true : false,
                message: response ? "Check email of you" : "Cannot send email"
    
            })
    
    }),
    resetPassword: async (req, res) => {
        const { token, password } = req.body;
         console.log(token, password);
        if (!token || !password)
            return res.status(403).json("Missing token or password")
        const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } });
        if (!user) {
            console.log(user);
            return res.status(403).json("error")
        }
        const hashed = await handlePassword.hashPassword(password);
        user.password = hashed;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
         await user.save();
        res.status(200).json({
            success: user ? true : false,
            message: user ? "Reset password successfully " : "Update Password Failed"
        })
    }

};

export default authControllers;