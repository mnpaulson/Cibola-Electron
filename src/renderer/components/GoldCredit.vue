<template>
    <div>
    <v-layout row wrap>
        <customer-form :id.sync="customer_id"></customer-form>
    </v-layout>
    <!-- <goldcredit-form :customer_id.sync="customer_id"></goldcredit-form> -->
    <goldcredit-form v-show="goldcredit_id !== null || customer_id !== null" :goldcredit_id.sync="goldcredit_id" :customer_id.sync="customer_id" v-on:customerId="setCustomerId"></goldcredit-form>
    </div>
</template>

<script>
    export default {
        data: () => ({
            customer_id: null,
            goldcredit_id: null
        }),
        methods: {
            setCustomerId(id) {
                this.customer_id = id;
            }
        },
        watch: {
            // Handle changing between customer view and no customer selected
            '$route' (to, from) {
                // if (!to.params.id) this.job_id = null;
                // else this.job_id = Number(to.params.id);
                if (isNaN(Number(to.params.id))) {
                    this.job_id = null
                    this.customer_id = null;
                }
                else if (Number(to.params.id) !== 0) this.job_id = Number(to.params.id);
                else this.customer_id = Number(to.params.cus);
            },
            // paginationJob: {
            //     handler () {
            //         this.getJobsPaginated()
            //             .then(data => {
            //             this.jobs = data.jobs
            //             this.totalJobs = data.totalJobs
            //         })
            //         deep: true
            //         }
            // },
            
        },
        mounted() {
            //If credit ID 0 then no credit, used for linking with customer ID set
            //Only preset customer ID if credit is 0
            if (isNaN(Number(this.$route.params.id))); //Do Nothing
            else if (Number(this.$route.params.id) !== 0) this.goldcredit_id = Number(this.$route.params.id);
            else this.customer_id = Number(this.$route.params.cus);
            
        },
    }
</script>