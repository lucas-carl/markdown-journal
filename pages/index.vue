<template>
	<main>
		<section class="page-sidebar" @click.prevent="hideDropdown">
			<div class="file-tree">
				<a class="file-item" v-for="file in validFiles"
					:key="file.id" :class="{active: (document && file.id == document.id)}"
					href="#" @click.prevent="openFile(file.id)">
					<p>{{ file.title }}</p>
					<i class="material-icons">keyboard_arrow_right</i>
				</a>
			</div>

      <footer>
        <a class="icon-link" href="#" title="Create new folder">
          <i class="material-icons">create_new_folder</i>
        </a>
				<a class="icon-link icon-right" href="#"
					@click.prevent="showCreateForm = !showCreateForm"
					title="Create new document">
          <i class="material-icons">note_add</i>
        </a>
      </footer>
    </section>

		<div class="page-menu dropdown-menu">
			<a class="icon-link" href="#" @click.prevent="showFileDropdown = !showFileDropdown">
				<i class="material-icons">more_vert</i>
			</a>
			<div class="dropdown" v-if="showFileDropdown">
				<a class="item" href="#" @click.prevent="showEditForm = true">
					<i class="material-icons">edit</i>
					<span>edit</span>
				</a>
				<a class="item" href="#" @click.prevent="archiveFile(document.id)">
					<i class="material-icons">archive</i>
					<span>archive file</span>
				</a>
				<hr>
				<a class="item highlight-red" href="#" @click.prevent="logout">
					<i class="material-icons">exit_to_app</i>
					<span>log out</span>
				</a>
			</div>
		</div>

    <section class="page-content" v-html="compiledMarkDown" @click.prevent="hideDropdown"></section>

		<create-file-form :archived-files="archivedFiles"
			@close="showCreateForm = false"
			@success="fileCreated" v-if="showCreateForm">
		</create-file-form>

		<edit-file-form :file="document" @close="showEditForm = false" @success="fileCreated" v-if="showEditForm"></edit-file-form>
	</main>
</template>

<script>
	import marked from 'marked'

	import CreateFileForm from '~/components/CreateFileForm.vue'
	import EditFileForm from '~/components/EditFileForm.vue'

	export default {

		data() {
			return {
				showCreateForm: false,
				showEditForm: false,
				showFileDropdown: false
			}
		},

		components: {
			CreateFileForm,
			EditFileForm
		},

		created() {
			this.loadFiles()
		},

		methods: {
			loadFiles() {
				this.$store.dispatch('loadFiles', true).then(() => {
					if (!this.document && this.validFiles.length > 0) {
						this.$store.dispatch('openFile', this.validFiles[0].id)
					}
				})
			},
			openFile(id) {
				if (id === this.document.id) {
					this.$router.push(id)
				}

				this.$store.dispatch('openFile', id)
			},
			fileCreated() {
				this.showEditForm = false
				this.showCreateForm = false
				this.showFileDropdown = false

				this.loadFiles()
			},
			logout() {
				this.$store.dispatch('logout').then(() => {
					this.$router.push('login')
				})
			},
			archiveFile(id) {
				this.hideDropdown()

				this.$store.dispatch('archiveFile', id).then(() => {
					this.loadFiles()
				})
			},
			hideDropdown() {
				if (this.showFileDropdown === true) {
					this.showFileDropdown = false
				}
			}
		},

		computed: {
			files() {
				return this.$store.getters.files
			},
			document() {
				return this.$store.getters.openDocument
			},
			compiledMarkDown() {
				if (!this.document || !this.document.content) {
					return ''
				}

				return marked(this.document.content, { sanitize: true })
			},
			validFiles() {
				if (!this.files) {
					return null
				}

				return this.files.filter(file => file.not_deleted === '1')
			},
			archivedFiles() {
				if (!this.files) {
					return null
				}

				return this.files.filter(file => file.not_deleted === '0')
			}
		},

		middleware: 'auth'

	}
</script>
