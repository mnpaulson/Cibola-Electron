<template>
    <transition name="component-fade" appear>
        <div>
    <v-layout row wrap>
        <v-flex d-flex xs12 lg6 xl6>
                <v-card>
                    <v-card-text>
                    <v-form ref="goldcreditForm" lazy-validation>                    
                    <v-layout row wrap>
                        <v-flex row xs12 md6>
                            <v-autocomplete
                                    label="Employee Select"
                                    cache-items
                                    required
                                    :rules="employeeRules"
                                    prepend-icon="person_pin"
                                    :items="employeeList"
                                    v-model="credit.employee_id"
                                    item-text="name"
                                    item-value="id"
                                    :disabled="disabled"
                            ></v-autocomplete>
                            <v-text-field
                                label="Total Value"
                                v-model="credit.total"
                                prepend-icon="attach_money"
                                :disabled="disabled"
                            ></v-text-field>
                            <v-menu
                                ref="dateMenu"
                                lazy
                                :close-on-content-click="true"
                                v-model="dateMenu"
                                transition="scale-transition"
                                offset-y
                                full-width
                                :nudge-right="40"
                                min-width="290px"
                                :return-value.sync="date"
                                >
                                    <v-text-field
                                    slot="activator"
                                    label="Date"
                                    v-model="credit.creditDate"
                                    prepend-icon="event"
                                    readonly
                                    :placeholder="today"
                                    :disabled="disabled"
                                    ></v-text-field>
                                    <v-date-picker v-model="credit.creditDate" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.dateMenu.save(dateMenu)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                                <v-checkbox
                                    :label="'Credit Used'"
                                    v-model="credit.used"
                                ></v-checkbox>
                        </v-flex>
                        <v-flex row xs12 md2>
                                <v-text-field
                                    v-model="credit.goldCAD"
                                    label="Gold (g)"
                                    :disabled="disabled"
                                ></v-text-field>
                                <v-text-field
                                    v-model="credit.platCAD"
                                    label="Platinum (g)"
                                    :disabled="disabled"
                                ></v-text-field>
                                <!-- <v-text-field
                                    v-model="credit.exchange"
                                    label="Exchange"
                                ></v-text-field> -->
                             <v-btn v-show="credit.id == null" flat color="primary" @click="getNewGoldValue"><v-icon>refresh</v-icon>{{credit.metalPriceDate}}</v-btn>
                        </v-flex>
                        <v-flex row xs12 md12>
                            <v-textarea no-resize v-model="credit.note" class="" label="Credit Note"></v-textarea>                    
                        </v-flex>
                    </v-layout>
                    </v-form>
                    </v-card-text>
                </v-card>
        </v-flex>
    </v-layout>
        <template v-for="(item, index) in itemList">
            <v-layout row wrap v-bind:key="item.id">
                <v-flex d-flex xs12 lg8 xl6>
                        <v-card>
                            <v-card-text>
                                {{item.id}}
                                <v-layout row wrap>
                                    <v-flex xs6 md3>
                                        <v-autocomplete
                                            label="Item Select"
                                            :disabled="disabled"
                                            cache-items
                                            :items="valueList"
                                            :return-object=true
                                            item-text="name"
                                            item-value="id"
                                            v-model="item.itemObj"
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs6 md3>
                                        <v-text-field
                                            v-model="item.weight"
                                            label="Weight(g)/Amount"
                                            :disabled="disabled"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6 md1>
                                        <v-text-field
                                            v-model="item.multiplier"
                                            label="*"
                                            :disabled="multiplierDisable"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6 md1>
                                        <v-text-field
                                            v-model="item.markup"
                                            label="Markup"
                                            :disabled=true
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6 md2>
                                        <v-text-field
                                            v-model="item.unitPrice"
                                            label="Unit Price"
                                            :disabled=true
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6 md2>
                                        <v-text-field
                                            v-model="item.value"
                                            label="Value"
                                            :disabled="disabled"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6 md1>
                                        <v-btn v-show="credit.id == null" class="close-btn" dark small right absolute outline fab color="grey" @click="removeItem(index)"><v-icon class="fab-fix" dark>delete</v-icon></v-btn>                    
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                </v-flex>
            </v-layout>
        </template>
         <v-layout row wrap>
            <v-flex d-flex xs12 lg2 xl2>
                <v-btn v-show="credit.id == null" color="primary" @click="newItem">Add Item</v-btn>
            </v-flex>
        </v-layout>
        <template v-for="(image, index) in credit.credit_images" >
            <v-flex d-flex class="xs12 sm12 md6 lg3 xl3" :key="image.id">
                <transition name="component-fade" appear>                    
                <v-card>
                    <v-btn v-show="credit.id == null" class="close-btn" dark small right absolute outline fab color="grey" @click="removeImage(index)"><v-icon class="fab-fix" dark>delete</v-icon></v-btn>                    
                    <v-img :src="image.image" height="200px" @click="showLightBox(image.image)">
                    </v-img>
                    <v-textarea v-model="image.note" name="input-1" label=" Note" multi-line rows="5" no-resize></v-textarea>
                </v-card>
                </transition>
            </v-flex>
        </template>
            <v-bottom-nav
                fixed
                :value="true"
                :app="true"
                color="white"
                class="elevation-1"
            >
                <v-btn v-show="!credit.id || credit.id == 0" @click="createCredit()" class="v-btn--active primary--text">
                <span>Save Credit</span>
                <v-icon>save</v-icon>
                </v-btn>
                <v-btn v-show="credit.id && credit.id !== 0" @click="updateCredit()" class="v-btn--active success--text">
                <span>Update Credit</span>
                <v-icon>save</v-icon>
                </v-btn>
                <v-btn :disabled="!credit.id || credit.id == 0" class="v-btn--active info--text" @click="printCredit">
                <span>Print</span>
                <v-icon>print</v-icon>
                </v-btn>
                <v-btn v-show="credit.id == null" @click="captureDialog = true" class="v-btn--active accent--text">
                <span>Capture</span>
                <v-icon>camera_alt</v-icon>
                </v-btn>
                <v-btn v-show="credit.id && credit.id !== 0" @click="creditDeleteDialog = true" class="v-btn--active error--text">
                <span>Delete Credit</span>
                <v-icon>delete</v-icon>
                </v-btn>
                <v-btn v-show="!credit.id || credit.id == 0" @click="$router.go(-1)" class="v-btn--active error--text">
                <span>Discard Credit</span>
                <v-icon>delete</v-icon>
                </v-btn>
            </v-bottom-nav>

            <v-dialog v-model="creditDeleteDialog" max-width="500px">
            <v-card>
                <v-toolbar color="error" dark clipped-left flat>
                    <v-toolbar-title><v-icon>warning</v-icon>Delete Credit</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Are you sure you want to delete this Credit? <br>
                    This will also delete all images attached to this Credit <br>
                    This action is not reversable
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error"  @click.stop="deleteCredit()">
                        <v-icon>delete</v-icon>
                        Delete
                    </v-btn>                    
                    <v-btn color="primary" right absolute @click.stop="creditDeleteDialog=false">
                        <v-icon>cancel</v-icon>
                        Cancel
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="imageDeleteDialog" max-width="500px">
            <v-card>
                <v-toolbar color="error" dark clipped-left flat>
                    <v-toolbar-title><v-icon>warning</v-icon> Delete Credit Image</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Are you sure you want to delete this image? <br>
                    This image was previously saved to this credit. <br>
                    This action is not reversable
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error"  @click.stop="deleteImage()">
                        <v-icon>delete</v-icon>
                        Delete
                    </v-btn>                    
                    <v-btn color="primary" right absolute @click.stop="imageDeleteDialog=false">
                        <v-icon>cancel</v-icon>
                        Cancel
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="captureDialog" transition="dialog-transition" fullscreen >
            <v-card>
                <!-- <v-flex d-flex xs12> -->
                <div class="catpure-cont">
                    <video ref="videoDisplay" id="videoDisplay" autoplay></video>
                    <video v-show="false" ref="video" id="video" :width="store.camera.width + 'px'" :height="store.camera.height + 'px'" autoplay></video>
                    <!-- <img class="capture-error" v-show="img" :src="img">                             -->
                    <canvas v-show="false" ref="img" id="img" :width="store.camera.width" :height="store.camera.height"></canvas>
                </div>
                <!-- </v-flex> -->
                <v-flex d-flex xs12>                    
                <v-btn color="primary" @click="saveImage()">Capture</v-btn>
                <v-btn color="error" @click="discardCapture()">discard</v-btn>
                </v-flex>
            </v-card>
        </v-dialog>
        <transition name="component-lightbox" appear>                            
            <div v-if="lightBoxDialog" class="lightBoxWrapper" @click="lightBoxDialog = false">
                <img :src='lightBoxImage' alt="" class="lightBoxImage">
            </div>
        </transition>
        <div class="cb-print">
            <div class="cb-print-element cb-print-credit-header">
                Scrap Gold Credit Record
            </div>
            <div class="cb-print-element cb-print-credit-employee">Employee: {{ employeeName }}</div>
            <div class="cb-print-element cb-print-credit-date">Date: {{credit.creditDate}}</div>
            <div class="cb-print-element cb-print-credit-total">Total Credit: ${{credit.total}}</div>
            <div class="cb-print-element cb-print-credit-warning">
                ALL PURCHASES ARE FINAL - NO EXCEPTIONS
            </div>

            <div class="cb-print-element cb-print-credit-images-cont">
                <table class="cb-print-element cb-print-credit-table">
                    <tr class="cb-print-visible">
                        <th class="cb-print-visible">Item</th>
                        <th class="cb-print-visible">Units</th>
                        <th class="cb-print-visible">Unit Value</th>
                        <th class="cb-print-visible">Total Value</th>
                    </tr>
                <template v-for="items in itemList">
                    <!-- <div class="cb-print-element cb-print-credit-items-cont" :key="items.id">
                        {{valueName(items.id)}} {{items.weight}} Units
                        @ ${{items.unitPrice}} = ${{items.value}}
                    </div> <br /> -->
                    <tr :key="items.id" class="cb-print-visible">
                        <td class="cb-print-visible">{{valueName(items.item)}}</td>
                        <td class="cb-print-visible">{{items.weight}}</td>
                        <td class="cb-print-visible">${{items.unitPrice}}</td>
                        <td class="cb-print-visible">${{items.value}}</td>
                    </tr>
                </template>
                <tfoot class="cb-print-visible">
                    <tr class="cb-print-visible">
                        <td class="cb-print-visible"></td>
                        <td class="cb-print-visible"></td>
                        <td class="cb-print-visible">Grand Total:</td>
                        <td class="cb-print-visible">${{credit.total}}</td>
                    </tr>
                </tfoot>
                </table>
                <div class="cb-print-element cb-print-table-note">
                    Gold and Platinum units are measured in grams.
                </div>
                <template v-for="(image) in credit.credit_images">
                    <div class="cb-print-element cb-print-credit-img-cont" :key="image.id">
                        <img :src='image.image' alt="" class="cb-print-credit-img cb-print-element">
                    </div>
                </template>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
