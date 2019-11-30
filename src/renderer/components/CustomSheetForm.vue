<template>
    <transition name="component-fade" appear>
        <div>
        <v-layout row wrap>
            <customer-form :id.sync="customSheet.customer_id"></customer-form>
        </v-layout>  
        <!-- Metal Values -->
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
                                <v-btn @click="updateExistingMetalPrices"><v-icon>refresh</v-icon>Update Quotes&nbsp;</v-btn>
                            </v-flex>
                        </v-layout>
                        </v-card-text>
                    </v-card>
            </v-flex>
        </v-layout>
        <!-- Name and note -->
        <v-layout row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                        <v-card-title>
                            <div class="headline">Custom Sheet</div>
                        </v-card-title>
                        <v-card-text>
                        <v-layout row wrap>
                            <v-text-field
                                v-model="customSheet.name"
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
        <!-- Selected estimate -->
        <v-layout row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                        <v-card-title>
                            <div class="headline">Estimate</div>
                        </v-card-title>
                            <v-list>
                            <template v-for="(category, cat_index) in categories">
                                <div v-bind:key="category">
                                    <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-card-text><h3 class="font-weight-black mb-0">{{category}}</h3></v-card-text>
                                    </v-flex>
                                    </v-layout>
                                    <template v-for="est_val in customSheet.selectedEstimate.estValues">
                                        <v-list-tile v-bind:key="est_val.id" v-if="est_val.type == category">
                                            <v-layout row wrap>
                                                <v-flex xs6 md3 >
                                                    <v-combobox
                                                        label="Type"
                                                        cache-items
                                                        :items="catOptions[cat_index]"
                                                        :return-object=true
                                                        item-text="name"
                                                        v-model="est_val.obj"
                                                        :disabled="est_val.type == 'Extra'"
                                                    ></v-combobox>
                                                </v-flex>
                                                <v-flex xs6 md3 v-if="est_val.type != 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.amt"
                                                        label="Weight(g)/Amount"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md3 v-if="est_val.type != 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.pricePer"
                                                        label="Price Per"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md6 v-if="est_val.type == 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.pricePer"
                                                        label="Price"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md2>
                                                    <v-text-field
                                                        v-model="est_val.total"
                                                        disabled
                                                        label="Total"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md1 >
                                                    <v-btn flat icon color="grey" @click="deleteEstVal(est_val.id)">
                                                        <v-icon>delete_outline</v-icon>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-list-tile>
                                    </template>
                                    <v-layout v-if="category != 'Extra'">
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
                        <!-- <v-divider></v-divider> -->
                        <v-layout>
                            <template v-for="(extra, index) in extras">
                                <v-flex xs4 v-bind:key="index">
                                    <v-btn @click="addNewExtra(extra)"><v-icon>refresh</v-icon>{{extra.name}}</v-btn>
                                </v-flex>
                            </template>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex row xs12>
                                <v-text-field
                                    v-model="customSheet.selectedEstimate.name"
                                    label="Name"
                                ></v-text-field>
                            </v-flex>
                            <v-flex row xs12>
                                <v-textarea no-resize v-model="customSheet.selectedEstimate.note" class="" label="Custom Sheet Note"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card>
            </v-flex>
        </v-layout>
        <!-- estimate buttons -->
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
        <v-layout row wrap>
            <template v-for="(estimate, est_index) in customSheet.estimates">
                <v-flex d-flex xs12 lg4 xl3 v-bind:key="estimate.id">
                    <v-card class="cb-round-card" @click="editEstimate(est_index)">
                        <v-card-title
                        v-bind:class="{green: isSelectedEstimate(estimate.id)}"
                        >
                            <div class="headline">{{estimate.name}}</div>
                            <v-btn class="close-btn" dark small right absolute fab color="grey" @click.stop="estimate.deleteModal = true"><v-icon class="fab-fix" dark>delete_outline</v-icon></v-btn>                    
                        </v-card-title>
                        <v-data-table
                            :headers=estPreviewHeaders
                            :items=customSheet.estimates[est_index].estValues
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
                        <v-divider></v-divider>
                        <v-checkbox
                            v-model="customSheet.primaryEst"
                            :value="estimate.id"
                            label="Primary"
                        ></v-checkbox>
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
        <v-flex xs12></v-flex>        
        <v-bottom-nav
            fixed
            :value="true"
            :app="true"
            color="white"
            class="elevation-1"
        >
            <v-btn v-show="!customSheet.customSheet_id || customSheet.customSheet_id == 0" @click="createCustomSheet()" class="v-btn--active primary--text">
            <span>Save Custom Sheet</span>
            <v-icon>save</v-icon>
            </v-btn>
            <v-btn v-show="customSheet.customSheet_id && customSheet.customSheet_id !== 0" class="v-btn--active success--text" @click="updateCustomSheet()">
            <span>Update Custom Sheet</span>
            <v-icon>save</v-icon>
            </v-btn>
            <v-btn class="v-btn--active info--text" >
            <span>Print</span>
            <v-icon>print</v-icon>
            </v-btn>
            <!-- <v-btn v-show="job.id && job.id !== 0" @click="jobDeleteDialog = true" class="v-btn--active error--text">
            <span>Delete Job</span>
            <v-icon>delete</v-icon>
            </v-btn>
            <v-btn v-show="!job.id || job.id == 0" @click="$router.go(-1)" class="v-btn--active error--text">
            <span>Discard Job</span>
            <v-icon>delete</v-icon>
            </v-btn> -->
        </v-bottom-nav>
        </div>
    </transition>
