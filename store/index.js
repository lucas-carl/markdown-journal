import axios from '~/plugins/axios'

export const state = () => ({
	authUser: null,
	authenticated: !!localStorage.getItem('auth_token'),
	files: null,
	openDocument: null
})

export const mutations = {
	SET_USER: (state, user) => {
		state.authUser = user
	},
	SET_FILES: (state, files) => {
		state.files = files
	},
	OPEN_DOCUMENT: (state, doc) => {
		state.openDocument = doc
	},
	LOGIN: (state) => {
		state.authenticated = true
	},
	LOGOUT: (state) => {
		state.authenticated = false
	}
}

export const actions = {
	async login ({ commit }, credentials) {
		await axios.post('https://markdown.lucascarl.com/user/login', getFormData(credentials)).then((response) => {
			if (response.status === 200) {
				localStorage.setItem('auth_token', response.data.token)
				commit('SET_USER', response.data)
				commit('LOGIN')
			}
		}, (errorResponse) => {
			if (errorResponse.status === 401) {
				console.warn('Bad credentials!')
			}

			console.warn(errorResponse.body)
		})
	},
	async logout ({ commit }) {
		localStorage.removeItem('auth_token')
		commit('SET_USER', null)
		commit('LOGOUT')
	},
	async loadFiles ({ commit }) {
		try {
			let { data } = await axios.get('https://markdown.lucascarl.com/files')
			commit('SET_FILES', data)
		} catch (error) {
			if (error.response && error.response.status === 401) {
				window.location = '/login'
			}

			throw error
		}
	},
	async openFile ({ commit }, id) {
		try {
			let { data } = await axios.get('https://markdown.lucascarl.com/files/' + id)
			commit('OPEN_DOCUMENT', data)
		} catch (error) {
			if (error.response && error.response.status === 404) {
				throw new Error('File not found')
			} else if (error.response && error.response.status === 401) {
				window.location = '/login'
			}

			throw error
		}
	},
	async createFile ({ commit }, title) {
		let file = {
			title, user_id: 'mail@lucascarl.com'
		}

		try {
			let { data } = await axios.post('https://markdown.lucascarl.com/files', getFormData(file))
			commit('OPEN_DOCUMENT', data)
		} catch (error) {
			throw error
		}
	},
	async saveFile ({ commit }, file) {
		let { data } = await axios.put('https://markdown.lucascarl.com/files/' + file.id, getFormData(file))
		commit('OPEN_DOCUMENT', data)
	}
}

export const getters = {
	user: (state) => {
		return state.authUser
	},
	isLoggedIn: (state) => {
		return state.authenticated
	},
	openDocument: (state) => {
		return state.openDocument
	},
	files: (state) => {
		return state.files
	}
}

const getFormData = (data) => {
	let params = new URLSearchParams()

	for (let key in data) {
		params.append(key, data[key])
	}

	return params
}
