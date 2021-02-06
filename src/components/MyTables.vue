<template>
    <div class="main-box my-tables">
        <h2>My Tables</h2>

        <p><a href="/table/create">Create a Table</a></p>

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