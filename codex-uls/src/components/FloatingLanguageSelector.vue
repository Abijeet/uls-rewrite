<template>
    <div class="language-selector-trigger-wrapper">
        <cdx-button ref="langaugeSelectorButtonRef" @click="isVisible = !isVisible">
            {{ selectedLanguageLabel }}
        </cdx-button>
        <cdx-button
            v-if="isLanguageSelected"
            weight="quiet"
            aria-label="Clear"
            @click="onClear">
            <cdx-icon :icon="cdxIconClear" />
        </cdx-button>
    </div>
    <div v-if="isVisible" ref="containerEl" class="floating-language-selector" :style="floatingStyles">
        <div class="ls-language-selector-header">
            <cdx-text-input
                :start-icon="cdxIconSearch"
                :model-value="inputValue"
                placeholder="Search for a language"
                @update:model-value="onSearch"
                @keydown="onKeyDown" />
            <cdx-button
                weight="quiet"
                aria-label="Close"
                @click="onClose">
                <cdx-icon :icon="cdxIconClose" />
            </cdx-button>   
        </div>
        <div class="ls-language-list">
            <ul>
                <li
                    v-for="( item, index ) in menuItems"
                    :key="item.value"
                    :class="{ 'ls-language-list-item--selected': index === selectedIndex }"
                    @click="onSelect( item )">
                    <a href="#">{{ item.label }}</a>
                </li>
            </ul>
        </div>
        <div class="ls-language-selector-dialog-footer">
        </div>
    </div>
</template>
<script>
import { computed, onMounted, ref, watch } from 'vue';
import { CdxTextInput, CdxButton, CdxIcon } from '@wikimedia/codex';
import { getLanguageAutonyms, searchLanguages } from '../repositories/Languages';
import { languageSearchDebounce } from '../config/LanguageSelectorMenuConfig';
import { cdxIconSearch, cdxIconClose, cdxIconClear } from '@wikimedia/codex-icons';
import { useFloating, autoUpdate } from '@floating-ui/vue';


const defaultLabel = 'Choose language...';
export default {
    name: 'FloatingLanguageSelector',
    components: {
        CdxTextInput,
        CdxButton,
        CdxIcon
    }, 
    emits: [ 'close', 'select' ],
    setup( props, { emit } ) {
        const containerEl = ref( null );
        const langaugeSelectorButtonRef = ref( null );
        const allLanguageOptions = getLanguageAutonyms();
        const menuItems = ref( allLanguageOptions );
        const inputValue = ref( '' );
        const selectedIndex = ref( -1 );
        const isVisible = ref( false );
        const selectedLanguageLabel = ref( defaultLabel );
        const isLanguageSelected = computed( () => selectedLanguageLabel.value !== defaultLabel );
        let debounceTimer;
        let listEl;

        /** Trigger search when text is entered */
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

        const onSelect = ( item ) => {
            selectedLanguageLabel.value = item.label;
            isVisible.value = false;
            emit( 'select', item );
        };

        const onClear = () => {
            selectedLanguageLabel.value = 'Choose language...';
            isVisible.value = false;
            emit( 'select', null );
        };

        /** Handle keyboard events */
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
                if ( selectedIndex.value > -1 ) {
                    onSelect( menuItems.value[ selectedIndex.value ] );
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
            isVisible.value = false;
        };

        const { floatingStyles } = useFloating( langaugeSelectorButtonRef, containerEl, {
            placement: 'bottom-start',
            whileElementsMounted: autoUpdate
        } );

        onMounted( () => {
            watch( isVisible, ( visible ) => {
                if ( visible && containerEl.value ) {
                    listEl = containerEl.value.querySelector( '.ls-language-list ul' );
                }
            } );
        } );

        return {
            containerEl,
            langaugeSelectorButtonRef,
            menuItems,
            inputValue,
            onSearch,
            onKeyDown,
            onSelect,
            onClear,
            selectedIndex,
            selectedLanguageLabel,
            isLanguageSelected,
            cdxIconSearch,
            cdxIconClose,
            cdxIconClear,
            onClose,
            floatingStyles,
            isVisible
        };
    }
};
</script>
<style>
.language-selector-trigger-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5em;
}

.floating-language-selector {
    width: 500px;
    display: flex;
    flex-direction: column;
    height: 500px;
    padding: 0;
    border: 1px solid #ccc;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 2;

    .ls-language-selector-header {
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 1em;
        border-bottom: 1px solid #ccc;

        .cdx-text-input {
            flex-grow: 1;
        }
    }

    .ls-language-list {
        margin-top: 1em;
        overflow-y: auto;
        flex-grow: 1;
        padding: 0 1em;

        ul {
            list-style-type: none; 
            padding: 0;
            display: grid;
            grid-template-columns: repeat(2, 1fr); /* Add two equal-fraction columns */
            gap: 10px; 
        }

        li a {
            padding: 0.5em;
            display: block;
            text-decoration: none;
            color: #333;

            &:hover {
                background-color: #f0f0f0;
            }
        }

        .ls-language-list-item--selected a {
            background-color: #aadaff;
        }
    }

    .ls-language-selector-dialog-footer {
        padding: 0.5em;
        border-top: 1px solid #ccc;
    }
}

@media (max-width: 720px) {
    .floating-language-selector {
        width: 100vw;
        height: 100vh;
        top: 0 !important;
        left: 0 !important;
        border: none;
        box-shadow: none;

        .ls-language-list ul {
            grid-template-columns: 1fr;
        }
    }
}
</style>
