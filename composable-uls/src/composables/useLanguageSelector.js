import { ref, computed, toRef } from 'vue';

/**
 * Composable for language selector functionality
 * 
 * @param {Array|Ref<Array>} languages - Array of language objects with { code, autonym }
 * @param {String|Ref<String>} searchAPI - API endpoint URL for language search
 * @returns {Object} menuItems, allMenuItems, and onSearchUpdate handler
 */
export function useLanguageSelector(languages, searchAPI) {
  // Reactive state
  const languageFilter = ref(null);
  const searchDebounceTimer = ref(null);

  // Convert languages to menu items format
  const toMenuItems = (langs) => {
    return langs.map(lang => ({
      label: lang.autonym,
      value: lang.code,
      description: lang.code,
    }));
  };

  // All languages as menu items (for initial display when no search)
  const allMenuItems = computed(() => {
    const langs = Array.isArray(languages) ? languages : (languages?.value || []);
    return toMenuItems(langs);
  });

  // Filtered menu items based on search results
  const menuItems = computed(() => {
    // Handle both ref and plain value
    const langs = Array.isArray(languages) ? languages : (languages?.value || []);
    const filter = languageFilter.value;
    
    // If no filter, return all languages
    if (!filter || Object.keys(filter).length === 0) {
      return toMenuItems(langs);
    }

    // Filter languages based on codes in the filter (from API response)
    const filtered = langs.filter(lang => {
      const hasCode = lang.code in filter;
      return hasCode;
    });

    return toMenuItems(filtered);
  });

  // Perform API search
  const performSearch = async (query) => {
    // Clear filter if query is empty
    if (!query || query.trim() === '') {
      languageFilter.value = null;
      return;
    }

    // If no API, can't search
    const api = searchAPI ?? null;
    if (!api) {
      languageFilter.value = null;
      return;
    }

    try {
      const url = `${api}&${new URLSearchParams({ search: query })}`;
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      // API returns { languagesearch: { "en": {...}, "fr": {...}, ... } }
      const filter = data.languagesearch || {};
      
      // Set filter to trigger reactivity - create new object to ensure Vue detects change
      languageFilter.value = { ...filter };
      
      // Force a tick to ensure reactivity
      await new Promise(resolve => setTimeout(resolve, 0));
      
    } catch (error) {
      console.error('Search error:', error);
      languageFilter.value = null;
    }
  };

  // Handle search input updates with debouncing
  const onSearchUpdate = (query) => {
    // Clear previous timer
    if (searchDebounceTimer.value) {
      clearTimeout(searchDebounceTimer.value);
    }

    // If empty, clear immediately
    if (!query || query.trim() === '') {
      performSearch('');
      return;
    }

    // Debounce API call
    searchDebounceTimer.value = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  // Cleanup
  const cleanup = () => {
    if (searchDebounceTimer.value) {
      clearTimeout(searchDebounceTimer.value);
    }
  };

  return {
    menuItems,
    allMenuItems,
    onSearchUpdate,
    cleanup,
  };
}

