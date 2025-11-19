<template>
  <div id="app">
    <div class="demo-container">
      <h1>Language Selector Demos</h1>
      
      <LanguageSelectorDemo
        :searchAPI="searchAPI"
      />

      <MyLanguageSelectorDemo
        :searchAPI="searchAPI"
        :languageGroups="languageGroups"
        :selectedLanguage="selectedLanguage"
        @update:selectedLanguage="onLanguageSelect"
      />

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
import LanguageSelector from "./components/LanguageSelector.vue";
import MyLanguageSelector from "./components/MyLanguageSelector.vue";
import LanguageSelectorDemo from "./demos/LanguageSelectorDemo.vue";
import MyLanguageSelectorDemo from "./demos/MyLanguageSelectorDemo.vue";
import LookupDemo from "./demos/LookupDemo.vue";
import MultiselectLookupDemo from "./demos/MultiselectLookupDemo.vue";
import { getAllLanguages, assignAttributeToRandomLanguages, groupLanguagesByGroup } from "./components/demoHelpers.js";
import { GROUP_TITLES } from "./constants/groupTitles.js";

export default {
  name: "App",
  components: {
    LanguageSelector,
    MyLanguageSelector,
    LanguageSelectorDemo,
    MyLanguageSelectorDemo,
    LookupDemo,
    MultiselectLookupDemo,
  },
  data() {
    return {
      searchAPI:
        "https://en.wikipedia.org/w/api.php?action=languagesearch&format=json&formatversion=2&origin=*",
      // languages: ["en", "es", "fr", "hi", "or", "ta", "ml", "zh"],
      languageGroups: [],
      selectedLanguage: null,
      allLanguagesForMultiselect: [],
    };
  },
  mounted() {
    // Setup language groups for MyLanguageSelector - do this after mount to avoid blocking
    try {
      const allLanguages = getAllLanguages();
      const languagesWithSuggested = assignAttributeToRandomLanguages(
        allLanguages,
        'groups',
        ['suggested'],
        0.1 // 10% chance of being suggested
      );
      this.languageGroups = groupLanguagesByGroup(languagesWithSuggested, GROUP_TITLES);
      
      // Setup languages for MultiselectLookup (business logic will handle menu items)
      this.allLanguagesForMultiselect = allLanguages;
    } catch (error) {
      console.error('Error initializing language groups:', error);
      // Fallback to empty array if there's an error
      this.languageGroups = [];
      this.allLanguagesForMultiselect = [];
    }
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
