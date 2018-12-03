<template>
    <v-flex xs12 sm8>
        <v-card>
            <v-toolbar color="indigo" dark clipped-left flat>
                <v-toolbar-title>List Values</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <!-- <template v-for="(value, index) in values">
                    <v-list-tile :key="value.id">
                        <v-list-tile-content>
                            <v-list-tile-title><b>List:</b> {{ value.type_id }} <b>Name:</b> {{value.name}} <b>Value 1:</b> {{value.value1}} <b>Value 2:</b> {{value.value2}} <b>Value 3:</b> {{value.value3}}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-list-tile-action-text>
                                <v-btn small color="secondary" @click="setCurrentValue(value.id)">Edit</v-btn>
                                <v-btn v-show="!value.active" small color="primary" @click="toggleActive(true, value.id)">Activate</v-btn>
                                <v-btn v-show="value.active" small color="grey" @click="toggleActive(false, value.id)">Deactivate</v-btn>
                                <v-btn small color="error" @click="toggleDeleteDialog(value.id)">Delete</v-btn>
                            </v-list-tile-action-text>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index + 1 < value.length" :key="value.name"></v-divider>
                </template> -->
                <div v-show="currentValue.id != null">
                    <v-text-field label="Value Type" v-model="currentValue.type_id" xs12></v-text-field>
                    <v-text-field label="Name" v-model="currentValue.name" xs12></v-text-field>
                    <v-text-field label="Value 1" v-model="currentValue.value1" xs12></v-text-field>
                    <v-text-field label="Value 2" v-model="currentValue.value2" xs12></v-text-field>
                    <v-text-field label="Value 3" v-model="currentValue.value3" xs12></v-text-field>
                    <v-btn small color="primary" @click="updateValue()">Update</v-btn>
                    <v-btn small color="" @click="cancel()">Cancel</v-btn>
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
            // id: null,
            // type_id: null,
            // name: null,
            // value1: null,
            // value2: null,
            // value3: null
        }
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
        toggleValueActive(status, id) {

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
                    console.log(response);
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