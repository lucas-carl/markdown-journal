<template>
	<main>
		<section class="login-container">
			<div class="container-sm login-heading">
				<h1>Markdown Journal</h1>
			</div>

			<form class="container-sm login-form" @submit.prevent="register" v-if="showRegisterForm">
				<div class="form-group floating-label">
					<input class="custom-input" type="email" v-model="email" placeholder="Email" required autofocus>
					<label>Email</label>
				</div>
				<div class="form-group floating-label">
					<input class="custom-input" type="password" v-model="password" placeholder="Password" required>
					<label>Password</label>
				</div>
				<div class="form-group floating-label">
					<input class="custom-input" type="password" v-model="password_c" placeholder="Confirm password" required>
					<label>Confirm password</label>
				</div>

				<div class="actions-container">
					<button class="button ghost-button mb-right" type="button" @click="showRegisterForm = false">
						CANCEL
					</button>
					<button class="button cta-button" type="submit">CREATE USER</button>
				</div>
			</form>

			<form class="container-sm login-form" @submit.prevent="login" v-else>
				<div class="form-group floating-label">
					<input class="custom-input" type="email" v-model="email" placeholder="Email" required autofocus>
					<label>Email</label>
				</div>
				<div class="form-group floating-label">
					<input class="custom-input" type="password" v-model="password" placeholder="Password" required>
					<label>Password</label>
				</div>

				<div class="actions-container">
					<button class="button ghost-button mb-right" type="button" @click="showRegisterForm = true">
						CREATE USER
					</button>
					<button class="button cta-button" type="submit">LOGIN</button>
				</div>
			</form>
		</section>
	</main>
</template>

<script>
	export default {

		data() {
			return {
				showRegisterForm: false,
				email: '',
				password: '',
				password_c: ''
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
			},
			register() {
				if (this.email && this.password && this.password_c) {
					if (this.password !== this.password_c) {
						alert('The confirmation does not match the password.')
					}

					this.$store.dispatch('register', { email: this.email, password: this.password }).then(() => {
						// hard reload is important
						window.location = '/'
					})
				}
			}
		}

	}
</script>
