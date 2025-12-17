<template>
  <div class="demo-section">
    <h2>Lookup Language Selector <a target="_blank" href="https://github.com/Abijeet/uls-rewrite/blob/main/composable-uls/src/demos/LookupDemo.vue"><cdx-icon :icon="cdxIconLinkExternal" size="x-small" ></cdx-icon></a></h2>
    <p v-if="selectedLanguage">
      Selected: <strong>{{ selectedLanguage.autonym }}</strong> ({{ selectedLanguage.code }})
    </p>
    <p v-else>No language selected</p>
    <cdx-lookup
      ref="lookupRef"
      v-model:selected="selectedLanguageCode"
      v-model:input-value="inputValue"
      :menu-items="inputValue ? menuItems : allMenuItems"
      :menu-config="menuConfig"
      placeholder="Search and select a language"
      aria-label="Language selector"
      @input="(value) => { 
        inputValue = value; 
        onSearchUpdate(value || ''); 
      }"
    >
      <template #no-results>
        No languages found.
      </template>
    </cdx-lookup>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { CdxLookup, CdxIcon } from "@wikimedia/codex";
import { cdxIconLinkExternal } from '@wikimedia/codex-icons';
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

const selectedLanguageCode = ref(null);
const selectedLanguage = ref(null);
const inputValue = ref("");
const lookupRef = ref(null);
const menuConfig = {
  visibleItemLimit: 10,
  boldLabel: true,
};

// Use the simple composable
const {
  menuItems,
  allMenuItems,
  onSearchUpdate,
  cleanup,
} = useLanguageSelector(props.allLanguages, props.searchAPI);

// Watch for language code changes
watch(selectedLanguageCode, (newCode) => {
  if (!newCode) {
    selectedLanguage.value = null;
    return;
  }
  // Find the language object from the current menu items,
  // which includes all languages
  const allItems = inputValue.value ? menuItems.value : allMenuItems.value;
  const selectedItem = allItems.find(item => item.value === newCode);
  if (selectedItem) {
    const lang = props.allLanguages.find(l => l.code === newCode);
    selectedLanguage.value = lang || { code: newCode, autonym: selectedItem.label };
  } else {
    selectedLanguage.value = null;
  }
});

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

