<template>
	<!-- Conditionally teleport fullscreen -->
	<teleport v-if="isFullscreen" to="body">
		<div class="fullscreen-overlay">
			<slot></slot>
		</div>
	</teleport>

	<!-- Normal rendering when not fullscreen -->
	<div v-else>
		<slot></slot>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent( {
	props: {
		isFullscreen: {
			type: Boolean,
			default: false
		}
	}
} );
</script>

<style>
.fullscreen-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.8);
  z-index: 9999;
}
</style>