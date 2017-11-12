<template>
	<modal @close="$emit('close')" v-if="!showUnarchive">
		<form class="create-file-form" @submit.prevent="submitForm">
			<div class="modal-body">
				<h4 class="modal-title">Create new document</h4>

				<div class="form-group floating-label">
					<input class="custom-input" type="text" v-model="title" placeholder="Title" required autofocus>
					<label>Title</label>
				</div>

				<a class="link" href="#" @click.prevent="showUnarchive = true" v-if="archivedFiles">Re-open an archived file</a>
			</div>

			<footer class="actions-container">
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

	<unarchive-file :archived-files="archivedFiles"
		@close="showUnarchive = false" @success="$emit('close')" v-else>
	</unarchive-file>
</template>

<script>
	import Modal from '~/components/Modal.vue'
	import UnarchiveFile from '~/components/UnarchiveFile.vue'

	export default {

		data() {
			return {
				title: '',
				showUnarchive: false
			}
		},

		components: {
			Modal,
			UnarchiveFile
		},

		methods: {
			submitForm() {
				if (this.title && this.title !== '') {
					this.$store.dispatch('createFile', this.title).then(() => {
						this.$router.push('/')
					}).then(() => {
						this.$emit('success')
					})
				}
			}
		},

		props: {
			archivedFiles: Array
		}

	}
</script>
