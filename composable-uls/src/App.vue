<template>
  <div id="app">
    <div class="demo-container">
      <h1>Language Selector Demos</h1>

      <p>
        The page demonstrates various Language selector component built using the <a href="https://vuejs.org/guide/reusability/composables.html">Composition API</a>. 
        The composable encapsulates the core logic and can be integrated with different UI components.
      </p>

      <!-- <LanguageSelectorDemo
        :searchAPI="searchAPI"
        :selectedLanguage="selectedLanguage"
        @update:selectedLanguage="onLanguageSelect"
      /> -->

      <LookupDemo
        :searchAPI="searchAPI"
        :allLanguages="allLanguagesForMultiselect"
      />

      <MultiselectLookupDemo
        :searchAPI="searchAPI"
        :allLanguages="allLanguagesForMultiselect"
      />
    </div>
  </div>
</template>

<script>
// import LanguageSelectorDemo from "./demos/LanguageSelectorDemo.vue";
import LookupDemo from "./demos/LookupDemo.vue";
import MultiselectLookupDemo from "./demos/MultiselectLookupDemo.vue";
import { CdxIcon } from "@wikimedia/codex";
import { cdxIconLinkExternal } from '@wikimedia/codex-icons';
import { getAllLanguages } from "./utils/demoHelpers.js";

export default {
  name: "App",
  components: {
    // LanguageSelectorDemo,
    LookupDemo,
    MultiselectLookupDemo,
    CdxIcon,
  },
  data() {
    // Load languages synchronously so they're available immediately
    let allLanguagesForMultiselect = [];
    try {
      allLanguagesForMultiselect = getAllLanguages();
    } catch (error) {
      console.error('Error initializing languages:', error);
      // Fallback to empty array if there's an error
      allLanguagesForMultiselect = [];
    }

    return {
      searchAPI:
        "https://en.wikipedia.org/w/api.php?action=languagesearch&format=json&formatversion=2&origin=*",
      selectedLanguage: null,
      allLanguagesForMultiselect,
      cdxIconLinkExternal,
    };
  },
  methods: {
    onLanguageSelect(lang) {
      this.selectedLanguage = lang;
      console.log('Language selected:', lang);
    },
    onClose() {
      console.log('Language selector closed');
    },
  },
};
</script>

<style lang="less">
@import '@wikimedia/codex/dist/codex.style.css';
@import './styles/mediawiki.skin.variables.less';

#app {
  font-family: @font-family-sans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: @spacing-100;
  color: @color-base;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
}

</style>
