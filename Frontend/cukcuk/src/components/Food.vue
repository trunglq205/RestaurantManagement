<template>
  <div className="mt-4">
    <div
      class="bg-dark-3 rounded-2xl w-[12rem] h-[14rem] text-sm text-center cursor-pointer item text-white"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
      <div className="flex-center translate-y-[-2rem]">
        <img
          :src="url_image"
          className="rounded-full w-[7.5rem] h-[7.5rem] object-cover"
          alt=""
        />
      </div>
      <p className="mx-6">{{ name }}</p>
      <p className="mt-2 mb-1">{{ formatMoney(price.toString()) }} VNĐ</p>
      <button :class="isHover ? 'btnAdd' : 'hidden'" @click="addOrderToStore">
        <span className="material-icons-outlined">add</span>
        Add To Order
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { formatMoney } from "@/utils/formatMoney";
import { useOrderStore } from "@/store/order";
export default defineComponent({
  props: {
    name: String,
    price: Number,
    id: String,
    url_image: String,
  },
  data() {
    return {
      isHover: false,
    };
  },
  methods: {
    formatMoney,
    addOrderToStore() {
      const orderStore = useOrderStore();
      const { addOrder } = orderStore;
      addOrder(
        {
          menuName: this.name,
          price: this.price,
          menuId: this.id,
          image: this.url_image,
        },
        1
      );
      this.$emit("openModal");
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.item {
  position: relative;
  &::before {
    position: absolute;
    content: "";
    background-color: black;
    opacity: 0;
    visibility: visible;
    width: 12rem;
    height: 16.8125rem;
    top: -3rem;
    right: 28px;
    border-radius: 2rem;
    transition: 0.2s ease-in;
    visibility: hidden;
    z-index: 3;
  }
  &:hover {
    &::before {
      opacity: 0.7;
      visibility: visible;
    }
  }
}
.btnAdd {
  position: relative;
  z-index: 10;
  background: $primary-color;
  height: 3rem;
  width: 150px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-8rem) translateX(-0.5rem);
  opacity: 1;
  visibility: visible;
  animation: animate 0.6s linear;
}
@keyframes animate {
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
}
</style>
