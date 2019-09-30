<template>
    <div>
        <v-layout row wrap v-show="customer_id !== null || customSheet_id !== null">
            <customer-form :id.sync="customer_id"></customer-form>
        </v-layout>  
    <custom-sheet-form v-show="customer_id !== null || customSheet_id !== null" :customSheet_id.sync="customSheet_id" :customer_id.sync="customer_id" v-on:customerId="setCustomerId"></custom-sheet-form>
    <v-btn v-show="customer_id === null && customSheet_id === null" color="primary" :href="'#/customsheet/0/0'">
        <v-icon>add</v-icon>
        New Custom Sheet
    </v-btn>
    </div>
</template>

<script>
export default {
    data: () => ({
        customer_id: null,
        customSheet_id: null,

    }),
    methods: {
        setCustomerId(id) {
            this.customer_id = id;
        },

    },

    props: {

    },
    mounted() {
        //If chustomsheet ID 0 then no customsheet, used for linking with customer ID set
        //Only preset customer ID if customSheet is 0
        if (isNaN(Number(this.$route.params.id))); //Do Nothing
        else if (Number(this.$route.params.id) !== 0) this.customSheet_id = Number(this.$route.params.id);
        else this.customer_id = Number(this.$route.params.cus);
    },
    computed: {
        store() {
            return this.$root.$data.store;
        },

    },
    watch: {
        // Handle changing between customer view and no customer selected
        '$route'(to, from) {
            // if (!to.params.id) this.customSheet_id = null;
            // else this.customSheet_id = Number(to.params.id);
            if (isNaN(Number(to.params.id))) {
                this.customSheet_id = null
                this.customer_id = null;
            } else if (Number(to.params.id) !== 0) this.customSheet_id = Number(to.params.id);
            else this.customer_id = Number(to.params.cus);
        },
    }
};
</script>