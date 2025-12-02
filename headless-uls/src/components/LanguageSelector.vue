<script>
import { flattenLanguageGroups } from './demoHelpers.js';

export default {
  name: 'LanguageSelector',

  props: {
    /**
     * `languages` can be either:
     *  - Array<{ code, autonym, tooltip? }>
     *  - Array<{ code, title, languages: Array<{ code, autonym, tooltip? }> }>
     */
    languages: { type: Array, required: true },
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
      isSearching: false,
      searchDebounceTimer: null,
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


    // Menu items for MultiselectLookup format
    menuItems() {
      let languages = this.languages;
      if (this.isGrouped) {
        languages = flattenLanguageGroups(this.languages);
      }

      // If there's a language filter from search, apply it
      // If no search value, show all languages
      if (this.searchValue && this.languageFilter) {
        languages = languages.filter(lang => lang.code in this.languageFilter);
      }

      return languages.map(lang => ({
        label: lang.autonym,
        value: lang.code,
        description: lang.code,
      }));
    },

    // All languages as menu items (for initial display)
    allMenuItems() {
      let languages = this.languages;
      if (this.isGrouped) {
        languages = flattenLanguageGroups(this.languages);
      }
      return languages.map(lang => ({
        label: lang.autonym,
        value: lang.code,
        description: lang.code,
      }));
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

    // Core search method
    async performSearch(query) {
      if (!query || query.trim() === '') {
        this.languageFilter = null;
        this.searchValue = '';
        this.isSearching = false;
        return;
      }

      this.searchValue = query;

      // Use provided searchAPI
      if (!this.searchAPI) {
        this.languageFilter = null;
        return;
      }

      this.isSearching = true;
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
      } finally {
        this.isSearching = false;
      }
    },

    onSearchUpdate(query) {
      // Clear previous debounce timer
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      // If query is empty, reset the search
      if (!query || query.trim() === '') {
        this.performSearch('');
        return;
      }

      // Debounce the search API call
      const currentQuery = query;
      this.searchDebounceTimer = setTimeout(() => {
        this.performSearch(currentQuery);
      }, 300);
    },
  },

  render() {
    return this.$slots.default({
      // Data
      filteredLanguages: this.filteredLanguages,
      isGrouped: this.isGrouped,
      searchValue: this.searchValue,
      loading: this.isSearching,
      selected: this.selected,
      // Multiselect data
      menuItems: this.menuItems,
      allMenuItems: this.allMenuItems,

      // Methods
      compareCodes: this.compareCodes,
      onLanguageItemClick: this.onLanguageItemClick,
      onCloseButtonClicked: this.onCloseButtonClicked,
      onSearchUpdate: this.onSearchUpdate,
    });
  },
};
</script>

