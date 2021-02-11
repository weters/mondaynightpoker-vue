<template>
    <div class="my-tables big-content">
        <div>
            <h2>My Tables</h2>

            <p>
                <router-link to="/table/create">Create a Table</router-link>
            </p>

            <table-list/>
        </div>
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