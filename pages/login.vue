<template>
	<main>
		<section class="login-container">
			<div class="container-sm login-heading">
				<h1>Markdown Journal</h1>
			</div>

			<form class="container-sm login-form" @submit.prevent="login">
				<div class="form-group floating-label">
					<input class="custom-input" type="email" v-model="email" placeholder="Email" required autofocus>
					<label>Email</label>
				</div>
				<div class="form-group floating-label">
					<input class="custom-input" type="password" v-model="password" placeholder="Password" required>
					<label>Password</label>
				</div>

				<button class="button cta-button button-block" type="submit">Login</button>
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
