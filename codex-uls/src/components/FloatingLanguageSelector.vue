<template>
    <dialog ref="dialogEl" closedby="any">
        <div class="ls-language-selector-dialog-header">
            <cdx-text-input
                :start-icon="cdxIconSearch"
                :model-value="inputValue"
                placeholder="Search for a language"
                @update:model-value="onSearch"
                @keydown="onKeyDown" />
        </div>
        <div class="ls-language-list">
            <ul>
                <li
                    v-for="( item, index ) in menuItems"
                    :key="item.value"
                    :class="{ 'ls-language-list-item--selected': index === selectedIndex }">
                    <a href="#">{{ item.label }}</a>
                </li>
            </ul>
        </div>
        <div class="ls-language-selector-dialog-footer">
            <cdx-button @click="dialogEl.close()">Close</cdx-button>
        </div>
    </dialog>
</template>
<script>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { CdxTextInput, CdxButton } from '@wikimedia/codex';
import { getLanguageAutonyms, searchLanguages } from '../repositories/Languages';
import { languageSearchDebounce } from '../config/LanguageSelectorMenuConfig';
import { cdxIconSearch } from '@wikimedia/codex-icons';

export default {
    name: 'FloatingLanguageSelector',
    components: {
        CdxTextInput,
        CdxButton
    },
    emits: [ 'close' ],
    setup( props, { emit } ) {
        const dialogEl = ref( null );
        const allLanguageOptions = getLanguageAutonyms();
        const menuItems = ref( allLanguageOptions );
        const inputValue = ref( '' );
        const selectedIndex = ref( -1 );
        let debounceTimer;
        let listEl;

        const onSearch = ( newValue ) => {
            inputValue.value = newValue;
            selectedIndex.value = -1;
            if ( newValue === '' ) {
                menuItems.value = allLanguageOptions;
                return;
            }

            clearTimeout( debounceTimer );
            debounceTimer = setTimeout( async () => {
                try {
                    menuItems.value = await searchLanguages( newValue );
                } catch {
                    menuItems.value = [];
                }
            }, languageSearchDebounce );
        };

        const onKeyDown = ( event ) => {
            if ( event.key === 'ArrowDown' ) {
                event.preventDefault();
                if ( selectedIndex.value < menuItems.value.length - 1 ) {
                    selectedIndex.value++;
                }
            } else if ( event.key === 'ArrowUp' ) {
                event.preventDefault();
                if ( selectedIndex.value > 0 ) {
                    selectedIndex.value--;
                }
            } else if ( event.key === 'Enter' ) {
                event.preventDefault();
                if ( selectedIndex.value !== -1 ) {
                    const selectedItem = menuItems.value[ selectedIndex.value ];
                }
            }
        };

        watch( selectedIndex, ( newIndex, oldIndex ) => {
            if ( newIndex === -1 || newIndex === oldIndex ) {
                return;
            }

            if ( !listEl ) {
                return;
            }
            const element = listEl.children[ newIndex ];
            if ( element ) {
                element.scrollIntoView( { block: 'nearest' } );
            }
        } );

        const onClose = () => {
            emit( 'close' );
        };

        onMounted( () => {
            dialogEl.value.showModal();
            dialogEl.value.addEventListener( 'close', onClose );
            listEl = dialogEl.value.querySelector( '.ls-language-list ul' );
        } );

        onUnmounted( () => {
            if ( dialogEl.value ) {
                dialogEl.value.removeEventListener( 'close', onClose );
            }
        } );

        return {
            dialogEl,
            menuItems,
            inputValue,
            onSearch,
            onKeyDown,
            selectedIndex,
            cdxIconSearch
        };
    }
};
</script>
<style>
dialog {
    width: 500px;
    display: flex;
    flex-direction: column;
    height: 500px;
    padding: 0;
}

.ls-language-selector-dialog-header {
    padding: 1em;
    border-bottom: 1px solid #ccc;
}

.ls-language-list {
    margin-top: 1em;
    overflow-y: auto;
    flex-grow: 1;
    padding: 0 1em;
}

.ls-language-list ul {
    list-style-type: none; 
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Add two equal-fraction columns */
    gap: 10px; 
}

.ls-language-list li a {
    padding: 0.5em;
    display: block;
    text-decoration: none;
    color: #333;
}

.ls-language-list li a:hover {
    background-color: #f0f0f0;
}

.ls-language-list-item--selected a {
    background-color: #aadaff;
}

.ls-language-selector-dialog-footer {
    padding: 0.5em;
    border-top: 1px solid #ccc;
}
</style>
