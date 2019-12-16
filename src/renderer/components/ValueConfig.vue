<template>
    <v-card class="mt-4">
        <v-layout row wrap>
            <v-flex pt-0 d-flex xs12>
                <v-tabs v-model="tab">
                    <v-tab class="text-none">Custom Sheet</v-tab>
                    <v-tab class="text-none">Gold Credit</v-tab>
                    <v-tab class="text-none">Metal Prices</v-tab>
                </v-tabs>
            </v-flex>
            <!-- Gold Credit -->
            <v-flex v-if="tab == 1" xs12 mt-2 mb-4 ml-4>
                <v-layout row>
                    <v-flex xs2 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Name</span>
                            </template>
                            <span>The name of the item as it will appear on credit</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs2 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Metal Price Multiplier</span>
                            </template>
                            <span>The value that will be multiplied with the metal price</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs1 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Markup</span>
                            </template>
                            <span>The value that will be multiplied with the items weight and metal prices</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs2 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Metal Type</span>
                            </template>
                            <span>Set to "Gold" or "Platinum" to determine which metal the price will be calculated off of</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs1 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Order</span>
                            </template>
                            <span>The order these options will appear on their drop down list</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
                <template v-for="(value, vId) in goldCredits">
                    <v-layout v-bind:key="vId" row>
                        <v-flex pt-1 pb-0 xs2><v-text-field class="mt-0 pt-0" v-model="value.name" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs2><v-text-field class="mt-0 pt-0" v-model="value.value1" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs1><v-text-field class="mt-0 pt-0" v-model="value.value2" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs2><v-text-field class="mt-0 pt-0" v-model="value.value3" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs1><v-text-field class="mt-0 pt-0" v-model="value.order" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs3>
                            <v-btn round v-if="value.active == 1" color="primary" small class="mb-0 mt-0 text-none" @click="value.active = 0">Active</v-btn>
                            <v-btn round v-if="value.active == 0" color="primary" outline small class="mb-0 mt-0 text-none" @click="value.active = 1">Inactive</v-btn>
                            <v-btn round color="success" small class="mb-0 mt-0 mr-0 ml-0 text-none" outline @click="saveValue(value)">
                                <v-icon v-if="value.saveStatus === null" color="green" class="mr-1">save</v-icon>
                                <v-icon v-if="value.saveStatus === 'saved'" color="green" class="mr-1">check</v-icon>
                                <v-progress-circular size=24 v-if="value.saveStatus == 'saving'" indeterminate class="mr-1"></v-progress-circular>
                                Save
                            </v-btn>
                            <v-btn flat icon color="grey" class="mb-0 mt-0 ml-0" @click="setDeleteModal(value)"><v-icon>delete_outline</v-icon></v-btn>
                        </v-flex>
                    </v-layout>
                </template>
                <v-btn class="mt-4 mb-0 pb-0 text-none" round outline color="primary" @click="newValue(1)">New Gold Credit Item</v-btn>
            </v-flex>
            <!-- Custom Sheet -->
            <v-flex v-if="tab == 0" xs12 mt-2 mb-4 ml-4>
                <v-layout row>
                    <v-flex xs2 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Name</span>
                            </template>
                            <span>The name of the item as it will appear on custom sheet</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs2 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Category</span>
                            </template>
                            <span>The category that the item will appear under (Use 'Extra' for button items)</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs1 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Base Price</span>
                            </template>
                            <span>The default value for this item (leave blank if using a metal price)</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs1 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Metal Type</span>
                            </template>
                            <span>Set to "Gold" or "Plat" to determine which metal the price will be calculated off of</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs1 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Formula</span>
                            </template>
                            <span>Type the name of the formula you wish to use to calculate pricing</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs1 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Order</span>
                            </template>
                            <span>Set the order you would like items to appear in. Categories will also appear in the order they first occur</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
                <template v-for="(value, vId) in customSheets">
                    <v-layout v-bind:key="vId" row>
                        <v-flex pt-1 pb-0 xs2><v-text-field class="mt-0 pt-0" v-model="value.name" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs2><v-text-field class="mt-0 pt-0" v-model="value.value1" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs1><v-text-field class="mt-0 pt-0" v-model="value.value2" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs1><v-text-field class="mt-0 pt-0" v-model="value.value3" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs1><v-text-field class="mt-0 pt-0" v-model="value.value4" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs1><v-text-field class="mt-0 pt-0" v-model="value.order" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs3>
                            <v-btn round v-if="value.active == 1" color="primary" small class="mb-0 mt-0 text-none" @click="value.active = 0">Active</v-btn>
                            <v-btn round v-if="value.active == 0" color="primary" outline small class="mb-0 mt-0 text-none" @click="value.active = 1">Inactive</v-btn>
                            <v-btn round color="success" small class="mb-0 mt-0 mr-0 ml-0 text-none" outline @click="saveValue(value)">
                                <v-icon v-if="value.saveStatus === null" color="green" class="mr-1">save</v-icon>
                                <v-icon v-if="value.saveStatus === 'saved'" color="green" class="mr-1">check</v-icon>
                                <v-progress-circular size=24 v-if="value.saveStatus == 'saving'" indeterminate class="mr-1"></v-progress-circular>
                                Save
                            </v-btn>
                            <v-btn flat icon color="grey" class="mb-0 mt-0 ml-0" @click="setDeleteModal(value)"><v-icon>delete_outline</v-icon></v-btn>
                        </v-flex>
                    </v-layout>
                </template>
                <v-btn class="mt-4 mb-0 pb-0 text-none" round outline color="primary" @click="newValue(3)">New Custom Sheet Item</v-btn>
            </v-flex>
            <!-- Metal Prices -->
            <v-flex v-if="tab == 2" xs12 mt-2 mb-4 ml-4>
                <v-layout row>
                    <v-flex xs2 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Name</span>
                            </template>
                            <span>These names can not be changed</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs2 title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">Metal Price</span>
                            </template>
                            <span>The values that will be used to calcuate prices for gold and plantinum items. Only set manually if automatic update is not working</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
                <template v-for="(value, vId) in metalPrices">
                    <v-layout v-bind:key="vId" row>
                        <v-flex pt-1 pb-0 xs2><v-text-field class="mt-0 pt-0" v-model="value.name" hide-details disabled></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs2><v-text-field class="mt-0 pt-0" v-model="value.value1" hide-details></v-text-field></v-flex>
                        <v-flex pt-1 pb-0 xs2>
                                <v-btn round color="success" small class="mb-0 mt-0 mr-0 ml-0 text-none" outline @click="saveValue(value)">
                                <v-icon v-if="value.saveStatus === null" color="green" class="mr-1">save</v-icon>
                                <v-icon v-if="value.saveStatus === 'saved'" color="green" class="mr-1">check</v-icon>
                                <v-progress-circular size=24 v-if="value.saveStatus == 'saving'" indeterminate class="mr-1"></v-progress-circular>
                                Save
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template>
            </v-flex>
        </v-layout>
        <deleteModal 
            :modal="valueDeleteModal.status" 
            :objectName="valueDeleteModal.value.name"
            objectType="Custom Value"
            final="true"
            v-on:close="clearDeleteModal"
            v-on:delete="deleteValue(valueDeleteModal.value)">
        </deleteModal>
    </v-card>
