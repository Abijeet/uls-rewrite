<script>
import { flattenLanguageGroups } from './demoHelpers.js';

export default {
  name: 'MyLanguageSelector',

  props: {
    /**
     * `languages` can be either:
     *  - Array<{ code, autonym, tooltip? }>
     *  - Array<{ code, title, languages: Array<{ code, autonym, tooltip? }> }>
     */
    languages: { type: Array, required: true },
    columns: { type: Number, default: 1 },
    isFullscreen: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    selected: { type: Object, default: null },
    searchAPI: {
      type: String,
      default: () => null,
    },
  },

  emits: [ 'update:selected', 'close' ],

  data() {
    return {
      searchValue: '',
      languageFilter: null,
    };
  },

  computed: {
    isGrouped() {
      return !!(this.languages.length > 0 && this.languages[0].languages);
    },

    filteredLanguages() {
      if (!this.languageFilter) {
        return this.languages;
      }

      const filterFn = (lang) => lang.code in this.languageFilter;

      let languages = this.languages;
      if (this.isGrouped) {
        languages = flattenLanguageGroups(this.languages);
      }

      return languages.filter(filterFn);
    },

    gridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
        gap: '0.5rem'
      };
    },
  },

  methods: {
    compareCodes(code) {
      if (!this.selected) {
        return false;
      }
      return this.selected.code === code;
    },

    onLanguageItemClick(lang) {
      this.$emit('update:selected', lang);
    },

    onCloseButtonClicked() {
      this.$emit('close');
    },

    async onSearchUpdate(query) {
      if (!query) {
        this.languageFilter = null;
        this.searchValue = '';
        return;
      }
      this.searchValue = query;

      // Use provided searchAPI
      const endpoint = this.searchAPI;
      const url = `${endpoint}&${new URLSearchParams({ search: query })}`;

      try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        this.languageFilter = data.languagesearch || {};
      } catch (error) {
        console.error('Error searching languages:', error);
        this.languageFilter = null;
      }
    },
  },

  render() {
    return this.$slots.default({
      // Data
      filteredLanguages: this.filteredLanguages,
      isGrouped: this.isGrouped,
      gridStyle: this.gridStyle,
      searchValue: this.searchValue,
      loading: this.loading,
      selected: this.selected,
      isFullscreen: this.isFullscreen,

      // Methods
      compareCodes: this.compareCodes,
      onLanguageItemClick: this.onLanguageItemClick,
      onCloseButtonClicked: this.onCloseButtonClicked,
      onSearchUpdate: this.onSearchUpdate,

      // Search input attrs/events
      searchInputAttrs: {
        value: this.searchValue,
        clearable: true,
        placeholder: 'Search',
        'aria-label': 'Search languages',
      },
      searchInputEvents: {
        'update:model-value': (value) => {
          this.onSearchUpdate(value);
        },
      },
    });
  },
};
</script>

