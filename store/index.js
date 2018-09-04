import axios from '~/plugins/axios'

export const state = () => ({
  authUser: null,
  authenticated: !!localStorage.getItem('auth_token'),
  files: null,
  folders: null,
  openDocument: null
})

export const mutations = {
  SET_USER: (state, user) => {
    state.authUser = user
  },
  SET_FOLDERS: (state, folders) => {
    state.folders = folders
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
  },
  ARCHIVED_FILE: (state) => {
    state.openDocument = null
    state.files = null
  }
}

export const actions = {
  async login ({ commit }, credentials) {
    await axios.post('users/login', getFormData(credentials)).then((response) => {
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
  async register ({ commit }, credentials) {
    await axios.post('users', getFormData(credentials)).then((response) => {
      if (response.status === 200) {
        console.log('Created new user')

        localStorage.setItem('auth_token', response.data.token)
        commit('SET_USER', response.data)
        commit('LOGIN')
      }
    }, (errorResponse) => {
      if (errorResponse.status === 412) {
        console.warn('Email already in use!')
      }

      console.warn(errorResponse.body)
    })
  },
  async logout ({ commit }) {
    localStorage.removeItem('auth_token')
    commit('SET_USER', null)
    commit('LOGOUT')
  },
  async loadFolders ({ commit }) {
    try {
      let { data } = await axios.get('folders')
      commit('SET_FOLDERS', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.location = '/login'
      }

      throw error
    }
  },
  async loadFiles ({ commit }, withArchived = false) {
    try {
      let url = 'files'

      if (withArchived) {
        url += '/all'
      }

      let { data } = await axios.get(url)

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
      let { data } = await axios.get('files/' + id)
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
    try {
      let { data } = await axios.post('files', getFormData({ title }))
      commit('OPEN_DOCUMENT', data)
    } catch (error) {
      throw error
    }
  },
  async saveFile ({ commit }, file) {
    let { data } = await axios.put('files/' + file.id, getFormData(file))
    commit('OPEN_DOCUMENT', data)
  },
  async archiveFile ({ commit }, id) {
    await axios.delete('files/' + id)
    commit('ARCHIVED_FILE')
  },
  async unarchiveFile ({ commit }, id) {
    await axios.post('files/' + id + '/restore')
    commit('ARCHIVED_FILE')
  },
  async purgeArchive ({ commit }) {
    await axios.delete('files')
  },
  async moveFile ({ commit }, { file, destination }) {
    const data = destination === false ? null : getFormData({destination})
    await axios.post('files/' + file + '/move', data)
  },
  async createFolder ({ commit }, title) {
    await axios.post('folders', getFormData({ title }))
    actions.loadFolders({ commit })
  },
  async deleteFolder ({ commit }, id) {
    await axios.delete('folders/' + id)
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
  },
  validFiles: (state) => {
    if (!state.files) {
      return null
    }

    return state.files.filter(file => file.deleted_at == null)
  },
  folders: (state, getters) => {
    if (!getters.validFiles) {
      return null
    }

    return state.folders.map(folder => {
      return {
        ...folder,
        files: getters.validFiles.filter(file => file.folder_id === folder.id)
      }
    })
  },
  unsortedFiles: (state, getters) => {
    if (!getters.validFiles) {
      return null
    }

    return getters.validFiles.filter(file => file.folder_id == null)
  },
  archivedFiles: (state) => {
    if (!state.files) {
      return null
    }

    return state.files.filter(file => file.deleted_at != null)
  }
}

const getFormData = (data) => {
  let params = new URLSearchParams()

  for (let key in data) {
    params.append(key, data[key])
  }

  return params
}