</template>

<script>

    class value {
        constructor(
            id = null,
            type_id = null,
            name = null,
            value1 = null,
            value2 = null,
            value3 = null,
            value4 = null,
            order = null,
            active = 1
        ){
            this.id = id;
            this.type_id = type_id;
            this.name = name;
            this.value1 = value1;
            this.value2 = value2;
            this.value3 = value3;
            this.value4 = value4;
            this.order = order;
            this.active = active;
            this.saveStatus = null;
        }

        get json() {
            return {
                id: this.id,
                type_id: this.type_id,
                name: this.name,
                value1: this.value1,
                value2: this.value2,
                value3: this.value3,
                value4: this.value4,
                order: this.order,
                active: this.active
            };
        }

        async saved() {
            this.saveStatus = 'saved';
            await this.sleep(3000);
            this.saveStatus = null;
        }

        saving() {
            this.saveStatus = 'saving';
        }

        async hideIcon() {
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve,ms));
        }
    };

  export default {
    data: () => ({
        tab: null,
        values: null,
        goldCredits: [],
        customSheets: [],
        metalPrices: [],
        on: null,
        valueDeleteModal: {
            status: false,
            value: {name: null},
            name: null
        }

    }),
    methods: {
        getValues() {
            this.$http.get(this.store.serverURL +  '/values/index')
                .then((response) => {
                    var newValue = null;
                    this.values = response.data;
                    this.goldCredits = [];
                    this.customSheets = [];
                    this.metalPrices = [];
                    this.values.forEach(v => {
                        newValue = new value(v.id, v.type_id, v.name, v.value1, v.value2, v.value3, v.value4, v.order, v.active);
                        switch(v.type_id) {
                            case 1:
                                this.goldCredits.push(newValue);
                                break;
                            case 2:
                                this.metalPrices.push(newValue)
                                break;
                            case 3:
                                this.customSheets.push(newValue);
                                break;
                            default:
                        }
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        newValue(typeId) {
            var newValue = new value();
            newValue.type_id = typeId;
            switch(typeId) {
                case 1:
                    this.goldCredits.push(newValue);
                    break;
                case 3:
                    this.customSheets.push(newValue);
                    break;
                default:
                    return;
            }
        },
        saveValue(value) {
            value.saving();
            if (value.id !== null) {
                this.$http.post(this.store.serverURL +  '/values/update', value.json)
                    .then((response) => {
                        value.saved();
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
            if (value.id == null) {
                this.$http.post(this.store.serverURL +  '/values/create', value.json)
                    .then((response) => {
                        this.currentValue = {};
                        this.getValues();
                    })
                    .catch((error) => {
                        console.log(error);
                    })            
            }
        },
        createNewValue() {
        },
        deleteValue(value) {
            this.$http.post(this.store.serverURL +  '/values/delete', value.json)
                .then((response) => {
                    this.getValues();
                    this.valueDeleteModal.status = false;
                })
                .catch((error) => {
                    console.log(error);
                })             
        },
        setDeleteModal(v) {
            this.valueDeleteModal.value = v;
            this.valueDeleteModal.status = true;    
        },
        clearDeleteModal() {
            this.valueDeleteModal.value = {name: null};
            this.valueDeleteModal.status = false;
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