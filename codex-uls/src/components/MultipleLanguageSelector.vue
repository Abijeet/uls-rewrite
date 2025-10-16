<template>
	<div>
        <cdx-multiselect-lookup
            v-model:selected="selectedLanguages"
            v-model:input-chips="selectedLanguageChips"
            v-model:input-value="inputValue"
            :menu-items="menuItems"
            :placeholder="placeholder"
            :menu-config="menuConfig"
            @update:input-value="onUpdateInputValue"
        />
	</div>
</template>

<script>
import { ref } from 'vue';
import { CdxMultiselectLookup } from '@wikimedia/codex';
import { getLanguageAutonyms, searchLanguages } from '../repositories/Languages';
import { languageSearchDebounce, visibleItemLimit } from '@/config/LanguageSelectorMenuConfig';

export default {
    name: 'MultipleLanguageSelector',
    components: { CdxMultiselectLookup },
    props: {
        placeholder: {
            type: String,
            required: true,
        }
    },
    setup() {
        const allLanguageOptions = getLanguageAutonyms();
        const menuItems = ref( allLanguageOptions );

        const selectedLanguages = ref([]);
        const selectedLanguageChips = ref([]);
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
                } catch {
                    menuItems.value = [];
                }
            }, languageSearchDebounce );
        };

        return {
            menuItems,
            menuConfig,
            selectedLanguages,
            selectedLanguageChips,
            inputValue,
            onUpdateInputValue
        };
    }
};
</script>
