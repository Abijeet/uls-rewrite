<template>
	<div>
		<cdx-lookup
            v-model:selected="selectedLanguage"
            :menu-items="languages"
            :placeholder="placeholder"
        />
	</div>
</template>

<script>
import { ref } from 'vue';
import { CdxLookup } from '@wikimedia/codex';

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
        const languages = [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Chinese', value: 'zh' }
        ];

        const selectedLanguage = ref(null);

        return {
            languages,
            selectedLanguage,
            placeholder: props.placeholder,
        };
    }
};
</script>
