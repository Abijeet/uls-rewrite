<template>
  <!-- Fullscreen overlay with teleport -->
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
          <my-language-selector-demo
            :searchAPI="searchAPI"
            :selectedLanguage="selectedLanguage"
            :columns="columns"
            @update:selectedLanguage="onLanguageSelect"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import MyLanguageSelectorDemo from "./MyLanguageSelectorDemo.vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconClose } from '@wikimedia/codex-icons';

export default {
  name: "FullscreenLanguageSelectorDemo",
  components: {
    MyLanguageSelectorDemo,
    CdxButton,
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
    isFullscreen: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Number,
      default: 3,
    },
  },
  emits: ['update:selectedLanguage', 'update:is-fullscreen'],
  data() {
    return {
      cdxIconClose,
    };
  },
  methods: {
    onLanguageSelect(lang) {
      this.$emit('update:selectedLanguage', lang);
      // Close fullscreen when a language is selected
      this.$emit('update:is-fullscreen', false);
    },
    closeFullscreen() {
      this.$emit('update:is-fullscreen', false);
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

  .demo-section {
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

    .my-language-selector {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;

      .my-language-selector-wrapper-root {
        .my-language-selector__languages {
          max-height: 100vh;
        }
      }
    }
  }
}
</style>

