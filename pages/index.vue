<template>
	<main>
		<section class="page-sidebar">
			<div class="file-tree">
				<a class="file-item" v-for="file in files"
					:key="file.id" :class="{active: (document && file.id == document.id)}"
					href="#" @click.prevent="openFile(file.id)">
					<p>{{ file.title }}</p>
					<i class="material-icons">keyboard_arrow_right</i>
				</a>
			</div>

      <footer>
        <a class="icon-link" href="#">
          <i class="material-icons">create_new_folder</i>
        </a>
				<a class="icon-link icon-right" href="#">
          <i class="material-icons">note_add</i>
        </a>
      </footer>
    </section>

    <section class="page-content" v-html="compiledMarkDown"></section>
	</main>
</template>

<script>
	import marked from 'marked'

	export default {

		created() {
			this.$store.dispatch('loadFiles').then(() => {
				if (this.files.length > 0) {
					this.$store.dispatch('openFile', this.files[0].id)
				}
			})
		},

		methods: {
			openFile(id) {
				if (id === this.document.id) {
					this.$router.push('edit/' + id)
				}

				this.$store.dispatch('openFile', id)
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
				if (!this.document) {
					return ''
				}

				return marked(this.document.content, { sanitize: true })
			}
		},

		middleware: 'auth'

	}
</script>
