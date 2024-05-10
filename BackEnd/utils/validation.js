import { check, validationResult } from 'express-validator';

const Checker = {
  validateRegisterUser:() => {
    return [ 
      check('username', 'Username cannot be empty').not().isEmpty(),
      check('username', 'Username must be alphanumeric').matches(/^[\w\s\u00C0-\u1FFF]+$/u),
      check('username', 'Username must be at least 6 characters long').isLength({ min: 6 }),
      check('email', 'Email cannot be empty').not().isEmpty(),
      check('email', 'Invalid email').isEmail(),
      check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
    ];  
  },
  validateLogin: () => {
    return [ 
      check('email', 'Email cannot be empty').not().isEmpty(),
      check('email', 'Invalid email').isEmail(),
      check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
    ]; 
  },
  validateResetPassword :()=>{
    return[
      check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
    ]
  },
  validateForgotPassword :()=>{
    return[
      check('email', 'Email cannot be empty').not().isEmpty(),
      check('email', 'Invalid email').isEmail()
    ]
  },
  handleValidationErrors: (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
};

export default Checker;