</template>

<script>

var estValIdCounter = 1;

class estValue {
    constructor (category, id = `clientId-${estValIdCounter++}`, name = "", amt = null, pricePer = null, priceType = null) {
        this.id = id
        this.type = category;
        this.name = name;
        this.amt = amt;
        this.pricePer = pricePer;
        this.priceType = priceType;
    }

    //Sets estValue properties from an option value object
    //also works for custom value if only string is passed for name
    set obj(o) {
        if (o !== null & o.hasOwnProperty('name')) {
            this.name = o.name;
            this.pricePer = o.value2;
            this.type = o.value1;
            this.priceType = o.value3;
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
    
    get isClientId() {
        return (isNaN(Number(this.id)));  
    }
}

class estimate {
    constructor () {
        this.name = null;
        this.note = null;
        this.estValues = [];
        this.id = null;
        this.deleteModal = false;
        this.isPrimary = false;
        this.estValuesToDelete = [];
        this.created_at = null;
        this.updated_at = null;
    }

    copy(estimate) {
        this.name = estimate.name;
        this.note = estimate.note;
        this.isPrimary = estimate.isPrimary;
        this.estValues = [];
        this.estValuesToDelete = estimate.estValuesToDelete;
        this.id = estimate.id;
        estimate.estValues.forEach(v => {
            this.estValues.push(
                new estValue(v.type, v.id, v.name, v.amt, v.pricePer, v.priceType)
            )
        })
    }

    updateMetalPrices(gold, plat) {
        if(this.estValues.length > 0) {
            this.estValues.forEach(v => {
                if (v.priceType == 'Gold') v.pricePer = gold;
                if (v.priceType == 'Plat') v.pricePer = plat;
            })
        }
    }

    deleteEstVal(id) {
        this.estValues.forEach((v, index) => {
            if (v.id === id) {
                if (!v.isClientId) this.estValuesToDelete.push(id);
                this.estValues.splice(index, 1);
            }
        })
    }

    get isClientId() {
        return (isNaN(Number(this.id)));  
    }

    get total() {
        var total = 0;
        this.estValues.forEach(v => {
            total += v.total;
        })
        return total;
    }

}

class customSheet {
    constructor() {
        this.customSheet_id = null;
        this.customer_id = null;
        this.name = null;
        this.note = null;
        this.estimates = [];
        this.selectedEstimate = new estimate;
        this.estimatesToDelete = [];
        this.created_at = null;
        this.updated_at = null;
    }

    set primaryEst(val) {
        this.estimates.forEach(e => {
            if (e.id == val) {
                e.isPrimary = true;
            } else {
                e.isPrimary = false;
            }
        })
    }

    get primaryEst() {
        var id;
        this.estimates.forEach(e => {
            if (e.isPrimary) {
                id = e.id
            }
        }) 
        return id;
    }

    copy(customSheet) {
        this.customSheet_id = customSheet.customSheet_id;
        this.customer_id = customSheet.customer_id;
        this.name = customSheet.name;
        this.note = customSheet.note;
        this.estimatesToDelete = customSheet.estimatesToDelete;
        this.created_at = customSheet.created_at;
        this.updated_at = customSheet.updated_at;
        this.selectedEstimate = new estimate(customSheet.selectedEstimate);
        this.estimates = [];

        customSheet.estimates.forEach(e => {
            let est = new estimate();
            est.copy(e);
            this.estimates.push(est);
        })
    }

    cleanClientIds() {
        for(let i = 0; i < this.estimates.length; i++) {
            for(let j = 0; j < this.estimates[i].estValues.length; j++) {
                if(this.estimates[i].estValues[j].isClientId) this.estimates[i].estValues[j].id = null;
            }
            if(this.estimates[i].isClientId) this.estimates[i].id = null;
        }
    }

    deleteEstimate(id) {
        this.estimates.forEach((e, index) => {
            if (e.id === id) {
                if (!e.isClientId) this.estimatesToDelete.push(id);
                this.estimates.splice(index, 1);
            }
        })
    }

}

export default {
    data: () => ({
        goldCAD: null,
        platCAD: null,
        metalPriceDate: null,
        estimateIdCounter: 0,
        customSheet: new customSheet,
        valueList: {},
        categories: [],
        catOptions: [],
        extras: [],
        loading: false,
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
        //Gets the value of gold
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
        //Gets the value of platinum
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
        //Gets est val options and metal prices
        getValues() {
                this.$http.get(this.store.serverURL +  '/values/gettype?type_id=3')
                    .then((response) => {
                        this.valueList = response.data;
                        this.valueList.forEach(value => {
                                if (!this.categories.includes(value.value1)) {
                                    this.categories.push(value.value1);
                                    this.catOptions.push([]);
                                }
                                if (value.value3 === 'Gold') value.value2 = this.goldCAD;
                                if (value.value3 === 'Plat') value.value2 = this.platCAD;
                                this.catOptions[this.categories.indexOf(value.value1)].push(value);
                                if (value.value1 == "Extra") this.extras.push(value);
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
        //Adds a new est_val for the passed category
        newEstVal(category) {
            this.customSheet.selectedEstimate.estValues.push(new estValue(category));
        },
        //Adds new est val of extra type
        addNewExtra(extra){
            let e = new estValue();
            e.obj = extra;
            e.amt = 1;
            this.customSheet.selectedEstimate.estValues.push(e);
        },
        //Makes a copy of the selectedEstimate into estimates and sets Ids
        storeEstimate() {
            //Set default name if there isn't one
            if(this.customSheet.selectedEstimate.name == null) this.customSheet.selectedEstimate.name = `Estimate ` + this.customSheet.estimates.length;
            
            //Make a copy of selectedEstimate
            let est = new estimate();
            est.copy(this.customSheet.selectedEstimate);
            
            //Set new Id
            est.id = `clientId-${this.estimateIdCounter++}`;
            // this.customSheet.selectedEstimate.id = est.id;
            
            //store estimate
            this.customSheet.estimates.push(est);
            this.customSheet.selectedEstimate = est;
        },
        //Sets the selectedEstimate to the estimate located at the passed index
        editEstimate(est_index) {
            this.customSheet.selectedEstimate = this.customSheet.estimates[est_index];
            // let est = new estimate();
            // est.copy(this.customSheet.estimates[est_index]);
            // this.customSheet.selectedEstimate = est;
        },
        //Updates a stored estimate to the selectedEstimate where Ids match
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
        //Deletes est_val with the passed id from the selectedEstimate
        deleteEstVal(id) {
            this.customSheet.selectedEstimate.deleteEstVal(id);
            
        },
        //Deletes estimate with the passed id
        deleteEstimate(id) {
            this.customSheet.deleteEstimate(id);
        },
        //Returns true if selectedEstimate has the passed id
        isSelectedEstimate(id) {
            return (id === this.customSheet.selectedEstimate.id);
        },
        //Updates all existing plat or gold value based est_vals with new values
        updateExistingMetalPrices() {
            this.customSheet.selectedEstimate.updateMetalPrices(this.goldCAD, this.platCAD);
            if (this.customSheet.estimates.length > 0) {
                this.customSheet.estimates.forEach(e => {
                    e.updateMetalPrices(this.goldCAD, this.platCAD);
                })
            }
        },
        //Saves Custom Sheet to DB
        createCustomSheet() {
            // this.$refs.jobForm.validate();
            if (!this.customSheet.customer_id) {
                this.store.setAlert(true, "error", "Please select a customer.");
                return;
            }
            // if (!this.valid) {
            //     this.store.setAlert(true, "error", "Please fix required fields");
            //     return;
            // }
            this.loading = true;
            let upload = new customSheet();
            upload.copy(this.customSheet);
            upload.cleanClientIds();
            this.$http.post(this.store.serverURL +  '/customsheet/create', upload)
                .then((response) => {
                    console.log(response);
                    this.customSheet = this.newCustomSheetFromResponse(response.data);
                    this.store.setAlert(true, "success", "Custom Sheet Created with ID: " + this.customSheet.customSheet_id);
                    this.loading = false;
                    // // this.$router.replace("/job/" + this.job.id);
                })
                .catch((error) => {
                    // console.table(error);
                    this.loading = false;
                    this.store.setAlert(true, "error", error.message);                                                                    
                });
        },
        updateCustomSheet() {
            // this.$refs.jobForm.validate();
            if (!this.customSheet.customer_id) {
                this.store.setAlert(true, "error", "Please select a customer.");
                return;
            }
            // if (!this.valid) {
            //     this.store.setAlert(true, "error", "Please fix required fields");
            //     return;
            // }
            this.loading = true;
            let upload = new customSheet();
            upload.copy(this.customSheet);
            upload.cleanClientIds();
            this.$http.post(this.store.serverURL +  '/customsheet/update', upload)
                .then((response) => {
                    console.log(response);
                    this.customSheet = this.newCustomSheetFromResponse(response.data);
                    this.store.setAlert(true, "success", "Custom Sheet Updated with ID: " + this.customSheet.customSheet_id);
                    this.loading = false;
                    // // this.$router.replace("/job/" + this.job.id);
                })
                .catch((error) => {
                    console.table(error);
                    this.loading = false;
                    this.store.setAlert(true, "error", error.message);                                                                    
                });
        },
        //Gets Custom Sheet from DB
        getCustomSheet(id) {
            this.loading = true;
                this.$http.post(this.store.serverURL +  '/customsheet/show', {id: id})
                    .then((response) => {
                        console.log(response);
                        this.customSheet = this.newCustomSheetFromResponse(response.data);
                        this.loading = false;
                    })
                    .catch((error) => {
                        this.store.setAlert(true, "error", "Custom Sheet ID " + id + " not found.");
                        this.loading = false;
                        console.log(error);
                    });
        },
        //Creates new custom sheet from DB response data
        newCustomSheetFromResponse(c) {
            var cs = new customSheet();

            cs.customSheet_id = c.id;
            cs.name = c.name;
            cs.note = c.note;
            cs.primary_est = c.primary_est;
            cs.customer_id = c.customer_id;
            cs.created_at = c.created_at;
            cs.updated_at = c.updated_at;
            c.estimates_with_values.forEach(e => {
                cs.estimates.push(this.newEstimateFromResponse(e));
            })

            cs.estimates.forEach(e => {
                if (e.isPrimary) cs.selectedEstimate = e;
            })

            return cs;
        },
        //Creates new estimate from DB response data
        newEstimateFromResponse(e) {
            var est = new estimate();
            est.name = e.name;
            est.note = e.note;
            est.id = e.id;
            est.isPrimary = e.isPrimary;
            est.created_at = e.created_at;
            est.updated_at = e.updated_at;

            // est.estValues = [];
            for (let i = 0; i < e.est_values.length; i++) {
                est.estValues.push(this.newEstValueFromResponse(e.est_values[i]));
            }
            return est;
        },
        //Creates new EstValue from DB response data
        newEstValueFromResponse(v) {
            var val = new estValue(v.type, v.id, v.name, v.amt, v.pricePer, v.priceType);
            return val;
        }
    },

    props: {
        customSheet_id: Number,
        customer_id: Number
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
        customSheet_id(val) {
            var id = this.customSheet_id;
            console.log(id);
            if (!isNaN(id) && id !== null && id !== 0 && this.customSheet.customSheet_id !== val) {
                this.getCustomSheet(val);
            }
        },
        customer_id(val) {
            if (this.customSheet.customer_id == null) this.customSheet.customer_id = val;
        },
        goldCAD(val) {
            if (this.valueList.length > 0) {
                this.valueList.forEach(value => {
                    if (value.value3 === 'Gold') value.value2 = this.goldCAD;
                })
            }
        },
        platCAD(val) {
            if (this.valueList.length > 0) {
                this.valueList.forEach(value => {
                    if (value.value3 === 'Plat') value.value2 = this.platCAD;
                })
            }
        },
    },
};

</script>