import auth from './config/firebaseAdmin.js';

async function authUser(req, res, next) {
    try{
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present and starts with 'Bearer '
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('No token provided or invalid format');
            return res.status(401).json({ error: 'No token provided' });
        }

        //Split the bearer from token and verify it using Firebase Admin SDK
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };
        // console.log('Authenticated user:', req.user);
        next();
    }catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        console.error(`Token verification failed: ${error.message}`);
    }
}

export default authUser;