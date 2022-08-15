<template>
  <label class="m-checkbox">
    <input  type="checkbox" :checked="model" v-model="model" />
    <span>
      <slot />
    </span>
  </label>
</template>
<script>
export default {
  props: {
    modelValue:{
        type: String
    },
    inputValue: {
        type: String
    }
  },
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set() {
        console.log(!this.modelValue);
        this.$emit("update:modelValue", !this.modelValue);
      },
    },
  },
};
</script>
<style scoped src="../../assets/checkbox.css"></style>
