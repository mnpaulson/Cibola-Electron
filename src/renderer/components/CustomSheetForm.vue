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
                                    <v-flex xs6>
                                        <v-btn color="primary" @click="newEstVal(category)">
                                            <v-icon>add</v-icon>
                                            New {{category}}
                                        </v-btn>
                                    </v-flex>
                                    </v-layout>
                                    <template v-for="(est_val, est_index) in customSheet.selectedEstimate.est_values">
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
                                                        @change="estValOptionSelected(est_index)"
                                                    ></v-combobox>
                                                </v-flex>
                                                <v-flex xs6 md3>
                                                    <v-text-field
                                                        v-model="est_val.amt"
                                                        label="Weight(g)/Amount"
                                                        @input="calculateEstValTotal(est_index)"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md3>
                                                    <v-text-field
                                                        v-model="est_val.pricePer"
                                                        label="Price Per"
                                                        @input="calculateEstValTotal(est_index)"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md3>
                                                    <v-text-field
                                                        v-model="est_val.total"
                                                        disabled
                                                        label="Total"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-list-tile>
                                    </template>
                                </div>
                            </template>
                            </v-list>
                    </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex d-flex xs12 lg2>
                <v-btn color="primary" @click="saveEstimate">
                    <v-icon>add</v-icon>
                    Save Estimate
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <template v-for="(estimate, est_index) in customSheet.estimates">
                <v-flex d-flex xs12 lg3 xl3 v-bind:key="estimate.id">
                    <v-card class="cb-round-card ">
                        <v-card-title class="cb-card-title" ><div class="headline">{{estimate.name}}</div></v-card-title>
                        <template v-for="(est_val, val_index) in customSheet.estimates[est_index].est_values">
                            <v-list-tile v-bind:key="est_val.id">
                                {{est_val.name}} {{est_val.amt}} {{est_val.total}}
                            </v-list-tile>
                            <v-divider v-if="val_index + 1 < customSheet.estimates[est_index].est_values.length" :key="`divider-${val_index}`"></v-divider>
                        </template>
                    </v-card>
                </v-flex>
            </template>
        </v-layout>
        </div>
    </transition>
</template>

<script>

var estValIdCounter = 1;

class estValue {
    constructor (category, id = `clientId-${estValIdCounter++}`, name = "", amt = null, pricePer = null, total = null) {
        this.id = id
        this.type = category;
        this.name = name;
        this.amt = amt;
        this.pricePer = pricePer;
        this.total = total; 
        this.obj = {name: null};
    }
}

class estimate {
    constructor (estimate) {
        this.name = estimate.name;
        this.isPrimary = estimate.isPrimary;
        this.est_values = [];
        estimate.est_values.forEach(est => {
            this.est_values.push(
                new estValue(est.category, est.id, est.name, est.amt, est.pricePer, est.total)
            )
        })
    }
}

export default {
    data: () => ({
        goldCAD: null,
        platCAD: null,
        metalPriceDate: null,
        customSheet: {
            customSheet_id: null,
            customer_id: null,
            note: null,
            primary_est: null,
            selectedEstimate: {
                name: null,
                isPrimary: true,
                est_values: []
            },
            estimates: []
        },
        valueList: {},
        categories: [],
        catOptions: []

    }),
    methods: {
        //Gets the value of gold in grams
        getNewGoldValue() {
            this.$http.get(this.store.serverURL +  '/values/getGoldValue')
                .then((response) => {
                    // console.log(response);
                    var goldG = response.data[0];
                    this.goldCAD = this.round(goldG, 2);
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
                    // platG = platG * this.customSheet.exchange;
                    this.platCAD = this.round(platG, 2);
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
        calculateEstValTotal(index) {
            this.customSheet.selectedEstimate.est_values[index].total = this.customSheet.selectedEstimate.est_values[index].amt * this.customSheet.selectedEstimate.est_values[index].pricePer;
        },
        saveEstimate() {
            // this.customSheet.estimates.push(Object.assign({}, this.customSheet.selectedEstimate));
            this.customSheet.estimates.push(new estimate(this.customSheet.selectedEstimate));
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
        }
    },
};

</script>