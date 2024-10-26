import jwt from 'jsonwebtoken'
import TokenModel from '../model/Token.model.js'

export const TokenService = {
	generateAccessToken: (payload) => {
		return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
			expiresIn: '30s',
		})
	},
	generateRefreshToken: (payload) => {
		return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
			expiresIn: '7d',
		})
	},
	verifyAccessToken: (token) => {
		try {
			return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
		} catch (error) {
			return null
		}
	},
	verifyRefreshToken: (token) => {
		return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET)
	},
	saveToken: async (userId, refreshToken) => {
		const tokenData = await TokenModel.findOne({ user: userId })

		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		} else {
			const token = await TokenModel.create({
				user: userId,
				refreshToken: refreshToken,
			})
			return token
		}
	},
	deleteToken: async (refreshToken) => {
		const tokenData = await TokenModel.deleteOne({ refreshToken })
		return tokenData
	},
	findToken: async (refreshToken) => {
		const tokenData = await TokenModel.findOne({ refreshToken })
		return tokenData
	},
}
