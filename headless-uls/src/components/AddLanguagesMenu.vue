<template>
	<div v-if="modelValue" class="add-languages-menu">
		<div class="add-languages-menu-wrapper-root">
			<div class="add-languages-menu-header">
				<cdx-button weight="quiet" @click="$emit( 'close' )">
					<cdx-icon :icon="cdxIconArrowPrevious"></cdx-icon>
				</cdx-button>
				<h3>Add languages</h3>
			</div>
			<component
				:is="component"
				v-for="( { component, props }, key ) in menuComponents"
				:key="`menu-component-${key}`"
				v-bind="props"
			></component>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import { CdxButton, CdxDialog, CdxTabs, CdxTab, CdxIcon, CdxCheckbox, CdxField, CdxRadio } from '@wikimedia/codex';
import { cdxIconArrowPrevious } from '@wikimedia/codex-icons';
import AddLanguagesMenuItemDefault from './AddLanguagesMenuItemDefault.vue';

// @vue/component
export default defineComponent( {
	components: { CdxButton, CdxDialog, CdxTabs, CdxTab, CdxIcon, CdxCheckbox, CdxField, CdxRadio },
	props: {
		modelValue: { type: Boolean, default: false }
	},
	emits: [ 'update:modelValue', 'close' ],
	setup() {
		const defaultItems = ref( [
			{
				href: 'https://example.com',
				label: 'Edit interwiki links'
			}
		] );
		const addLanguagesMenuItems = inject( 'addLanguagesMenuItems', [] );
		defaultItems.value = [ ...defaultItems.value, ...( addLanguagesMenuItems || [] ) ];

		const menuComponents = ref( [] );
		menuComponents.value = defaultItems.value.map( ( item ) => ( {
			component: AddLanguagesMenuItemDefault,
			props: {
				href: item.href,
				label: item.label
			}
		} ) );

		return {
			menuComponents,
			cdxIconArrowPrevious
		};
	}
} );
</script>

<style lang="less">
@import 'mediawiki.skin.variables.less';

.add-languages-menu {
	.add-languages-menu-wrapper-root {
		padding: @spacing-50;
		background-color: @background-color-base;
		border: @border-base;
	}
	&-header {
		display: flex;
		gap: @spacing-100;
		align-items: center;
		h3 {
			margin: @spacing-0;
			padding: @spacing-0;
		}
	}
}
</style>