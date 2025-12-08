<template>
  <!-- Fullscreen demo with teleport -->
  <teleport v-if="isFullscreen" to="body">
    <div class="fullscreen-overlay" @click.self="closeFullscreen">
      <div class="fullscreen-content">
        <div class="fullscreen-header">
          <h3>Select a Language</h3>
          <cdx-button
            weight="quiet"
            action="quiet"
            @click="closeFullscreen"
            aria-label="Close"
          >
            <cdx-icon :icon="cdxIconClose" />
          </cdx-button>
        </div>
        <div class="fullscreen-body">
          <div class="demo-section demo-section--fullscreen">
            <language-selector
              :languages="languageGroups"
              :columns="selectedColumns"
              :is-fullscreen="true"
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
        </div>
      </div>
    </div>
  </teleport>

  <!-- Regular demo section -->
  <div class="demo-section">
    <h2>LanguageSelector <a target="_blank" href="https://github.com/Abijeet/uls-rewrite/blob/main/headless-uls/src/demos/LanguageSelectorDemo.vue"><cdx-icon :icon="cdxIconLinkExternal" :size="x-small" ></cdx-icon></a></h2>
    <p v-if="selectedLanguage">
      Selected: <strong>{{ selectedLanguage.autonym }}</strong> ({{ selectedLanguage.code }})
    </p>
    
    <p v-else>No language selected</p>
    
    <div class="demo-controls">
      <cdx-field>
        <cdx-select
          v-model:selected="selectedColumns"
          :menu-items="columnOptions"
          aria-label="Select number of columns"
        />
      </cdx-field>  
      <cdx-field>
        <cdx-button @click="openFullscreen" action="progressive">
          Fullscreen
        </cdx-button>
      </cdx-field>
    </div>
    
    <language-selector
      :languages="languageGroups"
      :columns="selectedColumns"
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
import { CdxSearchInput, CdxProgressBar, CdxIcon, CdxButton, CdxField, CdxSelect } from "@wikimedia/codex";
import { cdxIconStar, cdxIconLinkExternal, cdxIconClose } from '@wikimedia/codex-icons';
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
    CdxButton,
    CdxField,
    CdxSelect,
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
  },
  emits: ['update:selectedLanguage'],
  data() {
    return {
      languageGroups: [],
      cdxIconStar,
      cdxIconLinkExternal,
      cdxIconClose,
      selectedColumns: 3,
      isFullscreen: false,
      columnOptions: [
        { label: "1 column", value: 1 },
        { label: "2 columns", value: 2 },
        { label: "3 columns", value: 3 },
        { label: "4 columns", value: 4 },
      ],
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
        gridTemplateColumns: `repeat(${this.selectedColumns}, 1fr)`,
        gap: '0.5rem'
      };
    },
  },
  methods: {
    getDir,
    onLanguageSelect(lang) {
      this.$emit('update:selectedLanguage', lang);
      // Close fullscreen when a language is selected
      if (this.isFullscreen) {
        this.isFullscreen = false;
      }
    },
    isStarred(lang) {
      return lang.starred === true;
    },
    openFullscreen() {
      this.isFullscreen = true;
    },
    closeFullscreen() {
      this.isFullscreen = false;
    },
  },
};
</script>

<style lang="less">
@import '../styles/mediawiki.skin.variables.less';

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.fullscreen-content {
  width: 100%;
  height: 100%;
  background: @background-color-base;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @spacing-100 @spacing-200;
  border-bottom: 1px solid @border-color-subtle;
  flex-shrink: 0;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.fullscreen-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .demo-section--fullscreen {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    border: none;
    min-height: 0;

    h2,
    p {
      display: none;
    }

    .language-selector {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;

      .language-selector-wrapper-root {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;

        .language-selector__languages {
          flex: 1;
          overflow-y: auto;
          max-height: 100vh;
        }
      }
    }
  }
}

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

  .demo-controls {
    display: flex;
    gap: @spacing-200;
    margin-bottom: @spacing-200;
    align-items: flex-end;
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

