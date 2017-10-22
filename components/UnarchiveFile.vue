<template>
	<modal @close="$emit('close')">
		<div class="modal-body">
			<h4 class="modal-title">Re-open an archived file</h4>

			<div class="files-list">
				<div v-for="file in archivedFiles" :key="file.id">
					<a class="list-item" href="#" @click.prevent="openFile(file.id)">
						{{ file.title }}

						<i class="material-icons">unarchive</i>
					</a>
				</div>
			</div>
		</div>

		<footer>
			<button class="button ghost-button mb-right"
				type="button" @click="$emit('close')">
				CANCEL
			</button>
		</footer>
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

		components: {
			Modal
		},

		methods: {
			openFile(id) {
				this.$store.dispatch('unarchiveFile', id).then(() => {
					this.$emit('success')
					window.location = '/'
				})
			}
		},

		props: {
			archivedFiles: Array
		}

	}
</script>
