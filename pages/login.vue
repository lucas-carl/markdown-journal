<template>
	<main>
		<section class="login-container">
			<form class="container" @submit.prevent="login">
				<input type="email" v-model="email" autofocus>
				<input type="password" v-model="password">

				<input type="submit">
			</form>
		</section>
	</main>
</template>

<script>
	export default {

		data() {
			return {
				email: '',
				password: ''
			}
		},

		methods: {
			login() {
				if (this.email && this.password) {
					this.$store.dispatch('login', { email: this.email, password: this.password }).then(() => {
						// hard reload is important
						window.location = '/'
					})
				}
			}
		}

	}
</script>
