<template>
	<a class="add-languages-menu-item add-languages-menu-item--default" :href="href">
		{{ label }}
	</a>
</template>

<script>
const { defineComponent } = require( 'vue' );

// @vue/component
module.exports = defineComponent( {
	props: {
		href: { type: String, required: true },
		label: { type: String, required: true }
	},
	emits: [ 'update:modelValue', 'apply', 'cancel', 'visible', 'close' ],
	setup() {}
} );
</script>

<style lang="less">
@import 'mediawiki.skin.variables.less';
.add-languages-menu-item {
	&&--default {
		display: block;
		padding-block: @spacing-50;
		padding-inline: @spacing-25;
	}
}
</style>