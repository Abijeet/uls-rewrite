<template>
	<div>
		<cdx-lookup
            v-model:selected="selectedLanguage"
            :menu-items="languages"
            :placeholder="placeholder"
            :menu-config="menuConfig"
        />
	</div>
</template>

<script>
import { ref } from 'vue';
import { CdxLookup } from '@wikimedia/codex';
import { getLanguageOptions } from '../repositories/Languages';

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
        const languages = ref( getLanguageOptions());
        const selectedLanguage = ref(null);
        const menuConfig = {
            visibleItemLimit: 8
        };

        return {
            languages,
            selectedLanguage,
            menuConfig,
            placeholder: props.placeholder,
        };
    }
};
</script>
