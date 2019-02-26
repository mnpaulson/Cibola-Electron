<template>
  <v-flex d-flex xs12 sm12 md6>  
    <div v-if="isSearch">
      <v-autocomplete
          v-model="searchSelect"
          v-on:keyup.enter="searchEnter"
          ref="search"
          :search-input.sync="search"
          label="Customer Search"
          cache-items
          :items="fuseList"
          item-text="name"
          item-value="id"
          autofocus
          solo
          prepend-inner-icon="person"
          append-icon="add_circle"
          @click:append="newCustomerForm"
        ></v-autocomplete>
    </div>                           
    <v-card  v-show="!isSearch">      
      <span v-show="isInfo" class="">          
        <v-btn style="z-index:0" class="close-btn" dark small right absolute outline fab color="grey" @click="clearCustomer()"><v-icon class="fab-fix" dark>close</v-icon></v-btn>
      </span>
      <v-card-text>
        <v-layout v-show="isInfo" row wrap>
          <v-flex xs12 md6>
            <router-link :to="{ path: `/customer/${customer.id}` }">          
              <h3 class="headline mb-0">
                <!-- <v-icon large>person</v-icon> -->
                <span>{{ customer.fname }}</span>
                <span>{{ customer.lname }}</span>
              </h3>
            </router-link>
            <p>
              <span v-show="customer.phone != null"><v-icon>phone</v-icon> {{ customer.phone }} <br></span>
              <span v-show="customer.email != null"><v-icon>email</v-icon> {{ customer.email }} <br></span>
              <span v-show="hasAddress"><v-icon>home</v-icon> {{ customer.addr_st }} <br>
              {{ customer.addr_city }}<span v-show="customer.addr_city != null">,</span> {{ customer.addr_prov }} {{ customer.addr_postal }} <br>
              {{ customer.addr_country }}</span>
            </p>
          </v-flex>
          <v-flex xs12 md6>
            <v-textarea no-resize v-model="customer.note" class="" label="Customer Notes"></v-textarea>                                
          </v-flex>
        </v-layout>
        <v-form>
          <v-layout row wrap v-show="isForm">
            <v-flex xs12 sm6>
              <v-text-field  label="First Name" ref="firstName" :rules="nameRules" required v-model="customer.fname" xs12 ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field append-icon="person" ref="lastName" label="Last Name" :rules="nameRules" required v-model="customer.lname" xs12 ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field append-icon="phone" ref="phoneNumber" label="Phone Number" v-model="customer.phone" xs12 ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field append-icon="mail" label="E-Mail" v-model="customer.email" xs12 ></v-text-field>
            </v-flex>
            <v-flex xs12><v-text-field  append-icon="home" label="Street Address" v-model="customer.addr_st" xs12 ></v-text-field></v-flex>
            <v-flex xs12 sm8><v-text-field label="City" v-model="customer.addr_city" xs12 ></v-text-field></v-flex>
            <v-flex xs12 sm4><v-text-field label="Province" v-model="customer.addr_prov" xs12 ></v-text-field></v-flex>
            <v-flex xs12 sm3><v-text-field label="Postal Code" v-model="customer.addr_postal" xs12 ></v-text-field></v-flex>
            <v-flex xs12 sm9><v-text-field label="Country" v-model="customer.addr_country" xs12 ></v-text-field></v-flex>
            
          </v-layout>
        </v-form>
        <div>
        </div>
        <div v-show="isForm">
          <v-flex d-flex row>
            <v-flex xs8 class="" v-show="customer.id == null || customer.id == 0"><v-btn xs6 block color="primary" @click="storeCustomer()">Create Customer</v-btn></v-flex>
            <v-flex xs8 class="" v-show="customer.id"><v-btn xs6 block  color="primary" @click="updateCustomer()">Save Changes</v-btn></v-flex>
            <v-flex xs4 class="ml-2"><v-btn xs6 block color="error" @click="clearForm()">Cancel</v-btn></v-flex>
          </v-flex>
        </div>
        <!-- <v-btn style="z-index:0" v-show="isInfo" dark small bottom right absolute fab color="primary" @click="setFormState(true)" class="fab-up"><v-icon class="fab-fix" dark>edit</v-icon></v-btn> -->
        <v-btn v-show="isInfo" color="blue " flat small right absolute class="cus-save-btn" @click="updateCustomer()">Save Note</v-btn>
        <v-btn v-show="isInfo" color="grey " flat small right absolute class="cus-edit-btn" @click="setFormState(true)">Edit</v-btn>
      </v-card-text>
            <v-progress-linear v-show="loading" :indeterminate="true" class="mb-0"></v-progress-linear>      
    </v-card>
    <span class="cb-print" v-if="checkPage() == 'job'">
        <div class="cb-print-element cb-print-blanks">
          <div class="cb-print-top-box cb-print-top-flags"><span class="cb-print-top-text">EMR NA LM Check</span></div>
          <div class="cb-print-top-box cb-print-top-deposit"><span class="cb-print-top-text">Deposit</span></div>
          <div class="cb-print-top-box cb-print-top-gold-credit"><span class="cb-print-top-text">Gold Credit</span></div>
          <div class="cb-print-top-box cb-print-total"><span class="cb-print-top-text">Total</span></div>          
        </div>
        <div class="cb-print-element cb-print-customer-info">
          <v-icon class="cb-print-element cb-print-customer-icon">person</v-icon><span class="cb-print-element cb-print-nowrap">{{ customer.fname }} {{ customer.lname }}</span><br>
          <v-icon class="cb-print-element cb-print-customer-icon">phone</v-icon><span class="cb-print-element cb-print-nowrap">{{ customer.phone }}</span> <br>
          <v-icon class="cb-print-element cb-print-customer-icon">email</v-icon><span class="cb-print-element cb-print-nowrap">{{ customer.email }}</span>
        </div>
          <div class="cb-print-element cb-print-customer-name">Name: {{ customer.fname }} {{ customer.lname }}</div>        
    </span>
    <span class="cb-print" v-if="checkPage() == 'credit'">
        <div class="cb-print-element cb-print-customercredit-info">
          Name: <span class="cb-print-element">{{ customer.fname }} {{ customer.lname }}</span><br>
          Phone: <span class="cb-print-element">{{ customer.phone }}</span><br>
          E-mail: <span class="cb-print-element">{{ customer.email }}</span><br>
          Address: <span class="cb-print-element">{{ customer.addr_st }} {{ customer.addr_city }}, {{ customer.addr_prov }} {{ customer.addr_postal }}</span>
        </div>
    </span>
  </v-flex>
