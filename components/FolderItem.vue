<template>
  <div class="item-group">
    <div class="file-item folder-item" :title="folder.title" @click="toggleFolder">
      <i class="material-icons">{{ isOpen ? 'folder_open' : 'folder' }}</i>
      <p>{{ folder.title }}</p>
    </div>
    <template v-for="file in folder.files" v-if="isOpen">
      <a class="file-item sorted" :class="{active: (document && file.id == document.id)}"
        :key="file.id" :title="file.title"
        href="#" @click.prevent="$emit('open', file.id)">
        <p>{{ file.title }}</p>
        <i class="material-icons">keyboard_arrow_right</i>
      </a>
    </template>
  </div>
</template>

<script>
  export default {

    props: {
      folder: Object
    },

    data() {
      return {
        isExpanded: false
      }
    },

    watch: {
      document() {
        if (this.document && this.isOpen) {
          this.isExpanded = true
        }
      }
    },

    methods: {
      toggleFolder() {
        this.isExpanded = !this.isExpanded
      }
    },

    computed: {
      isOpen() {
        if ((this.document && this.document.folder_id === this.folder.id) || this.folder.files.length === 0) {
          return true
        }

        return this.isExpanded
      },
      document() {
        return this.$store.getters.openDocument
      }
    }

  }
</script>
