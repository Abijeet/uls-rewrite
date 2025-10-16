<template>
	<hr>
	<div class="language-selector-wrapper">
		<cdx-field>
			<language-selector 
				placeholder="Select a language" 
				:languages-to-highlight="languagesToHighlight"
			>
				<template #no-results="{ inputValue }">
					<p>The page is not available in the selected language, <strong>{{ inputValue }}</strong></p>
					<p>It maybe available in other languages:</p>
					<ol>
						<li>English</li>
						<li>Hindi</li>
					</ol>
				</template>
			</language-selector>
			<template #label>
				Select a language
			</template>
		</cdx-field>
		
		<cdx-field>
			<cdx-text-input v-model="highlightedLanguages" />
			<template #label>
				Languages to highlight
			</template>
			<template #description>
				Enter comma separated list of languages codes to highlight. e.g. en,hi
			</template>
		</cdx-field>
	</div>
	<hr>
	<div class="language-selector-wrapper">
		<cdx-field>
			<multiple-language-selector placeholder="Select languages" />
			<template #label>
				Select multiple languages
			</template>
		</cdx-field>
	</div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import { CdxField, CdxTextInput } from '@wikimedia/codex';
import LanguageSelector from './components/LanguageSelector.vue';
import MultipleLanguageSelector from './components/MultipleLanguageSelector.vue';

export default defineComponent( {
	components: {
		LanguageSelector,
		MultipleLanguageSelector,
		CdxTextInput,
		CdxField
	},
    setup() {
		const highlightedLanguages = ref( 'en,hi' );

		const languagesToHighlight = computed( () => {
			return highlightedLanguages.value.split( ',' ).map( lang => lang.trim() );
		} );

		return { 
			highlightedLanguages,
			languagesToHighlight
		};
    }
} );
</script>

<style>
@import '@wikimedia/codex/dist/codex.style.css';

.language-selector-wrapper {
	width: 450px;
	margin-bottom: 1em;
	label {
		margin-bottom: 0.5em;
		display: block
	}
}
</style>
