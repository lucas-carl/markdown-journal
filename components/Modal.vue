<template>
	<div class="modal-container">
		<div class="modal-bg" @click="$emit('close')"></div>

		<div class="modal">
			<slot></slot>
		</div>
	</div>
</template>
