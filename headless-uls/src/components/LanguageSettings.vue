<template>
	<cdx-dialog
		id="language-settings-dialog"
		v-model:open="visible"
		:title="$i18n( 'ext-uls-language-settings-title' )"
		:primary-action="primaryAction"
		:default-action="defaultAction"
		@primary="onPrimaryAction"
		@default="handleCancel"
	>
		<my-language-selector
			v-if="languageSelectorOpen"
			:selected="selectedLanguage"
			:languages="languageGroups"
			:columns="1"
			@update:selected="onLanguageSelect"
		></my-language-selector>
		<cdx-tabs
			v-else
			v-model:active="activeTab"
			framed>
			<cdx-tab
				key="display-settings"
				name="display-settings"
				:label="$i18n( 'ext-uls-display-settings-title-short' )"
			>
				<div class="display-language-option-container">
					<h3>Display language</h3>
					<p>
						Change the language of menus. Content language will not be affected.
					</p>
					<div class="display-settings-language-options-container">
						<cdx-button-group
							:buttons="displayLanguageButtons"
							@click="onDisplayLanguageSelected"
						>
							<template #default="{ button }">
								<span
									:class="{
										'display-language-option--selected':
											selectedDisplayLanguage === button.value
									}"
								>
									<cdx-icon v-if="button.icon" :icon="button.icon"></cdx-icon>
									<span v-if="button.label">{{ button.label }}</span>
								</span>
							</template>
						</cdx-button-group>
					</div>
				</div>
				<div class="font-option-container">
					<h3>Font settings</h3>
					<cdx-checkbox>
						{{ $i18n( 'ext-uls-webfonts-settings-title' ) }}
						<template #description>
							{{ $i18n( 'ext-uls-webfonts-settings-info' ) }}
							<a target="_blank" href="https://www.mediawiki.org/wiki/Universal_Language_Selector/WebFonts">
								{{ $i18n( 'ext-uls-webfonts-settings-info-link' ) }}
							</a>
						</template>
					</cdx-checkbox>
				</div>
			</cdx-tab>
			<cdx-tab
				key="input-settings"
				name="input-settings"
				:label="$i18n( 'ext-uls-input-settings-title-short' )"
			>
				<div class="font-option-container">
					<h3>Languages used for writing</h3>
					<div class="input-settings-language-options-container">
						<cdx-button-group
							:buttons="inputLanguageButtons"
							@click="onInputLanguageSelected"
						>
							<template #default="{ button }">
								<span
									:class="{
										'display-language-option--selected':
											selectedInputLanguage === button.value
									}"
								>
									<cdx-icon v-if="button.icon" :icon="button.icon"></cdx-icon>
									<span v-if="button.label">{{ button.label }}</span>
								</span>
							</template>
						</cdx-button-group>
						<cdx-field :is-fieldset="true">
							<cdx-radio
								v-for="radio in radios"
								:key="'radio-' + radio.value"
								v-model="radioValue"
								name="radio-group-descriptions"
								:input-value="radio.value"
							>
								{{ radio.label }}
								<template #description>
									{{ radio.description }}
								</template>
							</cdx-radio>
						</cdx-field>
						<cdx-button action="progressive" weight="primary">
							Disable input tools
						</cdx-button>
					</div>
				</div>
			</cdx-tab>
		</cdx-tabs>
	</cdx-dialog>
</template>

<script>
const { defineComponent, ref, watch, computed } = require( 'vue' );
const { cdxIconEllipsis } = require( './icons.json' );
const { CdxButton, CdxDialog, CdxTabs, CdxTab, CdxIcon, CdxCheckbox, CdxField, CdxRadio, CdxButtonGroup } = require( '@wikimedia/codex' );
const MyLanguageSelector = require( './MyLanguageSelector.vue' );
const { getAllLanguages, assignAttributeToRandomLanguages, groupLanguagesByGroup } = require( './demoHelpers.js' );
const GROUP_TITLES = {
	suggested: 'Suggested',
	WW: 'Worldwide',
	EU: 'Europe',
	AM: 'America',
	AS: 'Asia',
	AF: 'Africa',
	PA: 'Pacific',
	ME: 'Middle East'
};