const { remote, BrowserWindow } = require('electron')

    export default {
        data: () => ({
            employeeList: [],
            employee: null,
            valueList: [],
            itemList: [],
            date: false,
            dateMenu: false,
            creditDeleteDialog: false,
            disabled: false,
            multiplierDisable: true,
            credit: {
                id: null,
                employee_id: null,
                customer_id: null,
                goldCAD: null,
                platCAD: null,
                metalPriceDate: "",
                creditDate: null,
                creditValue: null,
                used: false,
                note: null,
                credit_items: [],
                credit_images: []
            },
            items: [],
            img: {},
            video: {},
            videoDisplay: {},
            captureDialog: false,
            imageDeleteDialog: false,
            creditDeleteDialog: false,
            lightBoxDialog: false,
            lightBoxImage: null,
            deleteImageId: null,
            deleteImageIndex: null,
            employeeRules: [
                v => !!v || 'Select employee'
            ],
        }),
        methods: {
            //Gets employee list
            getEmployees() {
                this.$http.get(this.store.serverURL +  '/employees/active')
                    .then((response) => {
                        this.employeeList = response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            //Gets metal select menu options
            getValues() {
                this.$http.get(this.store.serverURL +  '/values/gettype?type_id=1')
                    .then((response) => {
                        this.valueList = response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this.$http.get(this.store.serverURL +  '/values/gettype?type_id=2')
                    .then((response) => {
                        response.data.forEach(function(v){
                            if (v.name === 'GoldCAD') {
                                this.credit.goldCAD = this.round(v.value1, 2);
                                this.credit.metalPriceDate = v.updated_at;
                            } else if (v.name === 'PlatCAD') {
                                this.credit.platCAD = this.round(v.value1, 2);
                            }
                        }.bind(this));
                        this.credit.goldCAD
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            // Adds a new blank item to list
            newItem() {
                var list = {
                    id: null,
                    item: null,
                    itemObj: null,
                    weight: null,
                    multiplier: null,
                    markup: null,
                    value: null,
                    unitPrice: null
                };
                var newList = this.itemList;
                newList.push(list);
                this.$set(this, 'itemList', newList);
            },
            //Gets the value of gold in grams
            getNewGoldValue() {
                this.$http.get(this.store.serverURL +  '/values/getGoldValue')
                    .then((response) => {
                        // console.log(response);
                        var goldG = response.data[0];
                        // this.credit.exchange = this.round(response.data[1], 2);
                        this.credit.goldCAD = this.round(goldG, 2);
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
                        // platG = platG * this.credit.exchange;
                        this.credit.platCAD = this.round(platG, 2);
                        this.credit.metalPriceDate = this.today + " " + this.now;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            //Round number to desired decimals
            round(value, decimals) {
                return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
            },
            //Create new gold credit
            createCredit() {
                this.credit.credit_items = this.itemList;
                this.$http.post(this.store.serverURL +  '/goldcredit/create', this.credit)
                    .then((response) => {
                        this.credit.id = response.data.id;
                        var i = 0;
                        // response.data.image_ids.forEach(id => {
                        //     this.job.job_images[i].id = id;
                        //     i++;
                        // });
                        this.store.setAlert(true, "success", "Credit Created with ID: " + this.credit.id);
                        this.$router.replace("/goldcredit/" + this.credit.id);
                        this.loading = false;                                                                                                                                                        
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false;
                        this.store.setAlert(true, "error", error.message);                                                                    
                    });
            },
            //Update existing gold credit
            updateCredit() {
                this.$http.post(this.store.serverURL +  '/goldcredit/update', {id: this.credit.id, note: this.credit.note, used: this.credit.used, customer: this.credit.customer_id})
                    .then((response) => {
                        this.creditDeleteDialog = false;
                        this.store.setAlert(true, "success", "Credit ID " + this.credit.id + " updated.");                        
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
            //Delete current credit
            deleteCredit() {
                this.$http.post(this.store.serverURL +  '/goldcredit/delete', {id: this.credit.id})
                    .then((response) => {
                        // this.$router.push("/");
                        this.creditDeleteDialog = false;
                        this.store.setAlert(true, "warning", "Credit ID " + this.credit.id + " deleted.");                        
                        this.$router.go(-1);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
            //Get credit
            getCredit(id) {
                this.loading = true;
                this.$http.post(this.store.serverURL +  '/goldcredit/show', {id: id})
                    .then((response) => {
                        this.credit.id = response.data.id;
                        this.credit.customer_id = response.data.customer_id;
                        this.credit.employee_id = response.data.employee_id;
                        this.credit.note = response.data.note;
                        this.credit.goldCAD = response.data.gold_cad;
                        this.credit.platCAD = response.data.plat_cad;
                        this.credit.metalPriceDate = response.data.metalPriceDate;
                        this.credit.creditDate = response.data.gold_date;
                        this.credit.used = response.data.used;

                        response.data.credit_images.forEach(element => {
                            element.image = this.store.serverURL + element.image;
                            this.credit.credit_images.push(element);
                        });

                        response.data.credit_items.forEach(element => {
                            var item = {
                                id: element.id,
                                itemObj: this.valueList[element.itemId - 1],
                                item: element.itemId,
                                markup: element.markup,
                                multiplier: element.multiplier,
                                value: element.value,
                                weight: element.weight,
                                unitPrice: this.round(element.value / element.weight, 2)
                            }
                            for (var i = 0; i < this.valueList.length; i++) {
                                if (this.valueList[i].id == element.itemId) {
                                    item.itemObj = this.valueList[i];
                                }
                            }
                            this.credit.credit_items.push(item)
                        });

                        this.itemList = this.credit.credit_items;

                        this.$emit('customerId', this.credit.customer_id);

                        this.loading = false;
                    })
                    .catch((error) => {
                        this.store.setAlert(true, "error", "Credit ID " + id + " not found.");
                        this.loading = false;
                        console.log(error);
                    });
            },
            //Deletes credit item
            removeItem(index) {
                        this.itemList.splice(index, 1);                
            },
            saveImage() {
                this.img = this.$refs.img;
                var context = this.img.getContext("2d").drawImage(this.video, 0, 0, this.store.camera.width, this.store.camera.height);
                var buffer = this.img.toDataURL("image/png");
                var meta = buffer.substr(0, buffer.indexOf(',') + 1);
                let imgBuffer = Buffer.from(buffer.substr(buffer.indexOf(',') + 1), 'base64');

                this.credit.credit_images.push({
                    image: this.img.toDataURL("image/png"),
                    note: null,
                    id: null
                });
                this.img = null;
                this.captureDialog = false;
            },
            discardCapture() {
                this.captureDialog = false;
            },
            showLightBox(image) {
                this.lightBoxImage = image;
                this.lightBoxDialog = true;
            },
            removeImage(index) {
                if (this.credit.credit_images[index].id !== null) {
                    this.deleteImageId = this.credit.credit_images[index].id;
                    this.deleteImageIndex = index;
                    this.imageDeleteDialog = true;
                } else {
                    this.credit.credit_images.splice(index, 1);                
                }
            },
            stopStreamedVideo(videoElem) {
                let stream = videoElem.srcObject;
                let tracks = stream.getTracks();

                tracks.forEach(function(track) {
                    track.stop();
                });

                videoElem.srcObject = null;
            },
            printCredit() {
                var currentWindow = remote.getCurrentWindow()
                currentWindow.webContents.print({silent: true, printBackground: false, deviceName: this.store.printers.credit});
                // if (this.job.id == null) this.createCredit();
            },
            valueName(id) {
                if (this.valueList.length > 0 && this.goldcredit_id > 0) {
                    var e = this.valueList.find((element) => {
                        if (id == element.id) {
                            return element.name;
                        }
                    });
                    return e.name;
                } else {
                    return "loading...";
                }

            }
        },
        mounted() {
            this.getEmployees();
            this.getValues();

            this.video = this.$refs.video;

            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                    try {
                        this.video.srcObject = stream;
                    } catch (error) {
                        this.video.src = URL.createObjectURL(stream);
                        console.log('Could not create video stream');
                        this.img = "img/webcamError.png";

                    }                   
                    this.video.play();
                });
            }

            this.videoDisplay = this.$refs.videoDisplay;

            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                    try {
                        this.videoDisplay.srcObject = stream;
                    } catch (error) {
                        this.videoDisplay.src = URL.createObjectURL(stream);
                        console.log('Could not create video stream');
                        this.img = "img/webcamError.png";

                    }                   
                    this.videoDisplay.play();
                });
            }
        },
        props: {
            customer_id: Number,
            goldcredit_id: Number
        },
        watch: {
            customer_id (val) {
                if (!isNaN(this.customer_id) && this.customer_id !== null) {
                    this.credit.customer_id = val;
                }
            },
            goldcredit_id (val) {
                this.credit.id = null;
                this.credit.employee_id = null;
                this.credit.goldCAD = null;
                this.credit.platCAD = null;
                this.credit.metalPriceDate = "";
                this.credit.creditDate = null;
                this.credit.creditValue = null;
                this.credit.used = false;
                this.credit.note = null;
                this.credit.credit_items = [];
                this.credit.credit_images = [];
                this.itemList = [];
                this.disabled = false;
                if (!isNaN(this.goldcredit_id) && this.goldcredit_id !== null && this.goldcredit_id) {
                    this.getCredit(this.goldcredit_id);
                    this.disabled = true;
                }
                else {
                    this.disabled = false;
                }
            },
            //Calculate values on changes
            itemList: {
                handler(list) {
                    var total = 0;
                    list.forEach(function(e){
                        if(e.id == null) {
                            var metal;
                            if (e.itemObj) {
                                if (e.itemObj.name == "Other" || e.itemObj.name == "Diamonds") {
                                    this.multiplierDisable = false;
                                    e.multiplier = e.itemObj.value1;
                                }
                                else {
                                    this.multiplierDisable = true;
                                    e.multiplier = e.itemObj.value1;
                                }
                                e.markup = e.itemObj.value2;
                                e.item = e.itemObj.id;
                                if (e.itemObj.value3 === "Gold" ) {
                                    metal = this.credit.goldCAD;
                                } else if (e.itemObj.value3 === "Platinum" ) {
                                    metal = this.credit.platCAD;
                                } else {
                                    metal = 1;
                                }
                            }

                            if (e.weight && e.multiplier && e.markup) {
                                e.value = this.round(e.weight * e.multiplier * e.markup * metal, 2);
                                e.unitPrice = this.round(e.value / e.weight, 2);
                            }
                            else e.value = 0;
                        }
                        total += e.value;
                        total = this.round(total, 2);
                    }.bind(this));
                    this.credit.total = total;
                },
                deep: true
            },
        },
        computed: {
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
            store() {
                return this.$root.$data.store;
            },
            toolbarText() {
              return this.$root.$data.store.toolbarText;
            },
            employeeName() {
                if (this.credit.employee_id != null && this.employeeList.length > 0) {
                    var e = this.employeeList.find((element) => {
                        if (element.id == this.credit.employee_id) {
                            return element.name;
                        }
                    });
                    // console.log(e);
                    return e.name;
                } else {
                    return null;
                }
            }
        },
        beforeDestroy() {
            //Close webcam Streams when navigating away
            this.stopStreamedVideo(this.videoDisplay);
            this.stopStreamedVideo(this.video);
        },
    }
</script>