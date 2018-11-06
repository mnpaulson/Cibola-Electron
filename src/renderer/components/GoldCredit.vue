<template>
    <div>
    <v-layout row wrap>
        <customer-form :id.sync="customer_id"></customer-form>
    </v-layout>
    <!-- <goldcredit-form :customer_id.sync="customer_id"></goldcredit-form> -->
    <goldcredit-form v-show="goldcredit_id !== null || customer_id !== null" :goldcredit_id.sync="goldcredit_id" :customer_id.sync="customer_id" v-on:customerId="setCustomerId"></goldcredit-form>
    <transition name="component-fade" appear>            
    <v-layout v-if="goldcredit_id == null && customer_id == null">    
        <v-flex row wrap xs12>
            <v-card>
                <v-card-title>
                    <v-card-title primary-title>
                        <h3 class="headline mb-0">Credits</h3>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" :href="'#/goldcredit/0/0'">
                            <v-icon>add</v-icon>
                            New Credit
                        </v-btn>
                    </v-card-title>
                    <v-spacer></v-spacer>
                </v-card-title>
                    <v-data-table v-bind:headers="creditHeaders" :items="credits" v-bind:pagination.sync="paginationCredit" class="elevation-1" :search="searchCredit" :total-items="totalCredits" :loading="loading">
                        <template slot="items" slot-scope="props">
                            <tr @click="goToCredit(props.item.id)">
                                <td class="text-xs-left">{{ props.item.id }}</td>
                                <!-- <td class="text-xs-right">${{ props.item.creditValue.toLocaleString() }}</td> -->
                                <td class="text-xs-left">{{ props.item.customer.fname }} {{ props.item.customer.lname }}</td>
                                <td class="text-xs-left" v-if="props.item.employee">{{ props.item.employee.name }}</td>
                                <td class="text-xs-left">{{ props.item.created_at }}</td>
                                <td class="text-xs-left"><span v-if="props.item.used">Yes</span><span v-else>No</span></td>
                            </tr>
                        </template>
                    </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
    </transition>
    </div>
</template>

<script>
    export default {
        data: () => ({
            customer_id: null,
            goldcredit_id: null,
            credits: [],
            totalCredits: null,
            loading: false,
            searchCredit: null,
            paginationCredit: {
                rowsPerPage: 25,
                sortBy: 'id',
                descending: true
            },
            creditHeaders: [{
                    text: 'ID',
                    value: 'id'
                },
                {
                    text: 'Name',
                    value: 'fname'
                },
                // {
                //     text: 'Value',
                //     value: 'creditValue'
                // },
                {
                    text: 'Employee',
                    value: 'employee'
                },
                {
                    text: 'Created',
                    value: 'created_at'
                },
                {
                    text: 'Used',
                    value: 'used'
                }
            ],
        }),
        methods: {
            setCustomerId(id) {
                this.customer_id = id;
            },
            goToCredit(id) {
                this.$router.push('/goldcredit/' + id);
            },
            getCreditsPaginated() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.paginationCredit

                    this.$http.post(this.store.serverURL +  '/goldcredit/allCreditsDetails', this.paginationCredit)
                        .then((response) => {
                            let credits = response.data.data;
                            const totalCredits = response.data.total;

                            this.loading = false
                            resolve({
                                credits,
                                totalCredits
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                        });    
                    
                })
            }
        },
        watch: {
            // Handle changing between customer view and no customer selected
            '$route' (to, from) {
                if (!to.params.id) this.goldcredit_id = null;
                else this.goldcredit_id = Number(to.params.id);
                if (isNaN(Number(to.params.id))) {
                    this.goldcredit_id = null
                    this.customer_id = null;
                }
                else if (Number(to.params.id) !== 0) this.goldcredit_id = Number(to.params.id);
                else this.customer_id = Number(to.params.cus);
            },
            paginationCredit: {
                handler () {
                    this.getCreditsPaginated()
                        .then(data => {
                        this.credits = data.credits
                        this.totalCredits = data.totalCredits
                    })
                    deep: true
                    }
            },
            
        },
        mounted() {
            //If credit ID 0 then no credit, used for linking with customer ID set
            //Only preset customer ID if credit is 0
            if (isNaN(Number(this.$route.params.id))); //Do Nothing
            else if (Number(this.$route.params.id) !== 0) this.goldcredit_id = Number(this.$route.params.id);
            else this.customer_id = Number(this.$route.params.cus);
            
        },
        computed: {
            store() {
                return this.$root.$data.store;
            }
        }  
    }
</script>