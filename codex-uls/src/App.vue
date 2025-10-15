<template>
	<div>
		<cdx-button action="destructive">
			<cdx-icon :icon="cdxIconTrash" /> Delete this item
		</cdx-button>
	</div>
	<hr>
	<div class="language-selector-wrapper">
		<label>Select a language:</label>
		<language-selector :is-multiselect="false" />
	</div>
	<div class="language-selector-wrapper">
		<div >
		<label>Select multiple languages:</label>
		<language-selector :is-multiselect="true" />
	</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { CdxButton, CdxIcon } from '@wikimedia/codex';
import { cdxIconTrash } from '@wikimedia/codex-icons';
import LanguageSelector from './components/LanguageSelector/LanguageSelector.vue';

export default defineComponent( {
	components: {
		CdxButton,
		CdxIcon,
		LanguageSelector
	},
    setup() {
        return {
            cdxIconTrash
        }
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
