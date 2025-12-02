<template>
  <div class="demo-section">
    <h2>Lookup Language Selector <a target="_blank" href="https://github.com/Abijeet/uls-rewrite/blob/main/headless-uls/src/demos/LookupDemo.vue"><cdx-icon :icon="cdxIconLinkExternal" :size="x-small" ></cdx-icon></a></h2>
    <p v-if="selectedLanguage">
      Selected: <strong>{{ selectedLanguage.autonym }}</strong> ({{ selectedLanguage.code }})
    </p>
    <p v-else>No language selected</p>
    <language-selector
      :languages="allLanguages"
      :searchAPI="searchAPI"
      v-slot="{
        menuItems,
        allMenuItems,
        onSearchUpdate,
      }"
    >
      <cdx-lookup
        v-model:selected="selectedLanguageCode"
        v-model:input-value="inputValue"
        :menu-items="inputValue ? menuItems : allMenuItems"
        :menu-config="menuConfig"
        placeholder="Search and select a language"
        aria-label="Language selector"
        @input="onSearchUpdate"
      >
        <template #no-results>
          No languages found.
        </template>
      </cdx-lookup>
    </language-selector>
  </div>
</template>

<script>
import LanguageSelector from "../components/LanguageSelector.vue";
import { CdxLookup, CdxIcon } from "@wikimedia/codex";
import { cdxIconLinkExternal } from '@wikimedia/codex-icons';

export default {
  name: "LookupDemo",
  components: {
    LanguageSelector,
    CdxLookup,
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
      selectedLanguageCode: null,
      selectedLanguage: null,
      inputValue: "",
      menuConfig: {
        visibleItemLimit: 10,
        boldLabel: true,
      },
      cdxIconLinkExternal,
    };
  },
  watch: {
    selectedLanguageCode(newCode) {
      if (!newCode) {
        this.selectedLanguage = null;
        return;
      }
      // Find the language object from allLanguages
      const lang = this.allLanguages.find(l => l.code === newCode);
      if (lang) {
        this.selectedLanguage = lang;
      } else {
        this.selectedLanguage = null;
      }
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

