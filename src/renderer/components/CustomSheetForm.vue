<template>
    <transition name="component-fade" appear>
        <div>
        <v-layout row wrap>
            <customer-form :id.sync="customSheet.customer_id"></customer-form>
        </v-layout>  
        
        <!-- Name and note -->
        <v-layout mt-3 row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                        <v-card-text class="title font-w blue cb-white-text">Custom Sheet Details - Created: {{customSheet.created_at}}</v-card-text>
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
        <!-- Estimates -->
        <v-layout row wrap>
            <template v-for="(estimate, est_index) in customSheet.estimates">
                <v-flex d-flex xs12 lg3 xl2 v-bind:key="estimate.id">
                    <v-card class="cb-round-card" @click="editEstimate(est_index)">
                        <v-card-title class="cb-small-estimate-title"
                        v-bind:class="{blue: isSelectedEstimate(estimate.id)}"
                        >
                                <v-text-field
                                    v-model="estimate.name"
                                    label="Name"
                                    v-bind:dark="isSelectedEstimate(estimate.id)"
                                ></v-text-field>
                            <v-btn class="close-btn" color="grey" small right absolute outline fab @click.stop="estimate.deleteModal = true"><v-icon class="fab-fix" dark>delete_outline</v-icon></v-btn>                    
                        </v-card-title>
                        <v-data-table
                            :headers=estPreviewHeaders
                            :items=customSheet.estimates[est_index].estValues
                            hide-actions
                        >
                            <template v-slot:items="props">
                                <td class="cb-small-td">{{props.item.name}}</td>
                                <td class="cb-small-td">{{props.item.amt}}</td>
                                <td class="text-xs-right cb-small-td">${{props.item.total.toLocaleString()}}</td>
                            </template>
                        </v-data-table>
                        <v-divider></v-divider>
                        <h3 class="text-xs-right mr-4">${{estimate.total.toLocaleString()}}</h3>
                        <v-flex row xs12>
                            <v-textarea auto-grow rows=1 no-resize v-model="estimate.note" class="" label="Estimate Note"></v-textarea>
                        </v-flex>
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
        <!-- estimate buttons -->
        <v-layout row wrap>
            <v-flex d-flex xs12 lg2>
                <v-btn outline color="primary" @click="copyEstimate">
                    Copy Estimate
                </v-btn>

            </v-flex>
            <v-flex d-flex xs12 lg2>
                <v-btn outline color="primary" @click="newEstimate">
                    New Estimate
                </v-btn>
            </v-flex>
        </v-layout>
        <!-- Selected estimate -->
        <v-layout mt-3 row wrap>
            <v-flex d-flex xs12 lg6 xl6>
                    <v-card>
                           <!-- <h3 class="cb-white-text blue pl-3">Estimate Details</h3> -->
                           <v-card-text class="title font-w blue cb-white-text">Estimate Details</v-card-text>
                            <v-list>
                            <template v-for="(category, cat_index) in categories">
                                <div v-bind:key="category">
                                    <v-layout pr-4 pl-2  row wrap>
                                    <v-flex xs2>
                                        <v-card-text class="title font-w">{{category}}</v-card-text>
                                        
                                    </v-flex>
                                    <v-flex v-if="category != 'Extra'" xs2>
                                        <v-btn class="text-none cb-small-btn" round small outline color="primary" @click="newEstVal(category)">
                                            New
                                        </v-btn>
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
                                                <v-flex xs6 md2 v-if="est_val.type != 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.amt"
                                                        label="Weight(g)/Amount"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md2 v-if="est_val.type != 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.pricePer"
                                                        label="Price Per"
                                                        :disabled="est_val.disabled"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md1 v-if="est_val.type != 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.markup"
                                                        label="Markup"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md1 v-if="est_val.type != 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.discount"
                                                        label="Discount"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6 md6 v-if="est_val.type == 'Extra'">
                                                    <v-text-field
                                                        v-model="est_val.basePrice"
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
                                    dark
                                ></v-text-field>
                            </v-flex>
                            <v-flex v-if="editMetalPrices" row xs3>
                                <v-text-field
                                    v-model="platCAD"
                                    label="Plat (g)"
                                    dark
                                ></v-text-field>
                            </v-flex>
                            <v-flex row xs6 v-if="!editMetalPrices" class="subheading pt-2 font-weight-bold pl-2">
                                Gold is ${{goldCAD}}/g
                                <br/>
                                Plat is ${{platCAD}}/g</v-flex>
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
                                    <span>Update the prices of the selected estimates metal values</span>
                                </v-tooltip>
                                <v-btn fab small color="grey" v-on="on" @click="editMetalPrices = !editMetalPrices"><v-icon color="white" medium>edit</v-icon></v-btn>
                            </v-flex>
                        </v-layout>
                        </v-card-text>
                    </v-card>
            </v-flex>
        </v-layout>
        <v-flex xs12></v-flex> 
        <deleteModal 
        :modal="deleteModal" 
        :objectName="customSheet.name"
        objectType="Custom Sheet"
        v-on:close="deleteModal = false"
        v-on:delete="deleteCustomSheet()"></deleteModal>       
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
            <span>Print Selected</span>
            <v-icon>print</v-icon>
            </v-btn>
            <v-btn v-show="customSheet.customSheet_id && customSheet.customSheet_id !== 0" @click="deleteModal = true" class="v-btn--active error--text">
            <span>Delete</span>
            <v-icon>delete</v-icon>
            </v-btn>
            <!-- 
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
    
    constructor (
        category,
        id = `clientId-${estValIdCounter++}`,
        name = "",
        amt = null,
        basePrice = null,
        priceType = null,
        markup = 1,
        discount = 0,
        priceModifier = null
        ) {
        this.id = id
        this.type = category;
        this.name = name;
        this.amt = amt;
        this.basePrice = basePrice;
        this.priceType = priceType;
        this.markup = markup;
        this.discount = discount;
        this.priceModifier = priceModifier;
        if (this.priceModifier == null) this.priceModifier = 1;
    }

    //Sets estValue properties from an option value object
    //also works for custom value if only string is passed for name
    set obj(o) {
        if (o !== null & o.hasOwnProperty('name')) {
            this.name = o.name;
            this.basePrice = o.basePrice;
            this.type = o.type;
            this.priceType = o.priceType;
            this.markup = o.markup;
            this.discount = o.discount;
            this.priceModifier = o.priceModifier;
        } else {
            this.name = o;
        }
    }

    get obj() {
        return this.name;
    }

    get total() {
        if (isNaN(this.amt) || isNaN(this.basePrice)) return 0;
        return this.round(this.amt * this.pricePer * this.markup * (1 - (this.discount/100)), 2);
    }
    
    get isClientId() {
        return (isNaN(Number(this.id)));  
    }

    get pricePer() {
        return this.round(this.basePrice * this.priceModifier, 3);
    }

    set pricePer(val) {
        // if (this.priceType == 'Gold' || this.priceType == 'Plat') return;
        this.priceModifier = 1;
        this.basePrice = val;
    }

    get disabled() {
        this.priceType == 'Gold' || this.priceType == 'Plat' ? true : false;
    }

    round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
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
                new estValue(v.type, v.id, v.name, v.amt, v.basePrice, v.priceType, v.markup, v.discount, v.priceModifier)
            )
        })
    }

    updateMetalPrices(gold, plat) {
        if(this.estValues.length > 0) {
            this.estValues.forEach(v => {
                if (v.priceType == 'Gold') v.basePrice = gold;
                if (v.priceType == 'Plat') v.basePrice = plat;
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
        categories: [],
        catOptions: [],
        extras: [],
        on: null,
        loading: false,
        deleteModal: false,
        estPreviewHeaders: [
            {
                text: 'Type',
                align: 'left',
                sortable: false,
                value: 'name'
            },
            {
                text: 'Amount',
                align: 'left',
                sortable: false,
                value: 'amount'
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
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
            },
        //Gets est val options and metal prices
        getValues() {

            this.$http.get(this.store.serverURL + '/values/gettype?type_id=2')
                .then((response) => {
                    response.data.forEach(function (v) {
                        if (v.name === 'GoldCAD') {
                            this.goldCAD = this.round(v.value1, 2);
                            this.metalPriceDate = v.updated_at;
                        } else if (v.name === 'PlatCAD') {
                            this.platCAD = this.round(v.value1, 2);
                        }
                    }.bind(this));
                    this.goldCAD

                    this.getCatValues();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getCatValues() {
            this.$http.get(this.store.serverURL + '/values/gettype?type_id=3')
                        .then((response) => {
                            response.data.forEach(value => {
                                let est = new estValue();
                                est.type = value.value1;
                                est.name = value.name;
                                est.priceType = value.value3;
                                est.markup = value.markup;
                                est.discount = value.discount;
                                est.basePrice = value.value2;


                                if (!this.categories.includes(est.type) & est.type != 'Extra') {
                                    this.categories.push(est.type);
                                    this.catOptions.push([]);
                                }

                                if (est.priceType === 'Gold') est.basePrice = this.goldCAD;
                                if (est.priceType === 'Plat') est.basePrice = this.platCAD;
                                if (est.priceType === 'Gold' || est.priceType === 'Plat') est.priceModifier = this.round(value.value2, 2);
                                else est.priceModifier = 1;
                                if (est.markup == null) est.markup = 1;
                                if (est.discount == null) est.discount = 0;

                                if (est.type == "Extra") {
                                    this.extras.push(est);
                                } else {
                                    this.catOptions[this.categories.indexOf(est.type)].push(est);
                                }
                            })

                            //Add extras on bottom always
                            this.extras.forEach(extra => {
                                if (!this.categories.includes(extra.type)) {
                                    this.categories.push(extra.type);
                                    this.catOptions.push([]);
                                }
                                this.catOptions[this.categories.indexOf(extra.type)].push(extra);
                            })
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
            this.customSheet.primaryEst = this.customSheet.estimates[est_index].id
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
        //Deletes the current custom sheet
        deleteCustomSheet() {
            this.loading = true;
            this.$http.post(this.store.serverURL +  '/customsheet/delete', {id: this.customSheet.customSheet_id})
                .then((response) => {
                    this.store.setAlert(true, "success", "Custom Sheet Deleted with ID: " + this.customSheet.customSheet_id);
                    this.loading = false;
                    this.$router.go(-1);
                })
                .catch((error) => {
                    console.table(error);
                    this.loading = false;
                    this.store.setAlert(true, "error", error.message);                                                                    
                });  
        },
        //Returns true if selectedEstimate has the passed id
        isSelectedEstimate(id) {
            return (id === this.customSheet.selectedEstimate.id);
        },
        //Updates all existing plat or gold value based est_vals with new values
        updateExistingMetalPrices() {
            this.customSheet.selectedEstimate.updateMetalPrices(this.goldCAD, this.platCAD);
            // if (this.customSheet.estimates.length > 0) {
            //     this.customSheet.estimates.forEach(e => {
            //         e.updateMetalPrices(this.goldCAD, this.platCAD);
            //     })
            // }
        },
        //Saves Custom Sheet to DB
        createCustomSheet() {
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
            console.log(upload);
            this.$http.post(this.store.serverURL +  '/customsheet/create', upload)
                .then((response) => {
                    this.customSheet = this.newCustomSheetFromResponse(response.data);
                    this.store.setAlert(true, "success", "Custom Sheet Created with ID: " + this.customSheet.customSheet_id);
                    this.loading = false;
                    // // this.$router.replace("/job/" + this.job.id);
                })
                .catch((error) => {
                    console.table(error);
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
            console.log(upload);
            this.$http.post(this.store.serverURL +  '/customsheet/update', upload)
                .then((response) => {
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
            var val = new estValue(v.type, v.id, v.name, v.amt, v.basePrice, v.priceType, v.markup, v.discount, v.priceModifier);
            return val;
        }
    },

    props: {
        customSheet_id: Number,
        customer_id: Number
    },
    mounted() {
        this.getValues();
        if (!isNaN(this.customSheet_id) && this.customSheet_id !== null && this.customSheet_id !== 0 && this.customSheet.customSheet_id !== this.customSheet_id) {
            this.getCustomSheet(this.customSheet_id);
        }
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
            if (!isNaN(id) && id !== null && id !== 0 && this.customSheet.customSheet_id !== val) {
                this.getCustomSheet(val);
            }
        },
        customer_id(val) {
            if (this.customSheet.customer_id == null) this.customSheet.customer_id = val;
        },
        goldCAD(val) {
            if (this.catOptions.length > 0) {
                this.catOptions.forEach(array => {
                    array.forEach(value => {
                        if (value.priceType === 'Gold') value.basePrice = this.goldCAD;
                    })
                })
            }
        },
        platCAD(val) {
            if (this.catOptions.length > 0) {
                this.catOptions.forEach(array => {
                    array.forEach(value => {
                        if (value.priceType === 'Gold') value.basePrice = this.platCAD;
                    })
                })
            }
        },
    },
};

</script>