</template>

<script>
  export default {
    data: () => ({
      isForm: false,
      isSearch: false,
      isInfo: false,
      header: "",
      searchSelect: "", //name after selection is made
      fuseList: [],
      searchList: null,
      search: [],
      loading: false,
      searchOptions: {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
        keys: ["fname", "lname", "phone"]
      },
      customer: {
        fname: null,
        lname: null,
        phone: null,
        email: null,
        addr_st: null,
        addr_city: null,
        addr_prov: null,
        addr_postal: null,
        addr_country: null,
        note: null,
        id: null
      },

      nameRules: [
        (v) => !!v || 'Name is required',
      ]

    }),

    props: {
      id: Number
    },

    watch: {
      search (val) {
        if (val != 'undefined' && val != null && val.length > 1) val && this.searchName(val)
      },
      searchSelect (val) {
        if (!isNaN(val) && val != null) {
          this.getCustomer(val);
          this.$emit('update:id', val);
        }
      },
      id (val) {
        if (!isNaN(this.id) && this.id !== null) {
          this.getCustomer(this.id);
        }
        else {
          this.setFormState(false);
        }
      },
      '$route' (to, from) {
                if (to.params.cus == 0) {
                    this.search = [];
                    this.fuseList = [];
                    this.searchList = null;
                }
      },
    },

    methods: {

      searchName() {
        if (this.searchList == null) {
          this.loading = true;
          this.$http.get(this.store.serverURL +  '/customers/searchList')
            .then((response) => {
              this.searchList = response.data;
              this.loading = false;              
              this.fuseMatch();
            })
            .catch((error) => {
              this.loading = false;
              console.log(error);
            });
        } else {
          this.fuseMatch();
        }       
      },

      searchEnter() {
        if (this.id === null && this.search != null) {
          this.newCustomerForm();
        }
      },

      fuseMatch() {
        this.fuseList = [];
        this.$search(this.search, this.searchList, this.searchOptions).then(results => {
          //Only load the 20 best matches into the display
          var length = results.length;
          // console.log(length);
          if (length > 20) length = 20;
          for (var i = 0; i < length; i++) {
            this.fuseList.push({name: results[i].fname + " " + results[i].lname  + " - " + results[i].phone, id: results[i].id});
          }
        })
      },

      //This function will attempt to determine the current state of the new customer form and
      //set the best focus location
      setBestFocus() {
        // this.$refs.search.focus();
        this.$nextTick(() => {
          if (this.customer.fname === null) {
            this.$refs.firstName.focus();
          } else if (this.customer.lname === null) {
            this.$refs.lastName.focus();
          } else {
            console.log('here');
            this.$refs.phoneNumber.focus();
          }
        });

      },

      //Sets the state of the customer card
      //val == true will enable the customer entry/edit form
      //val == false will set it to either search or info display
      //based on the existance of a customer id
      setFormState(val) {
        if (val){
          this.isForm = true;
          this.isSearch = false;
          this.isInfo = false;
          if (this.customer.id) {
            this.header = "Edit Customer Details";
          } else {
            this.header = "Add New Customer";
            this.setBestFocus();
          }
        } else if (this.id == null || this.id == 0 || this.customer.id == 0){
          this.isForm = false;
          this.isSearch = true;
          this.isInfo = false;
          this.search = [];
          this.fuseList = [];
          this.searchList = null;
          this.header = "Customer Lookup";
          this.customer.fname = null;
          this.customer.lname = null;
          this.customer.phone = null;
          this.customer.email = null;
          this.customer.addr_st = null;
          this.customer.addr_city = null;
          this.customer.addr_prov = null;
          this.customer.addr_postal = null;
          this.customer.addr_country = null;
          this.customer.note = null;
          this.customer.id = null;
        } else {
          this.isForm = false;
          this.isSearch = false;
          this.isInfo = true;
          this.header = "Customer Details";
        }
        
      },

      //For use with search appended icon callback function
      newCustomerForm() {
        var temp = this.search;
        var first = "";
        var last = "";
        if (temp != null && temp.includes(" ")) {
          first = temp.split(" ")[0];
          last = temp.split(" ")[1]
        } else if (temp != null ) {
          first = temp;
        }
        if (first.length > 0) this.customer.fname = first;
        if (last.length > 0) this.customer.lname = last;
        this.setFormState(true);

      },

      //Saves new customer to DB
      storeCustomer() {
        this.loading = true;        
        this.$http.post(this.store.serverURL +  '/customers/store', this.customer)
          .then((response) => {
            this.customer.id = response.data;
            this.setFormState(false);
            //Empty search list so new customer will show up
            this.searchList = null;
            this.$emit('newCustomer');
            this.$emit('update:id', response.data);
            this.loading = false;            
          })
          .catch((error) => {
            this.store.setAlert(true, "error", error.message);
            this.loading = false;
            console.log(error);                        
          });
      },

      //Updates the customer with current information
      updateCustomer() {
        this.loading = true;        
        this.$http.post(this.store.serverURL +  '/customers/update', this.customer)
          .then((response) => {
            this.setFormState(false);
            this.loading = false;            
          })
          .catch((error) => {
            this.loading = false;
            console.log(error);
          });
      },

      //Clears customer data and updates parent that there is no customer selected
      clearCustomer() {
        this.customer.fname = null;
        this.customer.lname = null;
        this.customer.phone = null;
        this.customer.email = null;
        this.customer.addr_st = null;
        this.customer.addr_city = null;
        this.customer.addr_prov = null;
        this.customer.addr_postal = null;
        this.customer.addr_country = null;
        this.customer.note = null;
        this.customer.id = 0;
        this.$emit('update:id', 0);
        this.setFormState(false);
        this.fuseList = [];
        this.searchSelect = null;
        
      },
      clearForm() {
        if(this.customer.id == null) {
          this.customer.fname = null;
          this.customer.lname = null;
          this.customer.phone = null;
          this.customer.email = null;
          this.customer.addr_st = null;
          this.customer.addr_city = null;
          this.customer.addr_prov = null;
          this.customer.addr_postal = null;
          this.customer.addr_country = null;
          this.customer.note = null;
          this.customer.id = null;
          this.fuseList = [];
          this.searchSelect = null;
        }
        this.setFormState(false);
      },
      getCustomer(id) {
        if (id == 0) return;
        this.customer.id = id;
        this.loading = true;
        this.isSearch = false;                    
        this.$http.post(this.store.serverURL +  '/customers/show', this.customer)
          .then((response) => {
            this.customer.fname = response.data[0].fname;
            this.customer.lname = response.data[0].lname;
            this.customer.phone = response.data[0].phone;
            this.customer.email = response.data[0].email;
            this.customer.addr_st = response.data[0].addr_st;
            this.customer.addr_city = response.data[0].addr_city;
            this.customer.addr_prov = response.data[0].addr_prov;
            this.customer.addr_postal = response.data[0].addr_postal;
            this.customer.addr_country = response.data[0].addr_country;
            this.customer.note = response.data[0].note;
            this.setFormState(false);
            this.loading = false;                        
          })
          .catch((error) => {
            this.loading = false;
            console.log(error);
          });
      },
      checkPage() {
        if (this.$route.name.toLowerCase().includes("job")) {
          return 'job';
        }
        if (this.$route.name.toLowerCase().includes("credit")) {
          return 'credit';
        }
      }
    },

    mounted() {
      if (this.id !== null) {
        this.getCustomer(this.id);
      }
      else {
        this.setFormState(false);
      }
        
    },
    computed: {
      store() {
          return this.$root.$data.store;
      },
      hasAddress() {
        if (this.customer.addr_st != null) return true;
        if (this.customer.addr_city != null) return true;
        if (this.customer.addr_prov != null) return true;
        if (this.customer.addr_postal != null) return true;
        if (this.customer.addr_country != null) return true;
      }
    }

  }
</script>