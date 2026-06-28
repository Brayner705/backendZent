import jwt from 'jsonwebtoken';

export const tokenverify = (req,res)=>{
    const token = req.headers['authorization']?.split(' ')[1]
    console.log('Token received for verification:', token);
    console.log('JWT_SECRET used for verification:', process.env.JWT_SECRET);
    console.log('Request headers:', req.headers);

    if(!token) return res.status(401).send({error: 'No token provided'})

    try{

        const verify = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verify
        
        return res.status(200).send({message: 'Token is valid', user: verify})

    } catch(error){
        console.error('Token verification error:', error);
        return res.status(401).send({error: 'Invalid token'})
    }
}