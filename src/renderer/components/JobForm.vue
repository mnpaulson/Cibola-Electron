<template>
    <v-layout row wrap>
        <v-flex d-flex xs12 lg6 xl6>
            <transition name="component-fade" appear>
            <v-card>
                <v-card-text class="title font-w blue cb-white-text"><v-icon color="white">work_outline</v-icon> Job {{job.id}} -
                    <span v-show="job.created_at == null"> New Job</span> 
                    <span v-show="job.created_at != null"> Created {{createddateMMDDYYHHMM}}</span>
                </v-card-text>
                <v-card-text>
                    <v-form ref="jobForm" v-model="valid" lazy-validation>                    
                    <v-layout row wrap>
                            <v-flex xs12 md6>
                                <v-text-field ref="estimateField" required :rules="estimateRules" v-model="job.estimate" label="Estimate" prepend-icon="attach_money"></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-autocomplete
                                label="Employee Select"
                                cache-items
                                required
                                :rules="employeeRules"
                                prepend-icon="person_pin"
                                :items="employeeList"
                                v-model="job.employee_id"
                                item-text="name"
                                item-value="id"
                                ></v-autocomplete>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-menu
                                ref="dateMenu"
                                
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
                                label="Due Date"
                                v-model="job.due_date"
                                prepend-icon="event"
                                readonly
                                :class="{redText: job.vital_date}"                        
                            ></v-text-field>
                                <v-date-picker v-model="job.due_date" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                            </v-flex>
                            <v-menu
                            ref="completeMenu"
                            
                            :close-on-content-click="true"
                            v-model="completeMenu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            min-width="290px"
                            :return-value.sync="date"
                            v-show="complete"            
                            >
                                <v-text-field
                                slot="activator"
                                label="Completed Date"
                                v-model="job.completed_at"
                                prepend-icon="event"
                                readonly
                                ></v-text-field>
                                <v-date-picker v-model="job.completed_at" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="completeMenu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.completeMenu.save(completeDate)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                            <v-text-field required :rules="estimateRules" v-model="job.deposit" label="Deposit" prepend-icon="attach_money"></v-text-field>
                        <!-- <v-flex row xs12 md6>
                            <v-layout row wrap>   


                            <v-flex xs5>                                     
                                <v-checkbox
                                :label="'Appraisal'"
                                v-model="job.appraisal"
                                ></v-checkbox>
                            </v-flex>                    
                            <v-flex xs5>                                     
                                <v-checkbox
                                :label="'Vital Date'"
                                v-model="job.vital_date"
                                ></v-checkbox>
                            </v-flex>
                            <v-flex xs5>                                     
                                <v-checkbox
                                :label="'Complete'"
                                v-model="complete"
                                ></v-checkbox>
                            </v-flex>
                            </v-layout>             
                        </v-flex> -->
                        <v-flex xs12 md6>                 
                            <v-textarea  no-resize rows="3" v-model="job.est_note" label="Estimate Details"></v-textarea>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-textarea counter=230 rows="3" no-resize v-model="job.note" class="" label="Job Note"></v-textarea>                    
                        </v-flex>
                    </v-layout>
                    </v-form>
                </v-card-text>
                    <v-flex xs12 ma-0 pl-0 pt-0 pr-0>
                        <drag-drop v-on:imageUpload="handleDragDrop($event)" v-on:capture="captureDialog = true"></drag-drop>
                    </v-flex>
                <v-progress-linear v-show="loading" :indeterminate="true" class="mb-0"></v-progress-linear>                      
            </v-card>
            </transition>
        </v-flex>
        <v-flex xs12></v-flex>
        <template v-for="(image, index) in job.job_images" >
            <v-flex pt-0 d-flex class="xs12 sm12 md6 lg3 xl3" :key="image.id">
                <transition name="component-fade" appear>                    
                <v-card>
                    <v-btn class="close-btn" dark small right absolute outline fab color="grey" @click="removeImage(index)"><v-icon class="fab-fix" dark>delete</v-icon></v-btn>                    
                    <v-img :src="image.image" height="200px" @click="showLightBox(image.image)">
                    </v-img>
                    <v-textarea style="padding-top: 0px; padding-left:5px; padding-right:5px;" single-line hide-details v-model="image.note" name="input-1" label=" Note" multi-line rows="1" auto-grow></v-textarea>
                </v-card>
                </transition>
            </v-flex>
        </template>
        <v-flex xs12></v-flex>        

            <v-bottom-nav
                fixed
                :value="true"
                :app="true"
                color="white"
                class="elevation-1"
            >
                <v-btn @click="printAndClose()" class="v-btn--active primary--text">
                <span>Print & Close</span>
                <v-icon>done_all</v-icon>
                </v-btn>
                <v-btn v-show="!job.id || job.id == 0" @click="createJob()" class="v-btn--active primary--text">
                <span>Save Job</span>
                <v-icon>save</v-icon>
                </v-btn>
                <v-btn v-show="job.id && job.id !== 0" @click="updateJob()" class="v-btn--active success--text">
                <span>Update Job</span>
                <v-icon>save</v-icon>
                </v-btn>
                <v-btn class="v-btn--active info--text" @click="printJob()">
                <span>Print</span>
                <v-icon>print</v-icon>
                </v-btn>
                <!-- <v-btn @click="captureDialog = true" class="v-btn--active accent--text">
                <span>Capture</span>
                <v-icon>camera_alt</v-icon>
                </v-btn> -->
                <v-btn v-show="job.id && job.id !== 0" @click="jobDeleteDialog = true" class="v-btn--active error--text">
                <span>Delete Job</span>
                <v-icon>delete</v-icon>
                </v-btn>
                <v-btn v-show="!job.id || job.id == 0" @click="$router.go(-1)" class="v-btn--active error--text">
                <span>Discard Job</span>
                <v-icon>delete</v-icon>
                </v-btn>
            </v-bottom-nav>

        <v-dialog v-model="imageDeleteDialog" max-width="500px">
            <v-card>
                <v-toolbar color="error" dark clipped-left flat>
                    <v-toolbar-title><v-icon>warning</v-icon> Delete Job Image</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Are you sure you want to delete this image? <br>
                    This image was previously saved to this job. <br>
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

        <v-dialog v-model="jobDeleteDialog" max-width="500px">
            <v-card>
                <v-toolbar color="error" dark clipped-left flat>
                    <v-toolbar-title><v-icon>warning</v-icon>Delete Job</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Are you sure you want to delete this Job? <br>
                    This will also delete all images attached to this job <br>
                    This action is not reversable
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error"  @click.stop="deleteJob()">
                        <v-icon>delete</v-icon>
                        Delete
                    </v-btn>                    
                    <v-btn color="primary" right absolute @click.stop="jobDeleteDialog=false">
                        <v-icon>cancel</v-icon>
                        Cancel
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <transition name="component-lightbox" appear>                            
            <div v-if="lightBoxDialog" class="lightBoxWrapper" @click="lightBoxDialog = false">
                <img :src='lightBoxImage' alt="" class="lightBoxImage">
            </div>
        </transition>
        <span class="cb-print">
            <div class="cb-print-element cb-print-deposit-value">${{job.deposit}}</div>
            <div class="cb-print-element cb-print-note">
                {{job.note}}
            </div>
            <div class="cb-print-element cb-employee">
                {{ employeeName }}
            </div>
            <div class="cb-print-element cb-print-job-num">
               # {{ job.id }}
            </div>
            <div class="cb-print-element cb-print-estimate">
                <div class="cb-print-est-amt">Est: <span class="cb-print-visible" v-show="job.estimate > '0'">${{ job.estimate}} + GST</span></div><br>
                <div class="cb-print-est-note"> {{ job.est_note }} </div>
            </div>
            <div class="cb-print-element cb-print-due">
                <v-icon class="cb-print-element cb-print-jobicon">today</v-icon>
                <span class="cb-print-element cb-print-dates">{{ createdDateMMDDYY }}</span><br />
                <v-icon class="cb-print-element cb-print-jobicon">event_available</v-icon>
                <span class="cb-print-element cb-print-dates" :class="{cbPrintRed: job.vital_date}"> {{ dateMMDDYY }} </span>
            </div>
            <div class="cb-print-element cb-print-images">
                <div class="cb-print-element cb-print-image-spacer"></div>
                <template v-for="(image) in job.job_images">
                    <div class="cb-print-element cb-print-image-cont" :key="image.id">
                      <img :src='image.image' alt="" class="cb-print-image cb-print-element">
                      <div class="cb-print-element cb-print-image-note">{{image.note}}</div>                   
                    </div>
                </template>
            </div>
            <img class="cb-print-logo cb-print-element" src="static/logo.png" alt="">
            <div class="cb-print-element cb-print-cus-images">
                <template v-for="(image) in job.job_images">
                    <div class="cb-print-element cb-print-cus-img-cont" :key="image.id">
                      <img :src='image.image' alt="" class="cb-print-cust-img cb-print-element">
                    </div>
                </template>
            </div>
            <div class="cb-print-element cb-print-cus-job-info">
                Date: {{ today }} <br>
                Employee: {{ employeeName }} <br>
                Phone: 403-320-0846 <br>
                E-mail: info@thegoldworks.com <br>
                <!-- Job ID: {{job.id}} -->
            </div>
            <div class="cb-print-element cb-print-cus-estimate">
                <div class="cb-print-est-amt"><span class="cb-print-visible" v-show="job.estimate > '0'">Estimate: ${{ job.estimate}} + GST</span></div>
                <div class="cb-print-est-note"> {{ job.est_note }} </div>
            </div>
            <div class="cb-print-element cb-print-cus-warning">
                The Goldworks is not responsible for any items held for over 90 days
            </div>      
        </span>    
    </v-layout>

