<template>
	<div>
        <cdx-multiselect-lookup
            v-model:selected="selectedLanguages"
            v-model:input-chips="selectedLanguageChips"
            :menu-items="languages"
            :placeholder="placeholder"
        />
	</div>
</template>

<script>
import { ref } from 'vue';
import { CdxMultiselectLookup } from '@wikimedia/codex';

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
        const languages = [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Chinese', value: 'zh' }
        ];

        const selectedLanguages = ref([]);
        const selectedLanguageChips = ref([]);

        return {
            placeholder: props.placeholder,
            languages,
            selectedLanguages,
            selectedLanguageChips
        };
    }
};
</script>
