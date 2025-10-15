<template>
	<hr>
	<div class="language-selector-wrapper">
		<label>Select a language:</label>
		<language-selector placeholder="Select a language" />
	</div>
	<div class="language-selector-wrapper">
		<div >
		<label>Select multiple languages:</label>
		<multiple-language-selector placeholder="Select languages" />
	</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import LanguageSelector from './components/LanguageSelector.vue';
import MultipleLanguageSelector from './components/MultipleLanguageSelector.vue';

export default defineComponent( {
	components: {
		LanguageSelector,
		MultipleLanguageSelector
	},
    setup() {
    }
} );
</script>

<style>
@import '@wikimedia/codex/dist/codex.style.css';

.language-selector-wrapper {
	width: 300px;
	margin-bottom: 1em;
	label {
		margin-bottom: 0.5em;
		display: block
	}
}
</style>
