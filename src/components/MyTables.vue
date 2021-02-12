<template>
    <div class="my-tables big-content">
        <div>
            <h2>My Tables</h2>

            <p>
                <router-link to="/table/create" class="button">Create a Table</router-link>
            </p>

            <table-list/>
        </div>
    </div>
</template>

<script>
import TableList from "@/components/TableList"

export default {
    name: "MyTables",
    title: 'My Tables',
    components: {TableList},
}
</script>

<style lang="scss" scoped>

</style>