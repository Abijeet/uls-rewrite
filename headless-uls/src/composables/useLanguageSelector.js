import { ref, computed, unref } from 'vue';
import { flattenLanguageGroups } from '../components/demoHelpers.js';

/**
 * Composable for language selector functionality
 * 
 * @param {Object} options - Configuration options
 * @param {Array|Ref<Array>|ComputedRef<Array>} options.languages - Array of languages (can be flat or grouped), can be reactive
 * @param {Object|Ref<Object>|ComputedRef<Object>} options.selected - Currently selected language object, can be reactive
 * @param {String|Ref<String>|ComputedRef<String>} options.searchAPI - API endpoint for language search, can be reactive
 * @returns {Object} Reactive state and methods for language selection
 */
export function useLanguageSelector(options = {}) {
  const { languages: languagesOption = [], selected: selectedOption = null, searchAPI: searchAPIOption = null } = options;

  // Reactive state
  const searchValue = ref('');
  const languageFilter = ref(null);
  const isSearching = ref(false);
  const searchDebounceTimer = ref(null);

  // Computed properties - use unref to get the value from refs/computed/getters
  const languages = computed(() => {
    const val = typeof languagesOption === 'function' ? languagesOption() : languagesOption;
    return unref(val);
  });
  const selected = computed(() => {
    const val = typeof selectedOption === 'function' ? selectedOption() : selectedOption;
    return unref(val);
  });
  const searchAPI = computed(() => {
    const val = typeof searchAPIOption === 'function' ? searchAPIOption() : searchAPIOption;
    return unref(val);
  });

  const isGrouped = computed(() => {
    const langs = languages.value;
    return !!(langs && langs.length > 0 && langs[0].languages);
  });

  const filteredLanguages = computed(() => {
    const langs = languages.value || [];
    if (!languageFilter.value) {
      return langs;
    }

    const filterFn = (lang) => lang.code in languageFilter.value;

    let languagesList = langs;
    if (isGrouped.value) {
      languagesList = flattenLanguageGroups(langs);
    }

    return languagesList.filter(filterFn);
  });

  // Menu items for MultiselectLookup format
  const menuItems = computed(() => {
    const langs = languages.value || [];
    let languagesList = langs;
    if (isGrouped.value) {
      languagesList = flattenLanguageGroups(langs);
    }

    // If there's a language filter from search API, apply it
    // The languageFilter is an object where keys are language codes from the API response
    if (languageFilter.value && Object.keys(languageFilter.value).length > 0) {
      languagesList = languagesList.filter(lang => lang.code in languageFilter.value);
    }

    return languagesList.map(lang => ({
      label: lang.autonym,
      value: lang.code,
      description: lang.code,
    }));
  });

  // All languages as menu items (for initial display)
  const allMenuItems = computed(() => {
    const langs = languages.value || [];
    let languagesList = langs;
    if (isGrouped.value) {
      languagesList = flattenLanguageGroups(langs);
    }
    return languagesList.map(lang => ({
      label: lang.autonym,
      value: lang.code,
      description: lang.code,
    }));
  });

  // Methods
  const compareCodes = (code) => {
    const sel = selected.value;
    if (!sel) {
      return false;
    }
    return sel.code === code;
  };

  // Core search method
  const performSearch = async (query) => {
    if (!query || query.trim() === '') {
      languageFilter.value = null;
      searchValue.value = '';
      isSearching.value = false;
      return;
    }

    searchValue.value = query;

    // Use provided searchAPI
    const api = searchAPI.value;
    if (!api) {
      languageFilter.value = null;
      return;
    }

    isSearching.value = true;
    const endpoint = api;
    const url = `${endpoint}&${new URLSearchParams({ search: query })}`;

    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      // The API returns { languagesearch: { "en": {...}, "fr": {...}, ... } }
      // where keys are language codes
      languageFilter.value = data.languagesearch || {};
      
      // Debug: log the filter to help diagnose issues
      if (Object.keys(languageFilter.value).length === 0) {
        console.warn('Language search API returned empty results for query:', query);
      }
    } catch (error) {
      console.error('Error searching languages:', error);
      languageFilter.value = null;
    } finally {
      isSearching.value = false;
    }
  };

  const onSearchUpdate = (query) => {
    // Clear previous debounce timer
    if (searchDebounceTimer.value) {
      clearTimeout(searchDebounceTimer.value);
    }

    // If query is empty, reset the search
    if (!query || query.trim() === '') {
      performSearch('');
      return;
    }

    // Debounce the search API call
    const currentQuery = query;
    searchDebounceTimer.value = setTimeout(() => {
      performSearch(currentQuery);
    }, 300);
  };

  // Cleanup on unmount
  const cleanup = () => {
    if (searchDebounceTimer.value) {
      clearTimeout(searchDebounceTimer.value);
    }
  };

  return {
    // State
    searchValue,
    languageFilter,
    isSearching,
    
    // Computed
    filteredLanguages,
    isGrouped,
    menuItems,
    allMenuItems,
    
    // Methods
    compareCodes,
    onSearchUpdate,
    performSearch,
    cleanup,
  };
}

