<template>
    <transition name="component-fade" appear>
        <div>
        <v-layout row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                        <v-card-text>
                        <v-layout row wrap>
                            <v-flex row xs3>
                                <v-text-field
                                    v-model="goldCAD"
                                    label="Gold (g)"
                                ></v-text-field>
                            </v-flex>
                            <v-flex row xs3>
                                <v-text-field
                                    v-model="platCAD"
                                    label="Plat (g)"
                                ></v-text-field>
                            </v-flex>
                            <v-flex row xs6>
                                <v-btn :class="{'warning': priceAgeWarn, 'primary': !priceAgeWarn}" @click="getNewGoldValue"><v-icon>refresh</v-icon>Update&nbsp;</v-btn>
                                <p :class="{'vital-date': priceAgeWarn}" style="display: inline-block;">Prices set: {{metalPriceDate}}</p>
                            </v-flex>
                        </v-layout>
                        </v-card-text>
                    </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                        <v-card-text>
                        <v-layout row wrap>
                            <v-text-field
                                v-model="customSheet.selectedEstimate.name"
                                label="Name"
                            ></v-text-field>
                            <v-flex row xs12>
                                <v-textarea no-resize v-model="customSheet.note" class="" label="Custom Sheet Note"></v-textarea>
                            </v-flex>
                        </v-layout>
                        </v-card-text>
                    </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                            <v-list>
                            <template v-for="(category, cat_index) in categories">
                                <div v-bind:key="category">
                                    <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-card-text><h3 class="headline mb-0">{{category}}</h3></v-card-text>
                                    </v-flex>
                                    </v-layout>
                                    <template v-for="est_val in customSheet.selectedEstimate.est_values">
                                        <v-list-tile v-bind:key="est_val.id" v-if="est_val.type == category">
                                            <v-layout row wrap>
                                                <v-flex xs6 md3>
                                                    <v-combobox
                                                        label="Type"
                                                        cache-items
                                                        :items="catOptions[cat_index]"
                                                        :return-object=true
                                                        item-text="name"
                                                        v-model="est_val.obj"
                                                    ></v-combobox>
                                                </v-flex>
                                                <v-flex xs6 md3>
                                                    <v-text-field
                                                        v-model="est_val.amt"
                                                        label="Weight(g)/Amount"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md3>
                                                    <v-text-field
                                                        v-model="est_val.pricePer"
                                                        label="Price Per"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md2>
                                                    <v-text-field
                                                        v-model="est_val.total"
                                                        disabled
                                                        label="Total"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md1>
                                                    <v-btn flat icon color="grey" @click="deleteEstVal(est_val.id)">
                                                        <v-icon>delete_outline</v-icon>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-list-tile>
                                    </template>
                                    <v-layout>
                                        <v-flex xs6>
                                            <v-btn color="primary" @click="newEstVal(category)">
                                                <v-icon>add</v-icon>
                                                {{category}}
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </template>
                            <v-divider></v-divider>
                            <h1 class="text-xs-right mr-3">Total: ${{customSheet.selectedEstimate.total.toLocaleString()}}</h1>
                      </v-list>
                    </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex d-flex xs12 lg2>
                <v-btn color="primary" @click="storeEstimate">
                    <v-icon>add</v-icon>
                    Store Estimate
                </v-btn>
            </v-flex>
            <v-flex d-flex xs12 lg2>
                <v-btn v-if="isUpdate" color="primary" @click="updateEstimate">
                    <v-icon>add</v-icon>
                    Update Estimate
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout orw wrap>
            <template v-for="(estimate, est_index) in customSheet.estimates">
                <v-flex d-flex xs12 lg4 xl3 v-bind:key="estimate.id">
                    <v-card class="cb-round-card" @click="editEstimate(est_index)">
                        <v-card-title class="cb-card-title" 
                        v-bind:class="{green: isSelectedEstimate(estimate.id), grey: !isSelectedEstimate(estimate.id)}"
                        >
                            <div class="headline">{{estimate.name}}</div>
                            <v-btn class="close-btn" dark small right absolute fab color="grey" @click.stop="estimate.deleteModal = true"><v-icon class="fab-fix" dark>delete_outline</v-icon></v-btn>                    
                        </v-card-title>
                        <v-data-table
                            :headers=estPreviewHeaders
                            :items=customSheet.estimates[est_index].est_values
                            hide-actions
                        >
                            <template v-slot:items="props">
                                <td>{{props.item.name}}</td>
                                <td>{{props.item.amt}}</td>
                                <td class="text-xs-right">${{props.item.total.toLocaleString()}}</td>
                            </template>
                        </v-data-table>
                        <v-divider></v-divider>
                        <h2 class="text-xs-right mr-3">${{estimate.total.toLocaleString()}}</h2>
                    </v-card>
                    <deleteModal 
                    :modal="estimate.deleteModal" 
                    :objectName="estimate.name"
                    objectType="Estimate"
                    v-on:close="estimate.deleteModal = false"
                    v-on:delete="deleteEstimate(estimate.id)"></deleteModal>
                </v-flex>
            </template>
        </v-layout>
        </div>
    </transition>