</template>

<script>
const { remote, BrowserWindow } = require('electron')

    export default {
        data: () => ({
            valid: true,
            loading: false,
            date: null,
            completeDate: null,
            dateMenu: false,
            completeMenu: false,
            complete: false,
            imageDeleteDialog: false,
            jobDeleteDialog: false,
            lightBoxDialog: false,
            lightBoxImage: null,
            deleteImageId: null,
            deleteImageIndex: null,
            employee: null,
            employeeList: [],
            img: {},
            job: {
                id: null,
                customer_id: null,
                employee_id: null,
                estimate: null,
                est_note: null,
                appraisal: false,
                note: null,
                due_date: null,
                completed_at: null,
                created_at: null,
                vital_date: true,
                deposit: null,
                job_images: []
            },
            test: null,
            estimateRules: [
                // v => !!v || 'Estimate is required',
                v => {
                    var pattern = new RegExp(/^\d*(,\d+)*[\.]?\d*?$|null/);
                    return pattern.test(v) || "Must be a valid number.";
                }
            ],
            employeeRules: [
                v => !!v || 'Select employee'
            ]
        }),
        methods: {
            discardCapture() {
                this.captureDialog = false;
            },
            removeImage(index) {
                if (this.job.job_images[index].id !== null) {
                    this.deleteImageId = this.job.job_images[index].id;
                    this.deleteImageIndex = index;
                    this.imageDeleteDialog = true;
                } else {
                    this.job.job_images.splice(index, 1);                
                }
            },
            showLightBox(image) {
                this.lightBoxImage = image;
                this.lightBoxDialog = true;
            },
            getEmployees() {
                this.$http.get(this.store.serverURL +  '/employees/active')
                    .then((response) => {
                        this.employeeList = response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            //Optional Print and Close parameters to print and close the job on successful save
            createJob(print, close) {
                this.$refs.jobForm.validate();
                if (!this.customer_id) {
                    this.store.setAlert(true, "error", "Please select a customer.");
                    return;
                }
                if (!this.valid) {
                    this.store.setAlert(true, "error", "Please fix required fields");
                    return;
                }
                this.loading = true;                
                this.$http.post(this.store.serverURL +  '/jobs/create', this.job)
                    .then((response) => {
                        this.job.id = response.data.id;
                        var i = 0;
                        response.data.image_ids.forEach(id => {
                            this.job.job_images[i].id = id;
                            i++;
                        });
                        this.store.setAlert(true, "success", "Job Create with ID: " + this.job.id);
                        this.loading = false;
                        if (print) {
                            this.job.created_at = Date(Date.now());
                            var currentWindow = remote.getCurrentWindow()
                            currentWindow.webContents.print({silent: true, printBackground: false, deviceName: this.store.printers.job}, (success) => {
                                if (success) {
                                    console.log('Create Job Print')
                                    if (close) {
                                        this.$router.push({name: 'home'});
                                    } else {
                                        this.$router.replace("/job/" + this.job.id);
                                    }
                                }
                            });
                        } else {
                            this.$router.replace("/job/" + this.job.id);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false;
                        this.store.setAlert(true, "error", error.message);                                                                    
                    });
            },
            updateJob() {
                this.$refs.jobForm.validate();
                if (!this.customer_id) {
                    this.store.setAlert(true, "error", "Please select a customer.");
                    return;
                }
                if (!this.valid) {
                    this.store.setAlert(true, "error", "Please fix required fields");
                    return;
                }
                this.loading = true;                
                this.$http.post(this.store.serverURL +  '/jobs/update', this.job)
                    .then((response) => {
                        this.job.id = response.data.id;
                        var i = 0;
                        response.data.image_ids.forEach(id => {
                            this.job.job_images[i].id = id;
                            i++;
                        });
                        this.store.setAlert(true, "success", "Job Upated Successfully");
                        this.loading = false;                                            
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false;
                        this.store.setAlert(true, "error", error.message);                                            
                    });
            },
            getJob(id) {
                this.loading = true;
                this.$http.post(this.store.serverURL +  '/jobs/show', {id: id})
                    .then((response) => {
                        this.job.id = response.data.id;
                        this.job.customer_id = response.data.customer_id;
                        this.job.employee_id = response.data.employee_id;
                        this.job.estimate = response.data.estimate.toLocaleString();
                        this.job.est_note = response.data.est_note;
                        this.job.note = response.data.note;                        
                        this.job.appraisal = response.data.appraisal;
                        this.job.due_date = response.data.due_date;
                        this.job.completed_at = response.data.completed_at;
                        this.job.vital_date = response.data.vital_date;
                        this.job.created_at = response.data.created_at;                      
                        // this.job.job_images = response.data.job_images;
                        if (response.data.deposit !== null)  {
                            this.job.deposit = response.data.deposit.toLocaleString();
                        } else { 
                            this.job.deposit = null;
                        }

                        response.data.job_images.forEach(element => {
                            console.log(element);
                            element.image = this.store.serverURL + element.image;
                            this.job.job_images.push(element);
                        });

                        this.$emit('customerId', this.job.customer_id);

                        if (this.job.completed_at !== null) this.complete = true;

                        this.store.setToolbarText(this.routeName + " - Created at: " + this.createddateMMDDYYHHMM + " Job ID: " + this.job.id);

                        this.loading = false;
                    })
                    .catch((error) => {
                        this.store.setAlert(true, "error", "Job ID " + id + " not found.");
                        this.loading = false;
                        console.log(error);
                    });
            },
            deleteImage() {
                this.$http.post(this.store.serverURL +  '/job_images/delete', {id: this.deleteImageId})
                    .then((response) => {
                        this.job.job_images.splice(this.deleteImageIndex, 1);
                        this.deleteImageId = null;
                        this.deleteImageIndex = null;
                        this.imageDeleteDialog = false;                                                                                       
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
            deleteJob() {
                this.$http.post(this.store.serverURL +  '/jobs/delete', {id: this.job.id})
                    .then((response) => {
                        // this.$router.push("/");
                        this.jobDeleteDialog = false;
                        this.store.setAlert(true, "warning", "Job ID " + this.job.id + " deleted.");                        
                        this.$router.go(-1);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
            printJob() {
                if (this.job.id == null) {
                    console.log('here? to');
                    this.createJob(true);
                }
                else {
                    console.log('here?');
                    var currentWindow = remote.getCurrentWindow()
                    currentWindow.webContents.print({silent: true, printBackground: false, deviceName: this.store.printers.job}, (success) => {
                        console.log("print print");
                    });
                }

            },
            printAndClose() {
                if (this.job.id == null) this.createJob(true, true);
                else {
                    var currentWindow = remote.getCurrentWindow()
                    currentWindow.webContents.print({silent: true, printBackground: false, deviceName: this.store.printers.job}, (success) => {
                        this.$router.push({name: 'home'});
                    });
                    
                }

            },
            setBestFocus() {
                if (this.job.customer_id != 0 && this.job_id < 1) {
                    this.$nextTick(() => {
                        this.$refs.estimateField.focus();
                    });
                }
            },
            handleDragDrop(image) {
                console.log(image);
                this.job.job_images.push(image);
            }
        },
        mounted() {
            this.getEmployees();
        },
        props: {
            customer_id: Number,
            job_id: Number
        },
        watch: {
            customer_id (val) {
                if (!isNaN(this.customer_id) && this.customer_id !== null) {
                    this.job.customer_id = val;
                    this.setBestFocus();
                }
            },
            job_id (val) {
                this.job.employee_id = null;
                this.job.estimate = null;
                this.job.deposit = null;
                this.job.est_note = null;
                this.job.note = null;                        
                this.job.appraisal = false;
                this.job.due_date = null;
                this.job.completed_at = null;
                this.job.vital_date = true;                        
                this.job.job_images = [];
                this.job.id = null;
                if (!isNaN(this.job_id) && this.job_id !== null) {
                    this.getJob(this.job_id);
                }
            },
            complete (val) {
                if (val && this.job.completed_at == null) this.job.completed_at = this.today;
                if (!val) this.job.completed_at = null;
                
            }                
        },
        computed: {
            store() {
                return this.$root.$data.store;
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
            dateMMDDYY() {
                if (this.job.due_date == null) return "";
                var today = new Date(this.job.due_date);
                var yyyy = today.getFullYear();
                var mm = (1+today.getMonth());
                var dd = today.getDate() + 1;

                if (mm < 10 ) {
                    mm = "0" + mm;
                }
                if (dd < 10 ) {
                    dd = "0" + dd;
                }

                return mm + "-" + dd + "-" + yyyy
            },
            createddateMMDDYYHHMM() {
                var today = new Date(this.job.created_at);
                var hh = today.getHours();
                var mm = today.getMinutes();
                if (mm < 10 ) {
                    mm = "0" + mm;
                }
                if (hh < 10 ) {
                    hh = "0" + hh;
                }
                return this.createdDateMMDDYY + " " + hh + ":" + mm;
            },
            createdDateMMDDYY() {
                var today = new Date(this.job.created_at);
                var yyyy = today.getFullYear();
                var mm = (1+today.getMonth());
                var dd = today.getDate();

                if (mm < 10 ) {
                    mm = "0" + mm;
                }
                if (dd < 10 ) {
                    dd = "0" + dd;
                }

                return mm + "-" + dd + "-" + yyyy
            },
            now() {
                var now = new Date()
                return now.getHours() + ":" + now.getMinutes();
            },
            employeeName() {
                if (this.job.employee_id != null) {
                    var e = this.employeeList.find((element) => {
                        if (element.id == this.job.employee_id) {
                            return element.name;
                        }
                    });
                    // console.log(e);
                    return e.name;
                } else {
                    return null;
                }
            },
            routeName() {
                return this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1)
            }
        }
    }
</script>