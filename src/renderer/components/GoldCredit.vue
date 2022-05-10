<template>
    <div>
        <v-layout row wrap v-show="idSet">
            <customer-form :id.sync="customer_id"></customer-form>
        </v-layout>  
        <div v-show="idSet">
            <goldcredit-form :goldcredit_id.sync="goldcredit_id" :customer_id.sync="customer_id" :key="goldcredit_id" v-on:customerId="setCustomerId"></goldcredit-form>
        </div>
        <transition name="component-fade" appear>            
            <div v-if="!idSet">
                <gold-credit-list v-on:select="updateRoute($event)"></gold-credit-list>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data: () => ({
            goldcredit_id: null,
            customer_id: null
        }),
        methods: {
            setGoldCreditId(id) {
                this.goldcredit_id = Number(id);
                this.$forceUpdate();
            },
            setCustomerId(id) {
                this.customer_id = id;
            },
            updateRoute(id) {
                this.$router.push('/goldcredit/' + id);
            }
        },
        watch: {
            // Handle changing between customer view and no customer selected
            '$route' (to, from) {
                if (isNaN(Number(to.params.id))) {
                    this.goldcredit_id = null;
                } else {
                    this.setGoldCreditId(Number(to.params.id));
                }
            }
        },
        mounted() {
            this.goldcredit_id = null;
            //If goldcredit ID 0 then no goldcredit, used for linking with customer ID set
            if (isNaN(Number(this.$route.params.id))); //Do Nothing
            else if (Number(this.$route.params.id) !== 0) {
                this.setGoldCreditId(Number(this.$route.params.id));
            }
            //Check if customer is set
            if (!isNaN(Number(this.$route.params.cus))) {
                this.customer_id = Number(this.$route.params.cus);
            }
        },
        computed: {
            store() {
                return this.$root.$data.store;
            },
            idSet() {
                return (this.goldcredit_id === null && this.customer_id === null) ? false : true; 
            }
        }  
    }
</script>