</template>

<script>

var estValIdCounter = 1;

class estValue {
    constructor (category, id = `clientId-${estValIdCounter++}`, name = "", amt = null, pricePer = null) {
        this.id = id
        this.type = category;
        this.name = name;
        this.amt = amt;
        this.pricePer = pricePer;
    }

    //Sets estValue properties from an option value object
    //also works for custom value if only string is passed for name
    set obj(o) {
        if (o.hasOwnProperty('name')) {
            this.name = o.name;
            this.pricePer = o.value2;
            this.type = o.value1;
            if (o.value3 === 'Gold'|| o.value3 === 'Plat') this.pricePer = o.metalPrice;
        } else {
            this.name = o;
        }
    }

    get obj() {
        return this.name;
    }

    get total() {
        if (isNaN(this.amt) || isNaN(this.pricePer)) return 0;
        return this.amt * this.pricePer;
    }
}

class estimate {
    constructor () {
        this.name = null;
        this.isPrimary = false;
        this.est_values = [];
        this.id = null;
        this.deleteModal = false;
    }

    copy(estimate) {
        this.name = estimate.name;
        this.isPrimary = estimate.isPrimary;
        this.est_values = [];
        this.id = estimate.id;
        estimate.est_values.forEach(v => {
            this.est_values.push(
                new estValue(v.type, v.id, v.name, v.amt, v.pricePer)
            )
        })
    }

    deleteEstVal(id) {
        this.est_values.forEach((v, index) => {
            if (v.id === id) {
                this.est_values.splice(index, 1);
            }
        })
    }

    get total() {
        var total = 0;
        this.est_values.forEach(v => {
            total += v.total;
        })
        return total;
    }

}

