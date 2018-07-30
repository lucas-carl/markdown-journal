<template>
  <modal @close="$emit('close')">
    <form @submit.prevent="submitForm">
      <div class="modal-body">
        <h4 class="modal-title">Edit</h4>

        <div class="form-group floating-label">
          <input class="custom-input" type="text" v-model="title" placeholder="Title" required autofocus>
          <label>Title</label>
        </div>
      </div>

      <footer>
        <button class="button ghost-button mb-right"
          type="button" @click="$emit('close')">
          CANCEL
        </button>
        <button class="button cta-button" type="submit">
          SAVE
        </button>
      </footer>
    </form>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal.vue'

  export default {

    data() {
      return {
        title: ''
      }
    },

    mounted() {
      this.title = this.file.title
    },

    components: {
      Modal
    },

    methods: {
      submitForm() {
        if (this.file && this.title !== '') {
          let file = {
            id: this.file.id,
            title: this.title,
            content: this.file.content,
            folder_id: this.file.folder_id,
            user_id: this.file.user_id
          }

          this.$store.dispatch('saveFile', file).then(() => {
            this.$emit('success')
          })
        }
      }
    },

    props: {
      file: Object
    }

  }
</script>
