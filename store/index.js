import axios from '~/plugins/axios'

export const state = () => ({
	authUser: null,
	authenticated: false,
	files: null,
	openDocument: null
})

export const mutations = {
	SET_USER: (state, user) => {
		state.authUser = user
	},
	AUTHENTICATED: (state) => {
		state.authenticated = !state.authenticated
	},
	SET_FILES: (state, files) => {
		state.files = files
	},
	OPEN_DOCUMENT: (state, doc) => {
		state.openDocument = doc
	}
}

export const actions = {
	async loadFiles ({ commit }) {
		let { data } = await axios.get('https://markdown.lucascarl.com/files')
		commit('SET_FILES', data)
	},
	async openFile ({ commit }, id) {
		try {
			let { data } = await axios.get('https://markdown.lucascarl.com/files/' + id)
			commit('OPEN_DOCUMENT', data)
		} catch (error) {
			if (error.response && error.response.status === 404) {
				throw new Error('File not found')
			}

			throw error
		}
	},
	async createFile ({commit}, file) {
		try {
			let { data } = await axios.post('https://markdown.lucascarl.com/files', getFormData(file))
			commit('OPEN_DOCUMENT', data)
		} catch (error) {
			throw error
		}
	},
	async saveFile ({commit}, file) {
		let { data } = await axios.put('https://markdown.lucascarl.com/files/' + file.id, getFormData(file))
		commit('OPEN_DOCUMENT', data)
	}
}

export const getters = {
	user: (state) => {
		return state.authUser
	},
	openDocument: (state) => {
		return state.openDocument
	}
}

const getFormData = (data) => {
	let params = new URLSearchParams()

	for (let key in data) {
		params.append(key, data[key])
	}

	return params
}
