<template>
	<modal @close="$emit('close')">
		<div class="modal-body">
			<h4 class="modal-title">Re-open an archived file</h4>

			<div class="files-list">
				<div v-for="file in archivedFiles" :key="file.id">
					<a class="list-item" href="#" @click.prevent="openFile(file.id)">
						<p>{{ file.title }}</p>

						<i class="material-icons float-right">unarchive</i>
					</a>
				</div>
			</div>
		</div>

		<footer class="actions-container">
			<button class="button ghost-button float-left"
				type="button" @click="$emit('close')">
				CANCEL
			</button>

			<button class="button danger-button"
				type="button" @click="purge">
				DELETE ALL
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
			},
			purge() {
				this.$store.dispatch('purgeArchive').then(() => {
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
