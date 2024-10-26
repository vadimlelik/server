import User from '../model/User.model.js'

export const UserController = {
	getUser: async (req, res) => {
		try {
			const users = await User.find()
			return res.status(200).json({ message: 'users', users })
		} catch (error) {
			console.log('error', error)
		}
	},
}
