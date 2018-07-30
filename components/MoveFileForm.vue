<template>
  <modal @close="$emit('close')">
    <form class="create-file-form" @submit.prevent="submitForm">
      <div class="modal-body">
        <h4 class="modal-title">Move file</h4>

        <div class="files-list" v-for="folder in folders">
          <a class="list-item active" href="#" @click.prevent="moveFile(null)" v-if="file.folder_id === folder.id">
            <i class="material-icons">unarchive</i>
            <p>{{ folder.title }}</p>
          </a>
          <a class="list-item" href="#" @click.prevent="moveFile(folder.id)" v-else>
            <i class="material-icons">arrow_forward</i>
            <p>{{ folder.title }}</p>
          </a>
        </div>
      </div>

      <footer class="actions-container">
        <button class="button ghost-button"
          type="button" @click="$emit('close')">
          CANCEL
        </button>
      </footer>
    </form>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal.vue'

  export default {

    components: {
      Modal
    },

    methods: {
      moveFile(folder) {
        this.$store.dispatch('moveFile', { file: this.file.id, destination: folder }).then(() => {
          this.$emit('success')
        })
      }
    },

    props: {
      file: Object
    },

    computed: {
      folders() {
        return this.$store.getters.folders
      }
    }

  }
</script>
