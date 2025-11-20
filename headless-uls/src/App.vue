<template>
  <div id="app">
    <div class="demo-container">
      <h1>Language Selector Demos</h1>
      
      <LanguageSelectorDemo
        :searchAPI="searchAPI"
      />

      <div class="columns-control">
        <cdx-field>
          <cdx-select
            v-model:selected="selectedColumns"
            :menu-items="columnOptions"
            aria-label="Select number of columns"
          />
        </cdx-field>  
        <cdx-field>
          <cdx-button @click="isFullscreen = true" action="progressive">
            Fullscreen
          </cdx-button>
        </cdx-field>
      </div>

      <MyLanguageSelectorDemo
        :searchAPI="searchAPI"
        :selectedLanguage="selectedLanguage"
        :columns="selectedColumns"
        @update:selectedLanguage="onLanguageSelect"
      />

      <FullscreenLanguageSelectorDemo
        :searchAPI="searchAPI"
        :selectedLanguage="selectedLanguage"
        :is-fullscreen="isFullscreen"
        :columns="selectedColumns"
        @update:selectedLanguage="onLanguageSelect"
        @update:is-fullscreen="isFullscreen = $event"
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
import FullscreenLanguageSelectorDemo from "./demos/FullscreenLanguageSelectorDemo.vue";
import LookupDemo from "./demos/LookupDemo.vue";
import MultiselectLookupDemo from "./demos/MultiselectLookupDemo.vue";
import { CdxField, CdxSelect, CdxButton } from "@wikimedia/codex";
import { getAllLanguages } from "./components/demoHelpers.js";

export default {
  name: "App",
  components: {
    LanguageSelector,
    MyLanguageSelector,
    LanguageSelectorDemo,
    MyLanguageSelectorDemo,
    FullscreenLanguageSelectorDemo,
    LookupDemo,
    MultiselectLookupDemo,
    CdxField,
    CdxSelect,
    CdxButton,
  },
  data() {
    return {
      searchAPI:
        "https://en.wikipedia.org/w/api.php?action=languagesearch&format=json&formatversion=2&origin=*",
      selectedLanguage: null,
      allLanguagesForMultiselect: [],
      selectedColumns: 3,
      columnOptions: [
        { label: "1 column", value: 1 },
        { label: "2 columns", value: 2 },
        { label: "3 columns", value: 3 },
        { label: "4 columns", value: 4 },
      ],
      isFullscreen: false,
    };
  },
  mounted() {
    // Setup languages for MultiselectLookup and Lookup (business logic will handle menu items)
    try {
      const allLanguages = getAllLanguages();
      this.allLanguagesForMultiselect = allLanguages;
    } catch (error) {
      console.error('Error initializing languages:', error);
      // Fallback to empty array if there's an error
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

.columns-control {
  display: flex;
  gap: @spacing-200;
  margin-bottom: @spacing-200;
  align-items: flex-end;
}

</style>
