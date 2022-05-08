<template>
  <div
    v-if="showModal"
    id="modalTemplate"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modalTemplateTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">Header</slot>
          <slot name="header-btn"></slot>
        </div>
        <div class="modal-body">
          <slot name="body">Body></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer-left"></slot>
          <slot name="footer-right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal-template",
  props: {
    showModal: Boolean,
  },
};
</script>

<style scoped>
#modalTemplate {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.modal-content {
  position: relative;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background-clip: padding-box;
  border-radius: 0.3 rem;
  padding: 1rem;
}
</style>
