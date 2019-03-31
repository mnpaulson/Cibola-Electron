<template>
<div>
<v-layout row wrap>
    <customer-form :id.sync="id"></customer-form>
</v-layout>
<v-layout row wrap>
    <job-lookup ></job-lookup>
</v-layout>
<v-layout>
<v-flex d-flex class="xs6 sm2">
    <v-btn color="primary" :href="'#/job/0/0'">
        <v-icon>work</v-icon>
        New Job
    </v-btn>
</v-flex>
<v-flex d-flex class="xs6 sm2">
    <v-btn color="primary" :href="'#/goldcredit/0/0'">
        <v-icon>credit_card</v-icon>
        New Gold Credit
    </v-btn>
</v-flex>
</v-layout>
<v-layout row wrap class="">
    <!-- <employee-stats></employee-stats>   -->
    <!-- <customer-list></customer-list> -->
    <job-list></job-list>
    <stats></stats>
    <!-- <employee-jobs></employee-jobs> -->
</v-layout>
</div>
</template>

<script>
    export default {
        data: () => ({
            id: null
        }),
        methods: {
            getOutstandingJobs() {
            this.$http
                .get(this.store.serverURL + "/employees/outstandingJobs")
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
            },
        },
        mounted() {
            // this.getOutstandingJobs();
        },
        watch: {
            id(val) {
                // if(this.id == null) this.$router.replace("/customer");            
                if(!isNaN(this.id)) this.$router.push("/customer/" + this.id);
            }
        },
        computed: {
            store() {
                return this.$root.$data.store;
            }
        }   
    
    }
</script>