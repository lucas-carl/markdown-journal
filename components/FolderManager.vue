<template>
	<modal @close="$emit('close')">
		<div class="modal-body">
			<h4 class="modal-title">Manage folders</h4>

			<div class="files-list">
				<div v-for="folder in folders" :key="folder.id">
					<a class="list-item" href="#" @click.prevent="deleteFolder(folder.id)">
						<p>{{ folder.title }}</p>

						<i class="material-icons float-right">delete</i>
					</a>
				</div>
			</div>
		</div>

		<footer class="actions-container">
			<button class="button ghost-button"
				type="button" @click="$emit('close')">
				DONE
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
			deleteFolder(id) {
				this.$store.dispatch('deleteFolder', id).then(() => {
					this.$emit('success')
					window.location = '/'
				})
			}
		},

		props: {
			folders: Array
		}

	}
</script>
