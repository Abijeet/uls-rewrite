<template>
  <div class="demo-section">
    <h2>Lookup Language Selector</h2>
    <p v-if="selectedLanguage">
      Selected: <strong>{{ selectedLanguage.autonym }}</strong> ({{ selectedLanguage.code }})
    </p>
    <p v-else>No language selected</p>
    <my-language-selector
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
    </my-language-selector>
  </div>
</template>

<script>
import MyLanguageSelector from "../components/MyLanguageSelector.vue";
import { CdxLookup } from "@wikimedia/codex";
import { getAutonym } from "@wikimedia/language-data";

export default {
  name: "LookupDemo",
  components: {
    MyLanguageSelector,
    CdxLookup,
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

