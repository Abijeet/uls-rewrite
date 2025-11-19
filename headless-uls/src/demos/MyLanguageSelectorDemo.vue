<template>
  <div class="demo-section">
    <h2>MyLanguageSelector</h2>
    <p v-if="selectedLanguage">
      Selected: <strong>{{ selectedLanguage.autonym }}</strong> ({{ selectedLanguage.code }})
    </p>
    <p v-else>No language selected</p>
    <my-language-selector
      :languages="languageGroups"
      :columns="3"
      :is-fullscreen="false"
      :loading="loading"
      :selected="selectedLanguage"
      :searchAPI="searchAPI"
      @update:selected="onLanguageSelect"
      v-slot="{
        filteredLanguages,
        isGrouped,
        searchValue,
        loading: isLoading,
        selected: selectedLang,
        isFullscreen,
        compareCodes,
        onLanguageItemClick,
        onCloseButtonClicked,
        onSearchUpdate,
      }"
    >
      <div class="my-language-selector">
        <div class="my-language-selector-wrapper-root">
          <cdx-search-input
            :model-value="searchValue"
            :clearable="true"
            placeholder="Search languages"
            aria-label="Search languages"
            class="uls-language-search-input"
            @update:model-value="onSearchUpdate"
          ></cdx-search-input>
          <cdx-progress-bar v-if="isLoading" inline></cdx-progress-bar>
          <div class="my-language-selector__body">
            <div class="my-language-selector__languages">
              <!-- Case 1: Grouped languages -->
              <template v-if="isGrouped && !searchValue">
                <div
                  v-for="group in filteredLanguages"
                  :key="group.code"
                  class="language-group"
                >
                  <h4 class="language-group-title">{{ group.title }}</h4>
                  <ul class="language-list" :style="languageGridStyle">
                    <li
                      v-for="lang in group.languages"
                      :key="lang.code"
                      class="language-item"
                      :class="{
                        'language-item--selected': compareCodes(lang.code)
                      }"
                      :title="lang.tooltip || lang.autonym"
                      :data-code="lang.code"
                      @click="onLanguageItemClick(lang)"
                    >
                      <span :lang="lang.code" :dir="getDir(lang.code)">
                        {{ lang.autonym }}
                      </span>
                    </li>
                  </ul>
                </div>
              </template>

              <!-- Case 2: Flat languages -->
              <template v-else>
                <ul class="language-list" :style="languageGridStyle">
                  <li
                    v-for="lang in filteredLanguages"
                    :key="lang.code"
                    class="language-item"
                    :class="{
                      'language-item--selected': compareCodes(lang.code)
                    }"
                    :title="lang.tooltip || lang.autonym"
                    :data-code="lang.code"
                    @click="onLanguageItemClick(lang)"
                  >
                    <span :lang="lang.code" :dir="getDir(lang.code)">
                      {{ lang.autonym }}
                    </span>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>
    </my-language-selector>
  </div>
</template>

<script>
import MyLanguageSelector from "../components/MyLanguageSelector.vue";
import { CdxSearchInput, CdxProgressBar } from "@wikimedia/codex";
import { getDir } from "@wikimedia/language-data";

export default {
  name: "MyLanguageSelectorDemo",
  components: {
    MyLanguageSelector,
    CdxSearchInput,
    CdxProgressBar,
  },
  props: {
    searchAPI: {
      type: String,
      required: true,
    },
    languageGroups: {
      type: Array,
      required: true,
    },
    selectedLanguage: {
      type: Object,
      default: null,
    },
    columns: {
      type: Number,
      default: 3,
    },
  },
  emits: ['update:selectedLanguage'],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    languageGridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
        gap: '0.5rem'
      };
    },
  },
  methods: {
    getDir,
    onLanguageSelect(lang) {
      this.$emit('update:selectedLanguage', lang);
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

.my-language-selector {
  .my-language-selector-wrapper-root {
    background-color: @background-color-base;
    border: 1px solid @border-color-subtle;
    padding: @spacing-50 @spacing-75;

    .cdx-progress-bar {
      margin-block-end: @spacing-50;
    }

    .my-language-selector__languages {
      max-height: @size-1200;
      overflow-y: auto;
    }

    .uls-language-search-input {
      margin-bottom: @spacing-100;
      width: 100%;
      display: block;
    }

    .language-group {
      margin-bottom: @spacing-75;

      .language-group-title {
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: @spacing-25;
        color: @color-subtle;
      }
    }

    ul.language-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      column-gap: 1.5rem;
      row-gap: 0.25rem;

      li {
        display: block;
        text-align: left;
        padding: 4px 6px;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.9rem;
        line-height: 1.4;
        color: @color-base;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.language-item--selected {
          background-color: @background-color-progressive-subtle;
        }

        &:hover {
          background-color: @background-color-neutral-subtle;
        }
      }
    }
  }
}
</style>

