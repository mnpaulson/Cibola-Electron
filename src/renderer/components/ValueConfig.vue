<template>
    <v-flex xs12 sm12>
        <v-card>

        <v-tabs centered color="blue" dark>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab href="#tab-1"  @click="setGoldCreditHeaders()">
                Gold Credit
            </v-tab>

            <v-tab href="#tab-2" @click="setCustomSheetHeaders()">
                Custom Sheet Items
            </v-tab>

            <v-tab href="#tab-3" @click="setCategoryHeaders()">
                Custom Sheet Categories
            </v-tab>

            <v-tab href="#tab-4" @click="setMetalPriceHeaders()">
                Metal Prices
            </v-tab>

            <v-tab-item v-for="i in 3" :key="i" :value="'tab-' + i">
                <v-card flat>
                    <v-card-text>
                <div v-show="currentValue.id != null">
                    <!-- <v-text-field label="Value Type" v-model="currentValue.type_id" xs12></v-text-field> -->
                    <v-text-field label="Name" v-model="currentValue.name" xs12></v-text-field>
                    <v-text-field v-if="showValue1" :label="headers[1].text" v-model="currentValue.value1" xs12></v-text-field>
                    <v-select
                        v-if="currentValueType == 3"
                        :items="categoryList"
                        label="Category"
                        v-model="currentValue.value1"
                    ></v-select>
                    <v-text-field v-if="showValue2" :label="headers[2].text" v-model="currentValue.value2" xs12></v-text-field>
                    <v-text-field v-if="showValue3" :label="headers[3].text" v-model="currentValue.value3" xs12></v-text-field>
                    <v-text-field v-if="showDiscount" label="Discount" v-model="currentValue.discount" xs12></v-text-field>
                    <v-text-field v-if="showMarkup" label="Markup" v-model="currentValue.markup" xs12></v-text-field>
                    <v-text-field v-if="showDefault" label="Default Quantity" v-model="currentValue.default" xs12></v-text-field>
                    <v-text-field v-if="showOrder" label="Order" v-model="currentValue.order" xs12></v-text-field>
                    <v-checkbox
                    :label="'Active'"
                    v-model="currentValue.active"
                    ></v-checkbox>
                    <v-btn outline v-show="currentValue.id != -1" small color="primary" @click="updateValue()">Update</v-btn>
                    <v-btn outline v-show="currentValue.id == -1" small color="primary" @click="createNewValue()">Create</v-btn>
                    <v-btn outline small color="" @click="cancel()">Cancel</v-btn>
                    <v-btn outline v-show="currentValue.id != -1" small color="error" @click="deleteDialog = true">Delete</v-btn>
                </div>
                <div v-show="currentValue.id == null">
                    <v-btn outline small color="primary" @click="enterNewValue()">New</v-btn>
                </div>
                <v-data-table
                :headers="headers"
                :items="values"
                class="elevation-1"
                v-bind:pagination.sync="paginationValues"
                >
                    <template v-if="props.item.type_id == currentValueType" slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.name }}</td>
                        <td v-if="showValue1 || currentValueType == 3" class="text-xs-left">{{ props.item.value1 }}</td>
                        <td v-if="showValue2" class="text-xs-left">{{ props.item.value2 }}</td>
                        <td v-if="showValue3" class="text-xs-left">{{ props.item.value3 }}</td>
                        <td v-if="showDiscount" class="text-xs-left">{{ props.item.discount }}</td>
                        <td v-if="showMarkup" class="text-xs-left">{{ props.item.markup }}</td>
                        <td v-if="showDefault" class="text-xs-left">{{ props.item.default }}</td>
                        <td v-if="showOrder" class="text-xs-left">{{ props.item.order }}</td>
                        <td class="justify-center layout px-0">
                        <v-icon
                            medium
                            @click="editValue(props.item)"
                        >
                            edit
                        </v-icon>
                        <v-icon
                            medium
                            v-if="showOrder"
                            @click="orderChange(props.item, -1)"
                        >
                            arrow_drop_up
                        </v-icon>
                        <v-icon
                            medium
                            v-if="showOrder"
                            @click="orderChange(props.item, 1)"
                        >
                            arrow_drop_down
                        </v-icon>
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
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
        </v-card>
    </v-flex>
    
</template>

