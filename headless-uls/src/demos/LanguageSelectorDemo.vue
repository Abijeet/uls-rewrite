<template>
  <div class="demo-section">
    <h2>LanguageSelector <a target="_blank" href="https://github.com/Abijeet/uls-rewrite/blob/main/headless-uls/src/demos/LanguageSelectorDemo.vue"><cdx-icon :icon="cdxIconLinkExternal" :size="x-small" ></cdx-icon></a></h2>
    <p v-if="selectedLanguage">
      Selected: <strong>{{ selectedLanguage.autonym }}</strong> ({{ selectedLanguage.code }})
    </p>
    
    <p v-else>No language selected</p>
    <language-selector
      :languages="languageGroups"
      :columns="3"
      :is-fullscreen="false"
      :selected="selectedLanguage"
      :searchAPI="searchAPI"
      @update:selected="onLanguageSelect"
      v-slot="{
        filteredLanguages,
        isGrouped,
        searchValue,
        loading: isLoading,
        compareCodes,
        onLanguageItemClick,
        onSearchUpdate,
      }"
    >
      <div class="language-selector">
        <div class="language-selector-wrapper-root">
          <cdx-search-input
            :model-value="searchValue"
            :clearable="true"
            placeholder="Search languages"
            aria-label="Search languages"
            class="uls-language-search-input"
            @update:model-value="onSearchUpdate"
          ></cdx-search-input>
          <cdx-progress-bar v-if="isLoading" inline></cdx-progress-bar>
          <div class="language-selector__body">
            <div class="language-selector__languages">
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
                      <cdx-icon v-if="isStarred(lang)" :icon="cdxIconStar" size="x-small" class="language-item__star" />
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
                      <cdx-icon v-if="isStarred(lang)" :icon="cdxIconStar" size="x-small" class="language-item__star" />
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
    </language-selector>
  </div>
</template>

<script>
import LanguageSelector from "../components/LanguageSelector.vue";
import { CdxSearchInput, CdxProgressBar, CdxIcon } from "@wikimedia/codex";
import { cdxIconStar, cdxIconLinkExternal } from '@wikimedia/codex-icons';
import { getDir } from "@wikimedia/language-data";
import { getAllLanguages, assignAttributeToRandomLanguages, groupLanguagesByGroup } from "../components/demoHelpers.js";
import { GROUP_TITLES } from "../constants/groupTitles.js";

export default {
  name: "LanguageSelectorDemo",
  components: {
    LanguageSelector,
    CdxSearchInput,
    CdxProgressBar,
    CdxIcon,
  },
  props: {
    searchAPI: {
      type: String,
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
      languageGroups: [],
      cdxIconStar,
      cdxIconLinkExternal,
    };
  },
  mounted() {
    // Setup language groups for LanguageSelector - do this after mount to avoid blocking
    try {
      const allLanguages = getAllLanguages();
      // Add starred attribute to some random languages
      const languagesWithStarred = assignAttributeToRandomLanguages(
        allLanguages,
        'starred',
        true,
        0.15 // 15% chance of being starred
      );
      // Assign some languages to 'suggested' group
      const languagesWithSuggested = assignAttributeToRandomLanguages(
        languagesWithStarred,
        'groups',
        ['suggested'],
        0.1 // 10% chance of being suggested
      );
      // Assign all remaining languages (without groups) to 'all' group
      const languagesWithGroups = languagesWithSuggested.map(lang => {
        if (lang.groups && lang.groups.length > 0) {
          return lang;
        }
        // Assign languages without groups to 'all' group
        return {
          ...lang,
          groups: ['all']
        };
      });
      // Ensure GROUP_TITLES includes 'all' group
      const groupTitles = {
        ...GROUP_TITLES,
        all: 'All languages'
      };
      this.languageGroups = groupLanguagesByGroup(languagesWithGroups, groupTitles);
    } catch (error) {
      console.error('Error initializing language groups:', error);
      // Fallback to empty array if there's an error
      this.languageGroups = [];
    }
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
    isStarred(lang) {
      return lang.starred === true;
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

.language-selector {
  .language-selector-wrapper-root {
    background-color: @background-color-base;
    border: 1px solid @border-color-subtle;
    padding: @spacing-50 @spacing-75;

    .cdx-progress-bar {
      margin-block-end: @spacing-50;
    }

    .language-selector__languages {
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
        display: flex;
        align-items: center;
        gap: 0.25rem;
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

        .language-item__star {
          flex-shrink: 0;
          color: @color-progressive;
        }

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

