<template>
    <v-flex xs12 sm8>
        <v-card>
            <v-toolbar color="indigo" dark clipped-left flat>
                <v-toolbar-title>List Values</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <div v-show="currentValue.id != null">
                    <v-text-field label="Value Type" v-model="currentValue.type_id" xs12></v-text-field>
                    <v-text-field label="Name" v-model="currentValue.name" xs12></v-text-field>
                    <v-text-field label="Value 1" v-model="currentValue.value1" xs12></v-text-field>
                    <v-text-field label="Value 2" v-model="currentValue.value2" xs12></v-text-field>
                    <v-text-field label="Value 3" v-model="currentValue.value3" xs12></v-text-field>
                    <v-checkbox
                    :label="'Active'"
                    v-model="currentValue.active"
                    ></v-checkbox>
                    <v-btn v-show="currentValue.id != -1" small color="primary" @click="updateValue()">Update</v-btn>
                    <v-btn v-show="currentValue.id == -1" small color="primary" @click="createNewValue()">Create</v-btn>
                    <v-btn small color="" @click="cancel()">Cancel</v-btn>
                    <v-btn v-show="currentValue.id != -1" small color="error" @click="deleteDialog = true">Delete</v-btn>
                </div>
                <div v-show="currentValue.id == null">
                    <v-btn small color="primary" @click="enterNewValue()">New</v-btn>
                </div>
                <v-data-table
                :headers="headers"
                :items="values"
                class="elevation-1"
                v-bind:pagination.sync="paginationValues"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.type_id }}</td>
                        <td class="text-xs-left">{{ props.item.name }}</td>
                        <td class="text-xs-left">{{ props.item.value1 }}</td>
                        <td class="text-xs-left">{{ props.item.value2 }}</td>
                        <td class="text-xs-left">{{ props.item.value3 }}</td>
                        <td class="justify-center layout px-0">
                        <v-icon
                            medium
                            @click="editValue(props.item)"
                        >
                            edit
                        </v-icon>
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-toolbar color="error" dark clipped-left flat>
                    <v-toolbar-title>
                        <v-icon>warning</v-icon>Delete Value</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    WARNING DO NOT DO THIS IF YOU ARE NOT 100% SURE WHAT YOU'RE DOING
                    <br>Are you sure you want to delete this value entry?
                    <br> This might break anything that is currently using this value.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" @click.stop="deleteValue()">
                        <v-icon>delete</v-icon>
                        Delete
                    </v-btn>
                    <v-btn color="primary" right absolute @click.stop="deleteDialog = false">
                        <v-icon>cancel</v-icon>
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
    
</template>

<script>

  export default {
    data: () => ({
        values: [],
        headers: [
            {text: "Value Type", value: 'type_id'},
            {text: "Name", value: 'Name'},
            {text: "Value 1", value: 'value1'},
            {text: "Value 2", value: 'value2'},
            {text: "Value 3", value: 'value3'}
        ],
        paginationValues: {
            sortBy: 'type_id',
            descending: false,
            rowsPerPage: -1
        },
        currentValue: {

        },
        deleteDialog: false
    }),
    methods: {
        getValues() {
            this.$http.get(this.store.serverURL +  '/values/index')
                .then((response) => {
                    this.values = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        editValue(value) {
            this.currentValue = value;
        },
        cancel() {
            this.currentValue = {};
        },
        updateValue() {
            this.$http.post(this.store.serverURL +  '/values/update', this.currentValue)
                .then((response) => {
                    this.currentValue = {};
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        enterNewValue() {
            this.currentValue = {id: -1};
        },
        createNewValue() {
            this.$http.post(this.store.serverURL +  '/values/create', this.currentValue)
                .then((response) => {
                    this.currentValue = {};
                    this.getValues();
                })
                .catch((error) => {
                    console.log(error);
                })            
        },
        deleteValue() {
            this.$http.post(this.store.serverURL +  '/values/delete', this.currentValue)
                .then((response) => {
                    this.deleteDialog = false;
                    this.currentValue = {};
                    this.getValues();
                })
                .catch((error) => {
                    console.log(error);
                })             
        }

    },
    mounted() {
        this.getValues();
    },
    watch: {

    },
    computed: {
        store() {
            return this.$root.$data.store;
        }
    }   
  }
</script>