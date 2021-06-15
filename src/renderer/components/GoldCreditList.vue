<template>
    <div>
        <v-flex row wrap xs12>
            <v-card>
                <v-card-text class="title font-w blue cb-white-text">
                    <v-icon color="white">credit_card</v-icon> Credits
                    <v-btn outline dark  :href="'#/goldcredit/0/0'">
                        New Credit
                    </v-btn>
                </v-card-text>
                    <v-data-table v-bind:headers="creditHeaders" :items="credits" v-bind:pagination.sync="paginationCredit" class="elevation-1" :search="searchCredit" :total-items="totalCredits" :loading="loading">
                        <template slot="items" slot-scope="props">
                            <tr @click="emitGoldCreditId(props.item.id)">
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
    </div>
</template>


<script>
    export default {
        data: () => ({
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
            },
            emitGoldCreditId(id) {
                this.$emit('select', id);
            }
        },
        props: [
            'customerId'
        ],
        watch: {
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
            
        },
        computed: {
            store() {
                return this.$root.$data.store;
            }
        }  
    }
</script>