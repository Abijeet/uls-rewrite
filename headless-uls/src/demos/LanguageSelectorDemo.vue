<template>
  <div class="demo-section">
    <h2>LanguageSelector</h2>
    <LanguageSelector
      :selectableLanguages="languages"
      :searchAPI="searchAPI"
      v-slot="{
        searchResultsByScript,
        resultsDisplayClass,
        inputAttrs,
        inputEvents,
        selected,
        selectLanguage,
        isOpen,
        toggle,
      }"
    >
      <button @click="toggle" class="selected-language">
        <span v-if="selected">Selected: {{ getAutonym(selected) }}</span>
        <span v-else>Select Language</span>
      </button>
      <div class="uls" v-if="isOpen">
        <input
          type="search"
          class="language-search-query px-4 py-3"
          placeholder="Search language..."
          v-on="inputEvents"
          v-bind="inputAttrs"
        />

        <div class="results py-3" v-if="searchResultsByScript.length">
          <h3 class="px-3">Search results</h3>
          <section
            v-for="(chunk, cindex) in searchResultsByScript"
            :key="cindex"
            class="results-languages my-3"
            :class="resultsDisplayClass"
          >
            <span
              v-for="language in chunk"
              :key="language"
              class="language px-3"
              :lang="language"
              :dir="getDir(language)"
              role="button"
              @click="selectLanguage(language)"
              v-text="getAutonym(language)"
            />
          </section>
        </div>
        <div class="no-results" v-else>
          <h3>No results</h3>
        </div>
      </div>
    </LanguageSelector>
  </div>
</template>

<script>
import LanguageSelector from "../components/LanguageSelector.vue";
import { getAutonym, getDir } from "@wikimedia/language-data";

export default {
  name: "LanguageSelectorDemo",
  components: {
    LanguageSelector,
  },
  props: {
    searchAPI: {
      type: String,
      required: true,
    },
    languages: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getAutonym,
    getDir,
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

.no-results,
.results {
  border: 1px solid #999;
  border-top: 0;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 8px;
  min-height: 50vh;
  max-height: 50vh;
  overflow: auto;
}

.language-search-query {
  font-size: 1em;
  line-height: 1.5;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #999;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.results-languages {
  text-align: left;
  margin-top: 1em;
  .language {
    color: #333;
    &:hover {
      background-color: #eee;
    }
  }
  column-gap: 4px;
  &.few-results {
    column-count: 1;
  }
  &.some-results {
    column-count: 2;
  }
  &.many-results {
    column-count: 3;
    .language.breakable {
      color: red;
    }
    .col-break {
      display: block;
      min-height: 10px;
      border: 1px solid red;
    }
  }
}

@media (max-width: 600px) {
  .results-languages {
    &.few-results,
    &.some-results,
    &.many-results {
      column-count: 1;
    }
  }
  .col-break {
    display: none;
  }
}

.language {
  display: block;
  font-size: 1em;
  text-decoration: none;
}
</style>

