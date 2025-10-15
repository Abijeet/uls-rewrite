<template>
	<div>
		<cdx-lookup
            v-if="!isMultiselect"
            v-model:selected="selectedLanguage"
            :menu-items="languages"
            placeholder="Select a language"
        />
        <cdx-multiselect-lookup
            v-else
            v-model:selected="selectedLanguages"
            v-model:input-chips="selectedLanguageChips"
            :menu-items="languages"
            placeholder="Select languages"
        />
	</div>
</template>

<script>
import { ref } from 'vue';
import { CdxLookup, CdxMultiselectLookup } from '@wikimedia/codex';

export default {
    components: { CdxLookup, CdxMultiselectLookup },
    props: {
        isMultiselect: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const languages = [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Chinese', value: 'zh' }
        ];

        const selectedLanguage = ref(null);
        const selectedLanguages = ref([]);
        const selectedLanguageChips = ref([]);

        return {
            languages,
            isMultiselect: props.isMultiselect,
            selectedLanguage,
            selectedLanguages,
            selectedLanguageChips
        };
    }
};
</script>
