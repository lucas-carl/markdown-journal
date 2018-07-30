<template>
  <modal @close="$emit('close')" v-if="!showManager">
    <form class="create-file-form" @submit.prevent="submitForm">
      <div class="modal-body">
        <h4 class="modal-title">Create folder</h4>

        <div class="form-group floating-label">
          <input class="custom-input" type="text" v-model="title" placeholder="Title" required autofocus>
          <label>Title</label>
        </div>
      </div>

      <footer class="actions-container">
        <button class="button ghost-button float-left"
          type="button" @click="showManager = true"
          v-if="folders && folders.length > 0">
          <i class="material-icons icon-left">reorder</i>
          <span>MANAGE</span>
        </button>
        <button class="button ghost-button mb-right"
          type="button" @click="$emit('close')">
          CANCEL
        </button>
        <button class="button cta-button" type="submit">
          CREATE
        </button>
      </footer>
    </form>
  </modal>

  <folder-manager :folders="folders" @close="showManager = false" @success="$emit('close')" v-else></folder-manager>
</template>

<script>
  import { mapGetters } from 'vuex'

  import Modal from '~/components/Modal.vue'
  import FolderManager from '~/components/FolderManager.vue'

  export default {

    data() {
      return {
        title: '',
        showManager: false
      }
    },

    components: {
      Modal,
      FolderManager
    },

    created() {
      this.$store.dispatch('loadFolders')
    },

    methods: {
      submitForm() {
        if (this.title && this.title !== '') {
          this.$store.dispatch('createFolder', this.title).then(() => {
            this.$emit('close')
          })
        }
      }
    },

    computed: {
      ...mapGetters([
        'folders'
      ])
    }

  }
</script>
