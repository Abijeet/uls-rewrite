import { getAutonyms } from '@wikimedia/language-data';

const autonyms = getAutonyms();

function getLanguageAutonyms() {
    return getLanguageOptions( autonyms );
}

// New: search the MediaWiki API languagesearch endpoint and return mapped results
async function searchLanguages(search) {
    if (!search) {
        return [];
    }
    
    const endpoint = 'https://en.wikipedia.org/w/api.php';
    const params = new URLSearchParams({
        action: 'languagesearch',
        format: 'json',
        formatversion: '2',
        origin: '*', // allow CORS
        search: String(search)
    });

    const url = `${endpoint}?${params.toString()}`;
    const res = await fetch(url);
    
    if (!res.ok) {
        throw new Error(`language search request failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    if ( !Object.prototype.hasOwnProperty.call(data, 'languagesearch') ) {
        throw new Error( `language search response missing required properties` );
    }

    return getLanguageOptions( data.languagesearch );
}

/**
 * @returns {Array} Array of language options with label and value
 */
function getLanguageOptions( languageList )  {
    const languages = [];
    Object.keys( languageList ).forEach( code => {
        languages.push( { label: languageList[code], value: code } );
    } );
    return languages;
}

export {
    getLanguageAutonyms,
    searchLanguages
}