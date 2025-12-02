<template>
  <div class="demo-section">
    <h2>MultiselectLookup Language Selector <a target="_blank" href="https://github.com/Abijeet/uls-rewrite/blob/main/headless-uls/src/demos/MultiselectLookupDemo.vue"><cdx-icon :icon="cdxIconLinkExternal" :size="x-small" ></cdx-icon></a></h2>
    <p v-if="selectedLanguages.length > 0">
      Selected: <strong>{{ selectedLanguages.map(code => getAutonym(code)).join(', ') }}</strong>
    </p>
    <p v-else>No languages selected</p>
    <language-selector
      :languages="allLanguages"
      :searchAPI="searchAPI"
      v-slot="{
        menuItems,
        allMenuItems,
        onSearchUpdate,
      }"
    >
      <cdx-multiselect-lookup
        v-model:selected="selectedLanguages"
        v-model:input-chips="selectedLanguageChips"
        v-model:input-value="multiselectInputValue"
        :menu-items="menuItems"
        :menu-config="multiselectMenuConfig"
        placeholder="Search and select languages"
        aria-label="Multiselect language selector"
        :keep-input-on-selection="true"
        @input="onSearchUpdate"
        @update:selected="onMultiselectSelected"
      >
        <template #no-results>
          No languages found.
        </template>
      </cdx-multiselect-lookup>
    </language-selector>
  </div>
</template>

<script>
import LanguageSelector from "../components/LanguageSelector.vue";
import { CdxMultiselectLookup, CdxIcon } from "@wikimedia/codex";
import { cdxIconLinkExternal } from '@wikimedia/codex-icons';
import { getAutonym } from "@wikimedia/language-data";

export default {
  name: "MultiselectLookupDemo",
  components: {
    LanguageSelector,
    CdxMultiselectLookup,
    CdxIcon,
  },
  props: {
    searchAPI: {
      type: String,
      required: true,
    },
    allLanguages: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedLanguages: [],
      selectedLanguageChips: [],
      multiselectInputValue: '',
      multiselectMenuConfig: {
        visibleItemLimit: 10,
        boldLabel: true,
      },
      cdxIconLinkExternal,
    };
  },
  methods: {
    getAutonym,
    onMultiselectSelected(selected) {
      console.log("Multiselect languages selected:", selected);
    },
  },
};
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