export default {
    data: () => ({
        goldCAD: null,
        platCAD: null,
        metalPriceDate: null,
        estimateIdCounter: 0,
        customSheet: {
            customSheet_id: null,
            customer_id: null,
            note: null,
            primary_est: null,
            selectedEstimate: new estimate,
            estimates: []
        },
        valueList: {},
        categories: [],
        catOptions: [],
        estPreviewHeaders: [
            {
                text: 'Type',
                align: 'left',
                sortable: false,
                value: 'name'
            },
            {
                text: 'Weight(g)/Amount',
                align: 'left',
                sortable: false,
                value: 'amt'
            },
            {
                text: 'Total',
                align: 'right',
                sortable: false,
                value: 'total'
            },
        ]

    }),
    methods: {
        //Gets the value of gold in grams
        getNewGoldValue() {
            this.$http.get(this.store.serverURL +  '/values/getGoldValue')
                .then((response) => {
                    var goldG = response.data[0];
                    window.goldCAD = this.round(goldG, 2);
                    this.getNewPlatValue();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getNewPlatValue() {
            this.$http.get(this.store.serverURL +  '/values/getPlatValue')
                .then((response) => {
                    var platG = response.data;
                    window.platCAD = this.round(platG, 2);
                    this.metalPriceDate = this.today + " " + this.now;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        //Round number to desired decimals
        round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        },
        getValues() {
                this.$http.get(this.store.serverURL +  '/values/gettype?type_id=3')
                    .then((response) => {
                        this.valueList = response.data;
                        this.valueList.forEach(value => {
                            if (!this.categories.includes(value.value1)) {
                                this.categories.push(value.value1);
                                this.catOptions.push([]);
                            }
                            if (value.value3 === 'Gold') value.metalPrice = this.goldCAD;
                            if (value.value3 === 'Plat') value.metalPrice = this.platCAD;
                            let index = this.categories.indexOf(value.value1);
                            this.catOptions[this.categories.indexOf(value.value1)].push(value);
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this.$http.get(this.store.serverURL +  '/values/gettype?type_id=2')
                    .then((response) => {
                        response.data.forEach(function(v){
                            if (v.name === 'GoldCAD') {
                                this.goldCAD = this.round(v.value1, 2);
                                this.metalPriceDate = v.updated_at;
                            } else if (v.name === 'PlatCAD') {
                                this.platCAD = this.round(v.value1, 2);
                            }
                        }.bind(this));
                        this.goldCAD
                    })
                    .catch((error) => {
                        console.log(error);
                    });
        },
        newEstVal(category) {
            this.customSheet.selectedEstimate.est_values.push(new estValue(category));
        },
        estValOptionSelected(index) {

            if (this.customSheet.selectedEstimate.est_values[index].obj.hasOwnProperty('name')) {
                this.customSheet.selectedEstimate.est_values[index].name = this.customSheet.selectedEstimate.est_values[index].obj.name;
                this.customSheet.selectedEstimate.est_values[index].pricePer = this.customSheet.selectedEstimate.est_values[index].obj.value2;
                if (this.customSheet.selectedEstimate.est_values[index].obj.value3 === 'Gold') this.customSheet.selectedEstimate.est_values[index].pricePer = this.goldCAD;
                if (this.customSheet.selectedEstimate.est_values[index].obj.value3 === 'Plat') this.customSheet.selectedEstimate.est_values[index].pricePer = this.platCAD;
            } else {
                this.customSheet.selectedEstimate.est_values[index].name = this.customSheet.selectedEstimate.est_values[index].obj
            }
            
        },
        storeEstimate() {
            //Set default name if there isn't one
            if(this.customSheet.selectedEstimate.name == null) this.customSheet.selectedEstimate.name = `Estimate`;
            
            //Make a copy of selectedEstimate
            let est = new estimate();
            est.copy(this.customSheet.selectedEstimate);
            
            //Set new Id
            est.id = `clientId-${this.estimateIdCounter++}`;
            this.customSheet.selectedEstimate.id = est.id;
            
            //store estimate
            this.customSheet.estimates.push(est);
        },
        editEstimate(est_index) {
            let est = new estimate();
            est.copy(this.customSheet.estimates[est_index]);
            this.customSheet.selectedEstimate = est;
        },
        updateEstimate() {
            var update = new estimate();
            update.copy(this.customSheet.selectedEstimate);
            this.customSheet.estimates.forEach((est, index, arr) => {
                if (est.id == update.id) {
                    arr[index] = update;
                }
            })
            this.$forceUpdate();
        },
        deleteEstVal(id) {
            this.customSheet.selectedEstimate.deleteEstVal(id);
        },
        deleteEstimate(id) {
            this.customSheet.estimates.forEach((e, index) => {
                if (id === e.id) this.customSheet.estimates.splice(index, 1);
            })
        },
        isSelectedEstimate(id) {
            return (id === this.customSheet.selectedEstimate.id) ? true : false;
        }
    },

    props: {
        customer_id: Number,
        customSheet_id: Number
    },
    mounted() {
        this.getValues();
    },
    computed: {
        store() {
            return this.$root.$data.store;
            // this.$emit('customerId', this.job.customer_id);
        },
        priceAgeWarn() {
            var age = new Date - Date.parse(this.metalPriceDate);
            if (age > 8640000) return true;
            else return false;
        },
        today() {
                // Date = new Date();
                var today = new Date();
                var yyyy = today.getFullYear();
                var mm = (1+today.getMonth());
                var dd = today.getDate();

                if (mm < 10 ) {
                    mm = "0" + mm;
                }
                if (dd < 10 ) {
                    dd = "0" + dd;
                }

                return yyyy + "-" + mm + "-" + dd;
        },
        now() {
            var now = new Date()
            return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        },
        isUpdate() {
            if (this.customSheet.selectedEstimate.id !== null) return true;
            else return false;
        }
    },
    watch: {
        customer_id(val) {
            if (!isNaN(this.customer_id) && this.customer_id !== null) {
                this.customSheet.customer_id = val;
            }
        },
        customSheet_id(val) {
            if (!isNaN(this.customSheet_id) && this.customSheet_id !== null) {
                this.customSheet.customSheet_id = val;
            }
        },
        goldCAD(val) {
            if (this.valueList.length > 0) {
                this.valueList.forEach(value => {
                    if (value.value3 === 'Gold') value.metalPrice = this.goldCAD;
                })
            }
        },
        platCAD(val) {
            if (this.valueList.length > 0) {
                this.valueList.forEach(value => {
                    if (value.value3 === 'Plat') value.metalPrice = this.platCAD;
                })
            }
        },
    },
};

</script>