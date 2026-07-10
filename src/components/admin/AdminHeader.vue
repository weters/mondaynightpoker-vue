<template>
  <div class="admin-header">
    <h2>Admin</h2>

    <ul class="admin-menu">
      <li>
        <router-link to="/admin">
          Admin
        </router-link>
      </li>
      <li>
        <router-link to="/admin/players">
          Players
        </router-link>
      </li>
      <li>
        <router-link to="/admin/tables">
          Tables
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    name: "AdminHeader",
}
</script>

<style lang="scss" scoped>
.admin-header {
    margin-bottom: $space-5;

    h2 {
        margin-bottom: $space-3;
    }
}

.admin-menu {
    display:       flex;
    flex-wrap:     wrap;
    gap:           $space-1;
    margin:        0;
    padding:       0;
    list-style:    none;
    border-bottom: 1px solid $hairline;

    li {
        display: flex;
    }

    a {
        display:         inline-flex;
        align-items:     center;
        @include tap-target;
        padding:         0 $space-3;
        color:           $ink-muted;
        font-weight:     $fw-semibold;
        font-size:       $fs-sm;
        text-decoration: none;
        border-bottom:   2px solid transparent;
        margin-bottom:   -1px;
        transition:      color $dur-fast $ease-standard, border-color $dur-fast $ease-standard;

        &:hover {
            color: $ink;
        }

        &:focus-visible {
            @include focus-ring;
        }

        &.router-link-exact-active {
            color:        $accent;
            border-color: $accent;
        }

        @media (prefers-reduced-motion: reduce) {
            transition: color $dur-fast linear, border-color $dur-fast linear;
        }
    }
}
</style>