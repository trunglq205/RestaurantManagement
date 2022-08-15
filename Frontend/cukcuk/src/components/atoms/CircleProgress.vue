<template>
  <div class="loader" :style="styles"></div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 20,
    },
    height: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      styles: {
        width: this.width + "px",
        height: this.height + "px",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.loader {
  width: 20px;
  height: 20px;
  font-size: 3px;
  position: relative;
  border-top: 1.1em solid #e0f2f1;
  border-right: 1.1em solid #e0f2f1;
  border-bottom: 1.1em solid #e0f2f1;
  border-left: 1.1em solid $primary-color;
  border-radius: 50%;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
  &::after {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
