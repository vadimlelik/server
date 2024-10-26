import User from '../model/User.model.js'
import bcrypt from 'bcrypt'
import { TokenService } from '../service/tokenCervice.js'

export const register = async (req, res) => {
	const { username, password, email } = req.body

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: 'Username and password are required' })
	}

	const isUser = await User.findOne({ email })

	if (isUser) {
		return res.status(400).json({ message: 'User already exists' })
	}

	const hashPassword = await bcrypt.hash(password, 10)
	const newUser = await User.create({ username, password: hashPassword, email })

	const token = TokenService.generateAccessToken({ _id: newUser._id })
	const refreshToken = TokenService.generateRefreshToken({ _id: newUser._id })

	await TokenService.saveToken(newUser._id, refreshToken)

	res.cookie('refreshToken', refreshToken, {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	})

	return res.status(200).json({
		message: 'user register',
		user: newUser,
		accessToken: token,
	})
}
export const login = async (req, res) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}
		const isMatchPassword = await bcrypt.compare(password, user.password)

		if (!isMatchPassword) {
			return res.status(400).json({ message: 'Wrong password' })
		}

		const token = TokenService.generateAccessToken({ _id: user._id })
		const refreshToken = TokenService.generateRefreshToken({ _id: user._id })
		await TokenService.saveToken(user._id, refreshToken)

		res.cookie('refreshToken', refreshToken, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		})

		return res.status(200).json({
			message: 'user login',
			user,
			accessToken: token,
		})
	} catch (err) {}
}
export const logout = async (req, res) => {
	try {
		const { refreshToken } = req.cookies
		const token = await TokenService.deleteToken(refreshToken)
		res.clearCookie('refreshToken')

		return res.json({ message: 'user logout', token })
	} catch (err) {}
	return res.status(200).json({ message: 'Hello logout' })
}
export const refresh = async (req, res) => {
	try {
		const { refreshToken } = req.cookies
		if (!refreshToken) {
			return res.status(401).json({ message: 'Refresh token is not valid' })
		}
		const userData = TokenService.verifyRefreshToken(refreshToken)
		const tokenFromDb = await TokenService.findToken(refreshToken)
		if (!userData || !tokenFromDb) {
			return res.status(401).json({ message: 'Refresh token is not valid' })
		}
		const token = TokenService.generateAccessToken({
			_id: userData._id,
		})
		return res.status(200).json({
			message: 'Token refresh',
			accessToken: token,
		})
	} catch (err) {}
}
