const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

// api/auth/register
router.post('/register',
    [
        check('email', 'incorrect email').isEmail(),
        check('password', 'incorrect password').isLength({ min: 6 })
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'incorrect data reg'
                });
            }

            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: 'no unique email' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });

            await user.save();
            res.status(201).json({ message: 'user add' });

        } catch (error) {
            res.status(500).json({ message: 'Serv err 500' });
        }
    });

// api/auth/login
router.post('/login',
    [
        check('email', 'incorrect email').normalizeEmail().isEmail(),
        check('password', 'incorrect password').exists()
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'incorrect data login'
                });
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id });

        } catch (error) {
            res.status(500).json({ message: 'Serv err 500' });
        }
    });

module.exports = router;