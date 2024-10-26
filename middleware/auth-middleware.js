import { TokenService } from '../service/tokenCervice.js'

export const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization
	if (authHeader) {
		const token = authHeader.split(' ')[1]
		const data = TokenService.verifyAccessToken(token)
		if (!data) {
			return res.status(403).json({ message: 'Invalid token' })
		}
		req.user = data
		next()
	} else {
		return res.status(401).json({ message: 'Unauthorized' })
	}
}
