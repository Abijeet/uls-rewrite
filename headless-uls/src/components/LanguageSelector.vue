<script>
import languagedata from "@wikimedia/language-data";
export default {
  name: "LanguageSelector",

  props: {
    /**
     * Array of language codes. This is the available set of
     * languages that this selector is aware of.
     * If not passed, all languages known to langaugedata library
     * will be used.
     */
    selectableLanguages: {
      type: Array,
      default: () => null,
    },

    /**
     * Search API URL for language search.
     */
    searchAPI: {
      type: String,
      default: () => null,
    },
  },

  data: () => ({
    searchQuery: "",
    searchResults: [],
    selected: null,
    isOpen: false,
  }),

  computed: {
    allLanguages: () => Object.keys(languagedata.getLanguages()),
    languages: (vm) => vm.selectableLanguages || vm.allLanguages,
    availableLanguages: () => languagedata.getLanguages(),
    searchResultsByScript: (vm) => {
      let chunkSize;
      const languagesByScript = [
        ...vm.searchResults.sort(languagedata.sortByAutonym),
      ];
      const resultsCount = vm.searchResults.length;
      if (resultsCount < 10) chunkSize = resultsCount;
      if (resultsCount < 30) chunkSize = 10;
      if (resultsCount >= 30) chunkSize = 15;
      const chunks = [];

      while (languagesByScript.length) {
        chunks.push(languagesByScript.splice(0, chunkSize));
      }

      return chunks;
    },
    resultsDisplayClass: (vm) => {
      const resultsCount = vm.searchResults.length;
      if (resultsCount < 10) return "few-results";
      if (resultsCount < 30) return "some-results";
      if (resultsCount >= 30) return "many-results";
    },
  },

  watch: {
    /**
     * @param {string} query
     */
    searchQuery: async function (query) {
      this.searchResults = await this.search(query);
    },
  },

  mounted: async function () {
    // Initialize with an empty search
    this.searchResults = await this.search();
  },

  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },

    close() {
      this.isOpen = false;
    },

    selectLanguage: function (language) {
      this.selected = language;
      this.close();
    },
    /**
     * @param {string} [query]
     * @return {Promise<string[]>}
     */
    search: async function (query) {
      if (!query || query.trim().length === 0) {
        return this.languages;
      }

      if (this.searchAPI) {
        const searchApiResults = await this.searchWithAPI(this.searchQuery);
        // Remove the languages not known to this selector.
        return searchApiResults.filter((code) => this.languages.includes(code));
      }

      // If no search API is provided, do a client side search
      const exactMatch = this.languages.filter(
        (code) => query.toLowerCase() === code.toLowerCase()
      );

      if (exactMatch.length) {
        return exactMatch;
      }

      const filterResults = this.languages.filter(
        (code) =>
          // Search using autonym
          languagedata
            .getAutonym(code)
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          // Search using script name
          languagedata
            .getScript(code)
            .toLowerCase()
            .includes(query.toLowerCase())
      );

      if (filterResults.length) {
        return filterResults;
      }

      return [];
    },

    /**
     * @param {string} query
     * @return {Promise<string[]>}
     */
    searchWithAPI: function (query) {
      const apiURL = new URL(this.searchAPI);
      apiURL.searchParams.append("search", query);
      apiURL.searchParams.append("origin", "*");
      return fetch(apiURL.toString())
        .then((response) => response.json())
        .then((result) => Object.keys(result.languagesearch || {}));
    },
  },
  render() {
    return this.$slots.default({
      languages: this.languages,
      searchResults: this.searchResults,
      searchResultsByScript: this.searchResultsByScript,
      resultsDisplayClass: this.resultsDisplayClass,
      selected: this.selected,
      selectLanguage: this.selectLanguage,
      isOpen: this.isOpen,
      toggle: this.toggle,
      close: this.close,
      inputAttrs: {
        value: this.searchQuery,
      },
      inputEvents: {
        input: (e) => {
          this.searchQuery = e.target.value;
        },
        keydown: (e) => {
          if (e.keyCode === 13) {
            e.preventDefault();
            // handle enter
          }
        },
      },
    });
  },
};
</script>