<template>
	<div>
        <cdx-multiselect-lookup
            v-model:selected="selectedLanguages"
            v-model:input-chips="selectedLanguageChips"
            :menu-items="languages"
            :placeholder="placeholder"
            :menu-config="menuConfig"
        />
	</div>
</template>

<script>
import { ref } from 'vue';
import { CdxMultiselectLookup } from '@wikimedia/codex';
import { getLanguageOptions } from '../repositories/Languages';

export default {
    name: 'MultipleLanguageSelector',
    components: { CdxMultiselectLookup },
    props: {
        placeholder: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const languages = ref( getLanguageOptions() );

        const selectedLanguages = ref([]);
        const selectedLanguageChips = ref([]);
        const menuConfig = {
            visibleItemLimit: 8
        };

        return {
            placeholder: props.placeholder,
            languages,
            menuConfig,
            selectedLanguages,
            selectedLanguageChips
        };
    }
};
</script>
