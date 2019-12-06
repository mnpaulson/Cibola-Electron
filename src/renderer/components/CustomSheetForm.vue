<template>
    <transition name="component-fade" appear>
        <div>
        <v-layout row wrap>
            <customer-form :id.sync="customSheet.customer_id"></customer-form>
        </v-layout>  
        <!-- Metal Values -->
        <v-layout mt-3 row wrap>
            <v-flex d-flex xs12 lg6 xl3>
                    <v-card color="blue text--darken-10 white--text">
                        <v-card-text class="pa-2 text-lg-left">
                        <v-layout row wrap>
                            <v-flex v-if="editMetalPrices" row xs3>
                                <v-text-field
                                    v-model="goldCAD"
                                    label="Gold (g)"
                                ></v-text-field>
                            </v-flex>
                            <v-flex v-if="editMetalPrices" row xs3>
                                <v-text-field
                                    v-model="platCAD"
                                    label="Plat (g)"
                                ></v-text-field>
                            </v-flex>
                            <v-flex row xs6 v-if="!editMetalPrices" class="subheading pt-2 font-weight-bold pl-2">
                                Gold is ${{goldCAD}}g
                                <br/>
                                Platinum is ${{platCAD}}g</v-flex>
                            <v-flex row xs6 class="pt-1 text-lg-center">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="indigo"  v-on="on" :class="{'warning': priceAgeWarn, 'primary': !priceAgeWarn}" @click="getNewGoldValue"><v-icon medium>refresh</v-icon></v-btn>
                                    </template>
                                    <span>Prices last updated at {{metalPriceDate}}</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="green" v-on="on" @click="updateExistingMetalPrices"><v-icon color="white" medium>cached</v-icon></v-btn>
                                    </template>
                                    <span>Update the prices of all metal values for this custom sheet</span>
                                </v-tooltip>
                                <v-btn fab small color="grey" v-on="on" @click="editMetalPrices = !editMetalPrices"><v-icon color="white" medium>edit</v-icon></v-btn>
                            </v-flex>
                        </v-layout>
                        </v-card-text>
                    </v-card>
            </v-flex>
        </v-layout>
        <!-- Name and note -->
        <v-layout mt-3 row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                        <!-- <v-card-title> -->
                        <!-- </v-card-title> -->
                    <v-card>
                        <v-layout pr-4 pb-4 pl-4 row wrap>
                            <v-flex row xs12>
                                <v-text-field
                                    v-model="customSheet.name"
                                    label="Name"
                                    single-line
                                    placeholder="Custom Sheet Name"
                                ></v-text-field>
                            </v-flex>
                            <v-flex row xs12>
                                <v-textarea auto-grow rows=1 v-model="customSheet.note" class="" label="Custom Sheet Note"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card>
            </v-flex>
        </v-layout>
        <!-- Selected estimate -->
        <v-layout mt-3 row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                            <v-layout pr-4 pb-4 pl-4  row wrap>
                                <v-flex row xs12>
                                    <v-text-field
                                        v-model="customSheet.selectedEstimate.name"
                                        label="Name"
                                        single-line
                                        placeholder="Estimate Name"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex row xs12>
                                    <v-textarea auto-grow rows=1 v-model="customSheet.selectedEstimate.note" class="" label="Estimate Note"></v-textarea>
                                </v-flex>
                            </v-layout>
                            <v-list>
                            <template v-for="(category, cat_index) in categories">
                                <div v-bind:key="category">
                                    <v-layout pr-4 pl-2  row wrap>
                                    <v-flex xs2>
                                        <v-card-text class="title font-w">{{category}}</v-card-text>
                                    </v-flex>
                                    </v-layout>
                                    <template v-for="est_val in customSheet.selectedEstimate.estValues">
                                        <v-list-tile v-bind:key="est_val.id" v-if="est_val.type == category">
                                            <v-layout  pr-2 pl-2 row wrap>
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
                                    <v-layout pr-2 pb-3 pl-4  v-if="category != 'Extra'">
                                        <v-flex xs6>
                                            <v-btn class="text-none" round small outline color="primary" @click="newEstVal(category)">
                                                Add {{category}}
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </template>
                            <v-layout>
                            <v-flex pl-4 pb-3 >
                                <template v-for="(extra, index) in extras">
                                        <v-btn v-bind:key="index" color=primary class="text-none" round outline @click="addNewExtra(extra)">Add {{extra.name}}</v-btn>
                                </template>
                            </v-flex>
                            </v-layout>
                            <v-divider></v-divider>
                            <div class="title pt-3 pb-2 pr-4 text-xs-right">Total: ${{customSheet.selectedEstimate.total.toFixed(2)}}</div>
                        </v-list>

                    </v-card>
            </v-flex>
        </v-layout>
        <!-- Estimates -->
        <v-layout pt-3 row wrap>
            <v-flex shrink>
                <v-btn @click="newEstimate()" large color="primary" round class="cb-new-card-button cb-new-card-button-top elevation-0" ><v-icon class="cb-extra-large-icon">note_add</v-icon></v-btn>
                <br>
                <v-btn @click="copyEstimate()" large color="primary" round class="cb-new-card-button cb-new-card-button-bottom" ><v-icon class="cb-extra-large-icon">flip_to_front</v-icon></v-btn>
            </v-flex>
            <template v-for="(estimate, est_index) in customSheet.estimates">
                <v-flex shrink v-bind:key="estimate.id">
                    <v-card  
                        v-bind:class="{
                            'cb-selected-top': isSelectedEstimate(estimate.id), 
                            'cb-unselected-top': !isSelectedEstimate(estimate.id), 
                            'elevation-10': isSelectedEstimate(estimate.id)
                        }" 
                        class="cb-round-card cb-card-min pb-2" @click="editEstimate(est_index)">
                        <div v-show="isSelectedEstimate(estimate.id)" class="cb-selected-highlight"></div>
                        <v-card-title>
                            <div class="headline">{{estimate.name}}</div>
                        </v-card-title>
                        <template v-for="estVal in estimate.estValues">
                            <div class="grey--text text--darken-2 pr-3 pl-3 mb-1 " v-bind:key="estVal.id">
                                <p class=" mb-0 body-2 d-inline-flex">{{estVal.name}}</p>
                                <div class="cb-spacer d-inline-flex"></div>
                                <p class="mb-0 text-xs-right d-inline-flex cb-float-right">${{estVal.total.toFixed(2)}}</p>
                            <br>
                            </div>
                        </template>
                        <v-divider></v-divider>
                        <div class="text-xs-right font-weight-medium mt-1 subheading mr-3">${{estimate.total.toFixed(2)}}</div>
                        <!-- <v-divider></v-divider> -->
                        <v-checkbox
                            class="ml-3 d-inline-flex mt-2"
                            v-model="customSheet.primaryEst"
                            :value="estimate.id"
                            hide-details
                            label="Primary"
                        ></v-checkbox>
                        <v-btn class="close-btn d-inline-flex cb-float-right mt-3 mr-3" small flat icon color="grey" @click.stop="estimate.deleteModal = true"><v-icon dark>delete_outline</v-icon></v-btn>                    
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
        this.isSelected = false;
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

    get selectedEstimate() {
        for (let i = 0; i < this.estimates.length; i++) {
            if (this.estimates[i].isSelected) return this.estimates[i];
        }

        if (this.estimates.length > 0) {
            this.estimates[0].isSelected = true;
            return this.estimates[0];
        }
        //If estimates is empty, make an new one
        var est = new estimate();
        est.id = `clientId-${this.estimateIdCounter++}`;
        est.isSelected = true;
        est.name = "Estimate 1";
        est.isPrimary = true;
        this.estimates.push(est);
        return this.estimates[0];
    }

    setSelected(est_index) {
        this.estimates.forEach(e => {
            e.isSelected = false;
        })

        this.estimates[est_index].isSelected = true;
    }

    copy(customSheet) {
        this.customSheet_id = customSheet.customSheet_id;
        this.customer_id = customSheet.customer_id;
        this.name = customSheet.name;
        this.note = customSheet.note;
        this.estimatesToDelete = customSheet.estimatesToDelete;
        this.created_at = customSheet.created_at;
        this.updated_at = customSheet.updated_at;
        // this.selectedEstimate = new estimate(customSheet.selectedEstimate);
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
        editMetalPrices: false,
        estimateIdCounter: 0,
        customSheet: new customSheet,
        valueList: {},
        categories: [],
        catOptions: [],
        extras: [],
        on: null,
        loading: false,
        estPreviewHeaders: [
            {
                text: 'Type',
                align: 'left',
                sortable: false,
                value: 'name'
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
        copyEstimate() {
            //Set default name if there isn't one
            if(this.customSheet.selectedEstimate.name == null) this.customSheet.selectedEstimate.name = `Estimate ` + this.customSheet.estimates.length;
            
            //Make a copy of selectedEstimate
            let est = new estimate();
            est.copy(this.customSheet.selectedEstimate);
            
            //Set new Id
            est.id = `clientId-${this.estimateIdCounter++}`;
            est.name = `${est.name}-${this.customSheet.estimates.length+1}`
            
            //store estimate
            this.customSheet.estimates.push(est);
            this.customSheet.setSelected(this.customSheet.estimates.length - 1);
        },
        //Sets the selectedEstimate to the estimate located at the passed index
        editEstimate(est_index) {
            this.customSheet.setSelected(est_index);
        },
        //Updates a stored estimate to the selectedEstimate where Ids match
        newEstimate() {
            var est = new estimate();
            est.id = `clientId-${this.estimateIdCounter++}`;
            est.name = `Estimate ${this.customSheet.estimates.length + 1}`;
            this.customSheet.estimates.push(est);
            this.customSheet.setSelected(this.customSheet.estimates.length - 1);
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
            if (this.customSheet.name == null) {
                this.store.setAlert(true, "error", "Please set a name for this custom sheet");
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
            if (this.customSheet.name == null) {
                this.store.setAlert(true, "error", "Please set a name for this custom sheet");
                return;
            }
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
                if (e.isPrimary) e.isSelected = true;
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