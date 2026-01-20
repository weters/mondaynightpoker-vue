<template>
    <div class="my-tables big-content">
        <div>
            <div class="page-header">
                <div class="header-content">
                    <h2>My Tables</h2>
                    <p class="subtitle">Manage your poker tables and track your performance</p>
                </div>
                <router-link to="/table/create" class="button create-button">
                    <span class="plus-icon">+</span> Create a Table
                </router-link>
            </div>

            <table-list/>
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
@import '../variables.scss';

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: $spacing;
    margin-bottom: $spacing;
    border-bottom: 1px solid $border-color;

    @media (max-width: $mobile-max) {
        flex-direction: column;
        gap: $spacing;
    }

    .header-content {
        h2 {
            margin: 0 0 $spacing-small 0;
            color: $text-color;
        }

        .subtitle {
            margin: 0;
            color: $text-color-light;
            font-size: 0.95em;
        }
    }

    .create-button {
        box-shadow: $shadow-md;
        transition: transform $transition-fast, box-shadow $transition-fast;
        display: inline-flex;
        align-items: center;
        gap: $spacing-small;

        .plus-icon {
            font-size: 1.2em;
            font-weight: bold;
        }

        &:hover {
            transform: translateY(-2px);
            box-shadow: $shadow-hover;
        }
    }
}
</style>