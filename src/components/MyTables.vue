<template>
  <div class="my-tables big-content">
    <div>
      <div class="page-header">
        <div class="header-content">
          <h2>My Tables</h2>
          <p class="subtitle">
            Manage your poker tables and track your performance
          </p>
        </div>
        <router-link
          to="/table/create"
          class="button create-button"
        >
          <span class="plus-icon">+</span> Create a Table
        </router-link>
      </div>

      <table-list />
    </div>
  </div>
</template>

<script>
import TableList from "@/components/TableList.vue"

export default {
    name: "MyTables",
    title: 'My Tables',
    components: {TableList},
}
</script>

<style lang="scss" scoped>
.page-header {
    display:        flex;
    justify-content: space-between;
    align-items:    flex-start;
    gap:            $space-5;
    padding-bottom: $space-5;
    margin-bottom:  $space-5;
    border-bottom:  1px solid $hairline;

    @media (max-width: $bp-phone) {
        flex-direction: column;
        gap:            $space-4;
    }

    .header-content {
        h2 {
            margin: 0 0 $space-1 0;
            color:  $ink;
        }

        .subtitle {
            margin:    0;
            color:     $ink-muted;
            font-size: $fs-sm;
        }
    }

    .create-button {
        flex-shrink: 0;
        box-shadow:  $shadow-md;
        transition:  transform $dur-fast $ease-standard, box-shadow $dur-fast $ease-standard;

        .plus-icon {
            font-size:   $fs-md;
            font-weight: $fw-bold;
            line-height: 1;
        }

        &:hover {
            transform:  translateY(-2px);
            box-shadow: $shadow-hover;
        }

        @media (prefers-reduced-motion: reduce) {
            transition: box-shadow $dur-fast linear;
            &:hover { transform: none; }
        }

        @media (max-width: $bp-phone) {
            width: 100%;
        }
    }
}
</style>