<template>
  <div
    class="alert alert-danger fade show"
    id="modalAlert"
    v-if="showAlert"
    role="alert"
  >
    <slot name="msgBody"></slot>
  </div>
</template>

<script>
export default {
  name: "modal-alert",
  props: {
    showAlert: Boolean,
  },
};
</script>

<style scoped>
.modal-active {
  display: block;
}
</style>
