<template>
	<modal @close="$emit('close')">
		<form class="create-file-form" @submit.prevent="submitForm">
			<div class="modal-body">
				<h4 class="modal-title">Create new document</h4>

				<div class="form-group floating-label">
					<input class="custom-input" type="text" v-model="title" placeholder="Title">
					<label>Title</label>
				</div>
			</div>

			<footer>
				<button class="button ghost-button mb-right"
					@click="$emit('close')">
					CANCEL
				</button>
				<button class="button cta-button" type="submit">
					CREATE
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

		components: {
			Modal
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
		}

	}
</script>
