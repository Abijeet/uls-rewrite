<template>
	<div>
		<cdx-lookup
            v-model:selected="selectedLanguage"
            v-model:input-value="inputValue"
            :menu-items="menuItems"
            :placeholder="placeholder"
            :menu-config="menuConfig"
            @update:input-value="onUpdateInputValue"
        >
            <template #no-results>
                <slot name="no-results" :input-value="inputValue">
                </slot>
            </template>
        </cdx-lookup>
	</div>
</template>

<script>
import { ref } from 'vue';
import { CdxLookup } from '@wikimedia/codex';
import { getLanguageAutonyms, searchLanguages } from '../repositories/Languages';
import { visibleItemLimit, languageSearchDebounce } from '../config/LanguageSelectorMenuConfig';

export default {
    name: 'LanguageSelector',
    components: { CdxLookup },
    props: {
        placeholder: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const allLanguageOptions = getLanguageAutonyms();
        const menuItems = ref( allLanguageOptions );
        const selectedLanguage = ref(null);
        const inputValue = ref('');
        const menuConfig = {
            visibleItemLimit: visibleItemLimit
        };

        let debounceTimer;
        const onUpdateInputValue = ( value ) => {
            if ( value === '' ) {
                menuItems.value = allLanguageOptions;
                return;
            }

            clearTimeout( debounceTimer );
            debounceTimer = setTimeout( async () => {
                if ( inputValue.value !== value ) {
                    return;
                }

                try {
                    menuItems.value = await searchLanguages( value );
                } catch ( e ) {
                    menuItems.value = [];
                }
            }, languageSearchDebounce );
        };

        return {
            menuItems,
            selectedLanguage,
            inputValue,
            onUpdateInputValue,
            menuConfig,
            placeholder: props.placeholder,
        };
    }
};
</script>
