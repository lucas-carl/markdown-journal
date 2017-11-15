<template>
	<modal @close="$emit('close')" v-if="!showUnarchive">
		<form class="create-file-form" @submit.prevent="submitForm">
			<div class="modal-body">
				<h4 class="modal-title">Create new document</h4>

				<div class="form-group floating-label">
					<input class="custom-input" type="text" v-model="title" placeholder="Title" required autofocus>
					<label>Title</label>
				</div>
			</div>

			<footer class="actions-container">
				<button class="button ghost-button float-left"
					type="button" @click="showUnarchive = true"
					v-if="archivedFiles && archivedFiles.length > 0">
					<span>ARCHIVE</span>
					<i class="material-icons icon-lg">unarchive</i>
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

	<unarchive-file :archived-files="archivedFiles"
		@close="showUnarchive = false" @success="$emit('close')" v-else>
	</unarchive-file>
</template>

<script>
	import { mapGetters } from 'vuex'

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
						this.$router.push('/' + this.openDocument.id)
					}).then(() => {
						this.$emit('success')
					})
				}
			}
		},

		props: {
			archivedFiles: Array
		},

		computed: {
			...mapGetters([
				'openDocument'
			])
		}

	}
</script>