<script>

  export default {
    data: () => ({
        values: [],
        categoryList: [],
        currentValueType: 1,
        headers: [
            {text: "Name", value: 'Name'},
            {text: "Value 1", value: 'value1'},
            {text: "Value 2", value: 'value2'},
            {text: "Value 3", value: 'value3'},
            {text: "", value: ''}
        ],
        goldCreditHeaders: [
            {text: "Name", value: 'Name'},
            {text: "Base Modifier", value: 'value1'},
            {text: "Markup", value: 'value2'},
            {text: "Metal Type", value: 'value3'},
            {text: "", value: ''}
        ],
        customSheetHeaders: [
            {text: "Name", value: 'Name'},
            {text: "Category", value: 'value1'},
            {text: "Default Value", value: 'value2'},
            {text: "Metal Type", value: 'value3'},
            {text: "Discount Percent", value: 'discount'},
            {text: "Markup", value: 'markup'},
            {text: "Default Quantity", value: 'default'},
            {text: "", value: ''}
        ],
        metalPriceHeaders: [
            {text: "Name", value: 'Name'},
            {text: "Price (CAD)", value: 'value1'},
            {text: "", value: ''}
        ],
        categoryHeaders: [
            {text: "Name", value: 'Name'},
            {text: "Order", value: 'order'},
            {text: "", value: ''}
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
                    this.updateCategories();
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
                    this.updateCategories();
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
            this.currentValue.type_id = this.currentValueType;
            console.log(this.currentValue);
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
        },
        setCustomSheetHeaders() {
            this.headers = this.customSheetHeaders;
            this.currentValue = {}
            this.currentValueType = 3;
            this.paginationValues.sortBy = 'value1';
        },
        setGoldCreditHeaders() {
            this.headers = this.goldCreditHeaders;
            this.currentValue = {}
            this.currentValueType = 1;
            this.paginationValues.sortBy = 'Name';
        },
        setCategoryHeaders() {
            this.headers = this.categoryHeaders;
            this.currentValue = {}
            this.currentValueType = 4;
            this.paginationValues.sortBy = 'order';
        },
        setMetalPriceHeaders() {
            this.headers = this.metalPriceHeaders;
            this.currentValue = {}
            this.currentValueType = 2;
            this.paginationValues.sortBy = 'Name';
        },
        updateCategories() {
            this.categoryList = [];
            this.values.forEach(v => {
                if (v.type_id == 4) this.categoryList.push(v.name);
            })
        },
        orderChange(value, direction) {
            value.order = Number(value.order) + Number(direction);
            this.updateValue(value);
            this.values.forEach(v => {
                if (v.type_id == 4) {
                    if (v.id !== value.id)  {
                        if (v.order == value.order)  {
                            v.order = Number(v.order) - Number(direction);
                            this.updateValue(v);
                        }
                    }
                }
            });
        },
        updateValue(value) {
            this.$http.post(this.store.serverURL +  '/values/update', value)
            .then((response) => {
                // this.updateCategories();
                // this.currentValue = {};
            })
            .catch((error) => {
                console.log(error);
            })
        },
    },
    mounted() {
        this.getValues();
        this.headers = this.goldCreditHeaders;
    },
    watch: {

    },
    computed: {
        store() {
            return this.$root.$data.store;
        },
        showValue1() {
            switch (this.currentValueType) {
                case 1:
                    return true;
                case 2:
                    return true;
                case 3:
                    return false;
                case 4:
                    return false;
                default:
                    return false;
            }
        },
        showValue2() {
            switch (this.currentValueType) {
                case 1:
                    return true;
                case 2:
                    return true;
                case 3:
                    return true;
                case 4:
                    return false;
                default:
                    return false;
            }
        },
        showValue3() {
            switch (this.currentValueType) {
                case 1:
                    return true;
                case 2:
                    return false;
                case 3:
                    return true;
                case 4:
                    return false;
                default:
                    return false;
            }
        },
        showDiscount() {
            switch (this.currentValueType) {
                case 1:
                    return false;
                case 2:
                    return false;
                case 3:
                    return true;
                case 4:
                    return false;
                default:
                    return false;
            }
        },
        showMarkup() {
            switch (this.currentValueType) {
                case 1:
                    return false;
                case 2:
                    return false;
                case 3:
                    return true;
                case 4:
                    return false;
                default:
                    return false;
            }
        },
        showDefault() {
            switch (this.currentValueType) {
                case 1:
                    return false;
                case 2:
                    return false;
                case 3:
                    return true;
                case 4:
                    return false;
                default:
                    return false;
            }
        },
        showOrder() {
            switch (this.currentValueType) {
                case 1:
                    return false;
                case 2:
                    return false;
                case 3:
                    return false;
                case 4:
                    return true;
                default:
                    return false;
            }
        },
    }   
  }
</script>