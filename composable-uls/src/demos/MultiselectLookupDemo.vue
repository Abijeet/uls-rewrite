<template>
  <div class="demo-section">
    <h2>MultiselectLookup Language Selector <a target="_blank" href="https://github.com/Abijeet/uls-rewrite/blob/main/composable-uls/src/demos/MultiselectLookupDemo.vue"><cdx-icon :icon="cdxIconLinkExternal" size="x-small" ></cdx-icon></a></h2>
    <p v-if="selectedLanguages.length > 0">
      Selected: <strong>{{ selectedLanguages.map(code => getAutonym(code)).join(', ') }}</strong>
    </p>
    <p v-else>No languages selected</p>
    <cdx-multiselect-lookup
      v-model:selected="selectedLanguages"
      v-model:input-chips="selectedLanguageChips"
      v-model:input-value="multiselectInputValue"
      :menu-items="menuItems"
      :menu-config="multiselectMenuConfig"
      placeholder="Search and select languages"
      aria-label="Multiselect language selector"
      :keep-input-on-selection="true"
      @input="(value) => { 
        multiselectInputValue = value; 
        onSearchUpdate(value || ''); 
      }"
      @update:selected="onMultiselectSelected"
    >
      <template #no-results>
        No languages found.
      </template>
    </cdx-multiselect-lookup>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { CdxMultiselectLookup, CdxIcon } from "@wikimedia/codex";
import { cdxIconLinkExternal } from '@wikimedia/codex-icons';
import { getAutonym } from "@wikimedia/language-data";
import { useLanguageSelector } from '../composables/useLanguageSelector.js';

const props = defineProps({
  searchAPI: {
    type: String,
    required: true,
  },
  allLanguages: {
    type: Array,
    required: true,
  },
});

const selectedLanguages = ref([]);
const selectedLanguageChips = ref([]);
const multiselectInputValue = ref('');
const multiselectMenuConfig = {
  visibleItemLimit: 10,
  boldLabel: true,
};

const {
  menuItems,
  onSearchUpdate,
  cleanup,
} = useLanguageSelector(props.allLanguages, props.searchAPI);

const onMultiselectSelected = (selected) => {
  console.log("Multiselect languages selected:", selected);
};

// Cleanup on unmount
onUnmounted(() => {
  cleanup();
});
</script>

<style lang="less">
@import '../styles/mediawiki.skin.variables.less';

.demo-section {
  margin-bottom: @spacing-200;
  padding-bottom: @spacing-200;
  border-bottom: 1px solid @border-color-subtle;

  &:last-child {
    border-bottom: none;
  }

  h2 {
    color: #000;
    margin-bottom: @spacing-100;
    font-size: 1.25rem;
  }

  p {
    margin-bottom: @spacing-50;
    color: @color-base--subtle;
  }
}
</style>

