<template>
    <div class="main-box my-tables">
        <h2>My Tables</h2>

        <p><router-link to="/table/create">Create a Table</router-link></p>

        <table-list />
    </div>
</template>

<script>
import TableList from "@/components/TableList"
export default {
    name: "MyTables",
    components: {TableList},
}
</script>

<style lang="scss" scoped>

</style>