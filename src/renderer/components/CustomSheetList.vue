<template>
    <div>
        <v-flex d-flex xs12 md12 lg8 xl6  class="mt-2">
            <v-card class="">
                <v-card-title>
                    <v-card-title primary-title>
                        <h3 class="headline mb-0">Custom Sheets</h3>
                    </v-card-title>
                </v-card-title>
                    <v-data-table v-bind:headers="customSheetHeaders" :items="customSheets" v-bind:pagination.sync="pagination" class="elevation-1" :loading="loading">
                        <template slot="items" slot-scope="props">
                            <tr @click="emitCustomSheetId(props.item.id)">
                                <td class="text-xs-center">{{ props.item.id }}</td>
                                <td class="text-xs-center">{{ props.item.customer.fname }} {{ props.item.customer.lname }}</td>
                                <td class="text-xs-center">{{ props.item.name }}</td>
                                <td class="text-xs-left hidden-sm-and-down">{{ props.item.created_at }}</td>                              
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
        customSheetHeaders: [
            {
                text: 'ID',
                value: 'id'
            },
            {
                text: 'Customer',
                value: 'customer'
            },
            {
                text: 'Name',
                value: 'name'
            },
            {
                text: 'Date',
                value: 'created_at'
            }
        ],
        pagination: {
            sortBy: 'created_at',
            descending: true,
            rowsPerPage: 10
        },
        loading: true,
        totalCustomSheets: 0,
        customSheets: []
    }),
    methods: {
        getCustomerCustomSheets() {
            this.loading = true;
            this.$http.post(this.store.serverURL +  '/customsheet/customerCustomSheets', {id: this.id})
                .then((response) => {
                    this.customSheets = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.table(error);
                    this.loading = false;                        
                });     
        },
        getCustomSheetsPaginated() {
            this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination

                    // let jobs = new Promise(this.getAllJobs());
                    this.$http.post(this.store.serverURL +  '/customsheet/allCustomSheetDetails', this.pagination)
                        .then((response) => {
                            let customSheets = response.data;
                            const totalCustomSheets = response.data.total;

                            this.loading = false
                            resolve({
                                customSheets,
                                totalCustomSheets
                            })
                        })
                        .catch((error) => {
                            console.table(error);
                        });    
                    
                })
        },
        emitCustomSheetId(id) {
            this.$emit('select', id);
        }
    },
    props: [
        'customerId'
    ],
    mounted() {
        // if (!isNaN(Number(this.customerId))) {
        //     getCustomerCustomSheets();
        // }
    },
    computed: {
        store() {
            return this.$root.$data.store;
        }

    },
    watch: {
        pagination: {
            handler () {
                this.getCustomSheetsPaginated()
                    .then(data => {
                        this.customSheets = data.customSheets.data;
                        this.totalCustomSheets = data.totalCustomSheets;
                    })
                deep: true
                }
        },
    }
};
</script>