// @vue/component
module.exports = defineComponent( {
	components: {
		CdxButton,
		CdxDialog,
		CdxTabs,
		CdxTab,
		CdxIcon,
		CdxCheckbox,
		CdxField,
		CdxRadio,
		CdxButtonGroup,
		MyLanguageSelector
	},
	props: {
		modelValue: { type: Boolean, default: false }
	},
	emits: [ 'update:modelValue', 'apply', 'cancel', 'visible', 'close' ],
	setup( props, { emit } ) {
		const activeTab = ref( 'display-settings' );
		const allLanguages = getAllLanguages();
		const languagesWithSuggested = assignAttributeToRandomLanguages( allLanguages, 'groups', [ 'suggested' ], 0.01 );
		const languageGroups = groupLanguagesByGroup( languagesWithSuggested, GROUP_TITLES );

		const languageSelectorOpen = ref( false );
		const selectedDisplayLanguage = ref( 'en' );
		const selectedInputLanguage = ref( 'en' );

		const selectedLanguage = computed( () => {
			if ( activeTab.value === 'display-settings' ) {
				return languagesWithSuggested.find(
					( language ) => language.code === selectedDisplayLanguage.value
				);
			}
			return languagesWithSuggested.find(
				( language ) => language.code === selectedInputLanguage.value
			);
		} );

		const onLanguageSelect = ( lang ) => {
			if ( activeTab.value === 'display-settings' ) {
				selectedDisplayLanguage.value = lang.code;
			} else {
				selectedInputLanguage.value = lang.code;
			}

			languageSelectorOpen.value = false;
		};

		const displayLanguageButtons = computed( ( previousButtons ) => {
			// eslint-disable-next-line max-len
			const previousLanguageButtons = ( previousButtons || [] ).filter( ( button ) => button.value !== null );
			const previousLanguageCodes = previousLanguageButtons.map( ( button ) => button.value );
			if ( previousLanguageCodes.includes( selectedDisplayLanguage.value ) ) {
				return previousButtons;
			}
			const prominentCodes = [ selectedDisplayLanguage.value, 'el', 'ta' ];

			const prominentLanguages = prominentCodes.map(
				// eslint-disable-next-line max-len
				( langCode ) => languagesWithSuggested.find( ( language ) => language.code === langCode )
			);

			const prominentLanguageButtons = prominentLanguages.map( ( language ) => ( {
				value: language.code,
				label: language.autonym
			} ) );

			return [
				...prominentLanguageButtons,
				{ value: null, icon: cdxIconEllipsis }
			];
		} );

		const inputLanguageButtons = computed( ( previousButtons ) => {
			// eslint-disable-next-line max-len
			const previousLanguageButtons = ( previousButtons || [] ).filter( ( button ) => button.value !== null );
			const previousLanguageCodes = previousLanguageButtons.map( ( button ) => button.value );
			if ( previousLanguageCodes.includes( selectedInputLanguage.value ) ) {
				return previousButtons;
			}
			const prominentCodes = [ selectedInputLanguage.value, 'el', 'ta' ];

			const prominentLanguages = prominentCodes.map(
				// eslint-disable-next-line max-len
				( langCode ) => languagesWithSuggested.find( ( language ) => language.code === langCode )
			);

			const prominentLanguageButtons = prominentLanguages.map( ( language ) => ( {
				value: language.code,
				label: language.autonym
			} ) );

			return [
				...prominentLanguageButtons,
				{ value: null, icon: cdxIconEllipsis }
			];
		} );

		const openLanguageSelector = () => {
			languageSelectorOpen.value = true;
		};

		const onDisplayLanguageSelected = ( value ) => {
			if ( value === null ) {
				openLanguageSelector();
				return;
			}
			selectedDisplayLanguage.value = value;
		};

		const onInputLanguageSelected = ( value ) => {
			if ( value === null ) {
				openLanguageSelector();
			}
			selectedInputLanguage.value = value;
		};

		const visible = ref( props.modelValue );

		const primaryAction = {
			label: 'Save',
			actionType: 'progressive'
		};

		const defaultAction = {
			label: 'Cancel'
		};

		function onPrimaryAction() {
			visible.value = false;
		}

		function handleCancel() {
			visible.value = false;
			emit( 'cancel' );
			emit( 'close' );
		}

		watch(
			() => props.modelValue,
			( val ) => {
				visible.value = val;
				if ( val ) {
					emit( 'visible' );
				}
			}
		);
		watch( visible, ( val ) => emit( 'update:modelValue', val ) );

		const radios = [
			{
				label: 'International Phonetic Alphabet - SIL',
				value: 'sil'
			},
			{
				label: 'International Phonetic Alphabet - X-SAMPA',
				value: 'x-sampa'
			},
			{
				label: 'Use native keyboard',
				value: 'native'
			}
		];

		const radioValue = ref( 'sil' );

		return {
			radios,
			radioValue,
			handleCancel,
			visible,
			primaryAction,
			defaultAction,
			onPrimaryAction,
			selectedDisplayLanguage,
			selectedInputLanguage,
			displayLanguageButtons,
			inputLanguageButtons,
			onDisplayLanguageSelected,
			onInputLanguageSelected,
			languageGroups,
			languageSelectorOpen,
			onLanguageSelect,
			activeTab,
			selectedLanguage
		};
	}
} );
</script>

<style lang="less">
@import 'mediawiki.skin.variables.less';

#language-settings-dialog {
	.my-language-selector {
		.my-language-selector-wrapper-root{
			min-height: @size-800;
		}
	}
	.language-settings-wrapper {
		background: white;
	}

	.cdx-tabs__content {
		margin-block-start: @spacing-100;

		.display-settings-language-options-container, .input-settings-language-options-container {
			.cdx-button-group {
				display: flex;
				gap: @spacing-100;
				.cdx-button:has(.display-language-option--selected) {
					background-color: @background-color-progressive--active;
					color: @color-inverted;
					border-color: @border-color-progressive--active;
				}
			}
		}

		.font-option-container {
			margin-block-start: @spacing-100;
		}

	}
}
</style>