<template>
  <main>
    <section class="page-sidebar" @click.prevent="hideDropdown">
      <div class="file-tree">
        <folder-item :key="folder.id" :folder="folder" @open="openFile"
          v-for="folder in sortedFiles"></folder-item>
        <template v-for="file in unsortedFiles">
          <a class="file-item" :class="{active: (document && file.id == document.id)}" :title="file.title"
            :key="file.id" href="#" @click.prevent="openFile(file.id)">
            <p>{{ file.title }}</p>
            <i class="material-icons">keyboard_arrow_right</i>
          </a>
        </template>
        <div class="empty-state" v-if="validFiles && !validFiles.length">
          <hr>
          <p>You have no files, yet.</p>
          <hr>
        </div>
      </div>

      <footer>
        <a class="icon-link" href="#"
        @click.prevent="showFolderForm = !showFolderForm" title="Create new folder">
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
        <a class="item" href="#" @click.prevent="showMoveForm = true">
          <i class="material-icons">folder_open</i>
          <span>move file</span>
        </a>
        <a class="item highlight-red" href="#" @click.prevent="archiveFile(document.id)">
          <i class="material-icons">archive</i>
          <span>archive file</span>
        </a>
        <hr>
        <a class="item" href="#" @click.prevent="logout">
          <i class="material-icons">exit_to_app</i>
          <span>log out</span>
        </a>
      </div>
    </div>

    <section class="page-content" v-html="compiledMarkDown" @click.prevent="hideDropdown"></section>

    <create-file-form :archived-files="archivedFiles"
      @close="showCreateForm = false" v-if="showCreateForm">
    </create-file-form>

    <create-folder-form @close="showFolderForm = false" v-if="showFolderForm"></create-folder-form>

    <edit-file-form :file="document" @close="showEditForm = false" @success="closeDropdown" v-if="showEditForm"></edit-file-form>

    <move-file-form :file="document" @close="showMoveForm = false" @success="closeDropdown" v-if="showMoveForm"></move-file-form>
  </main>
</template>

<script>
  import marked from 'marked'

  import CreateFileForm from '~/components/CreateFileForm.vue'
  import EditFileForm from '~/components/EditFileForm.vue'
  import MoveFileForm from '~/components/MoveFileForm.vue'
  import CreateFolderForm from '~/components/CreateFolderForm.vue'
  import FolderItem from '~/components/FolderItem.vue'

  export default {

    data() {
      return {
        showCreateForm: false,
        showEditForm: false,
        showMoveForm: false,
        showFolderForm: false,
        showFileDropdown: false
      }
    },

    components: {
      CreateFileForm,
      EditFileForm,
      MoveFileForm,
      CreateFolderForm,
      FolderItem
    },

    created() {
      this.loadFiles()
    },

    methods: {
      loadFiles() {
        this.$store.dispatch('loadFolders').then(() => {
          this.$store.dispatch('loadFiles', true).then(() => {
            if (!this.document && this.validFiles.length > 0) {
              this.$store.dispatch('openFile', this.validFiles[0].id)
            }
          })
        })
      },
      openFile(id) {
        if (id === this.document.id) {
          this.$router.push(id)
        }

        this.$store.dispatch('openFile', id)
      },
      closeDropdown() {
        this.showEditForm = false
        this.showMoveForm = false
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
      sortedFiles() {
        let folders = this.$store.getters.folders

        if (!folders || !this.validFiles) {
          return null
        }

        folders.forEach(folder => {
          folder.files = this.validFiles.filter(file => file.folder_id === folder.id)
        })

        return folders
      },
      unsortedFiles() {
        if (!this.validFiles) {
          return null
        }

        return this.validFiles.filter(file => !file.folder_id)
      },
      validFiles() {
        if (!this.files) {
          return null
        }

        return this.files.filter(file => file.deleted_at == null)
      },
      archivedFiles() {
        if (!this.files) {
          return null
        }

        return this.files.filter(file => file.deleted_at != null)
      }
    },

    head() {
      return {
        title: (this.document ? this.document.title + ' | ' : '') + 'Markdown Journal'
      }
    },

    middleware: 'auth'

  }
</script>
