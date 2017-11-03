<template>
  <main>
    <section class="page-editor">
      <header>
        <router-link class="icon-link link-back" to="/">
          <i class="material-icons">keyboard_arrow_left</i>
        </router-link>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addStrong">
          <i class="material-icons">format_bold</i>
        </a>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addItalic">
          <i class="material-icons">format_italic</i>
        </a>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addCode">
          <i class="material-icons">code</i>
        </a>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addLink">
          <i class="material-icons">link</i>
        </a>

        <div class="dropdown-menu">
          <a class="icon-link" href="#" @click.prevent="showDropdown = true">
            <i class="material-icons">expand_more</i>
          </a>
    			<div class="dropdown" v-if="showDropdown">
            <a class="item" href="#" @click.prevent="addPhoto">
              <i class="material-icons">insert_photo</i>
              <span>photo</span>
            </a>
            <a class="item" href="#" @click.prevent="addTable">
              <i class="material-icons">view_list</i>
              <span>table</span>
            </a>
    			</div>
    		</div>
      </header>

      <text-editor :value="document.content"
      	@markdown="(raw, text) => updateText(raw, text)"
				@cmd-s="saveDocument()" @click="hideDropdown"
        ref="editor" v-if="document">
			</text-editor>
    </section>

    <section class="page-content" v-html="text" @click="hideDropdown"></section>
  </main>
</template>

<script>
  import TextEditor from '~/components/TextEditor.vue'

  export default {

    data() {
      return {
        text: '',
				raw: '',
        showDropdown: false
      }
    },

    components: {
      TextEditor
    },

		mounted() {
			if (!this.$route.params.editor) {
				this.$router.push('/')
			}

			this.$store.dispatch('openFile', this.$route.params.editor)
		},

    methods: {
      updateText(raw, val) {
				this.raw = raw
        this.text = val
				this.saveDocument()
      },
			saveDocument() {
				this.$store.dispatch('saveFile', { id: this.document.id, title: this.document.title, content: this.raw })
			},
      hideDropdown(e) {
				if (this.showDropdown === true) {
          e.preventDefault()
					this.showDropdown = false
				}
			},
      addPhoto() {
        this.showDropdown = false
        this.$refs.editor.addPhoto()
      },
      addTable() {
        this.showDropdown = false
        this.$refs.editor.addTable()
      }
    },

		computed: {
			files() {
				return this.$store.getters.files
			},
			document() {
				return this.$store.getters.openDocument
			}
		},

		middleware: 'auth'

  }
</script>
