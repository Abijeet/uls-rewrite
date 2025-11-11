import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import LanguageSelector from "../src/components/LanguageSelector.vue";

const mountComponent = (props = {}) => {
  return mount(LanguageSelector, {
    props,
    slots: {
      default: `<template #default="props"></template>`,
    },
  });
};

describe("LanguageSelector", () => {
  test("initializes with no selected language", () => {
    const wrapper = mountComponent();
    expect(wrapper.vm.selected).toBe(null);
  });

  test("can select a language", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.selectLanguage("es");
    expect(wrapper.vm.selected).toBe("es");
  });

  test("opens and closes", async () => {
    const wrapper = mountComponent();
    expect(wrapper.vm.isOpen).toBe(false);
    await wrapper.vm.toggle();
    expect(wrapper.vm.isOpen).toBe(true);
    await wrapper.vm.close();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  test("searches for a language", async () => {
    const wrapper = mountComponent({
      value: ["en", "es", "fr"],
    });
    wrapper.vm.searchQuery = "es";
    await wrapper.vm.$nextTick();
    // The search is async, so we need to wait for the results
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(wrapper.vm.searchResults).toEqual(["es"]);
  });
});
