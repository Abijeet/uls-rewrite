import { getAutonyms } from '@wikimedia/language-data';

const autonyms = getAutonyms();

/**
 * @returns {Array} Array of language options with label and value
 */
function getLanguageOptions()  {
    const languages = [];
    Object.keys( autonyms ).forEach( code => {
        languages.push( { label: getAutonyms()[code], value: code } );
    } );
    return languages;
}

export {
    getLanguageOptions
}