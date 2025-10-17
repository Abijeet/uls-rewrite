<template>
	<h2>Button based selector</h2>
	<p>
		A selector that opens a dialog which contains a language selector. 
		This dialog can be customized to provide entrypoints.
	</p>
	<cdx-field>
		<cdx-button @click="isFloatingLanguageSelectorVisible = !isFloatingLanguageSelectorVisible" ref="langaugeSelectorButtonRef">
Open Language Selector
</cdx-button>
		<floating-language-selector
			v-if="isFloatingLanguageSelectorVisible"
			ref="floatingLanguageSelectorRef"
			@close="isFloatingLanguageSelectorVisible = false" />
	</cdx-field>
	<hr>
	<h2>Single language selector</h2>
	<p>
		A language selector built using the Lookup component from Codex. It supports the following features:
	</p>
	<ul>
		<li>Search and filter languages</li>
		<li>Highlight specific languages with an icon</li>
		<li>Custom no results slot to show suggestions when no results are found</li>
		<li>Loads languages from <a href="https://github.com/wikimedia/language-data/">language-data</a> library, 
			and the <a href="https://en.wikipedia.org/w/api.php?action=languagesearch&format=json&formatversion=2&search=ff">LanguageSearch API</a> in ULS
		</li>
	</ul>
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
	<h2>Multiple language selector</h2>
	<p>Supports a subset of features supported by the single language selector. You can search and select multiple languages.</p>
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
import { CdxField, CdxTextInput, CdxButton } from '@wikimedia/codex';
import LanguageSelector from './components/LanguageSelector.vue';
import MultipleLanguageSelector from './components/MultipleLanguageSelector.vue';
import FloatingLanguageSelector from './components/FloatingLanguageSelector.vue';

export default defineComponent( {
	components: {
		LanguageSelector,
		MultipleLanguageSelector,
		FloatingLanguageSelector,
		CdxTextInput,
		CdxField,
		CdxButton
	},
    setup() {
		const highlightedLanguages = ref( 'en,hi' );
		const isFloatingLanguageSelectorVisible = ref( false );

		const languagesToHighlight = computed( () => {
			return highlightedLanguages.value.split( ',' ).map( lang => lang.trim() );
		} );

		const langaugeSelectorButtonRef = ref( null );
		const floatingLanguageSelectorRef = ref( null );

		return { 
			highlightedLanguages,
			languagesToHighlight,
			floatingLanguageSelectorRef,
			langaugeSelectorButtonRef,
			isFloatingLanguageSelectorVisible
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
