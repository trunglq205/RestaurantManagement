<template>
  <Field :name="name" :rules="rules" v-slot="{ field }">
    <div class="inputCss">
      <input
      :type="type"
      :width="width"
      :height="height"
      :placeholder="placeholder"
      :disabled="disable"
      v-bind="field"
      :class="[
        `rounded-lg bg-[#2D303E] px-2 py-3 text-white outline-none`,
        { 'w-full': width === 1000 }, {'input-icon': icon}
      ]"
      v-model="inputVal"
    />
    <div v-if="icon" class="material-icons-outlined icon-input">{{ icon }}</div>
    </div>
  </Field>
  <ErrorMessage class="text-red-500 text-xs" :name="name" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Field, ErrorMessage } from "vee-validate";
export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 1000,
    },
    height: Number,
    type: {
      type: String,
      default: "text",
    },
    placeholder:{
      type: String
    },
    name: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    rules: {
      type: [String, Object],
    },
    icon:{
      type: String
    },
    disable:{
      type: [Boolean, String]
    }
  },
  components: {
    Field,
    ErrorMessage,
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    const inputVal = computed({
      get() {
        return props.modelValue;
      },
      set(newValue) {
        ctx.emit("update:modelValue", newValue);
      },
    });
    return { inputVal };
  },
});
</script>

<style lang="scss" scoped>
.inputCss{
  position: relative;
}
.icon-input{
  position: absolute;
  top: 12px;
  left: 12px;
}
.input-icon{
  padding-left: 40px;
}
</style>
