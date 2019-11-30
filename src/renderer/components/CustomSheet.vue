<template>
    <div>
        <div v-show="idSet">
            <custom-sheet-form :customSheet_id="customSheet_id" :customer_id="customer_id"></custom-sheet-form>
        </div>
        <v-btn v-show="!idSet" color="primary" :href="'#/customsheet/0'">
            <v-icon>add</v-icon>
            New Custom Sheet
        </v-btn>
        <div v-if="!idSet">
            <custom-sheet-list v-on:select="updateRoute($event)"></custom-sheet-list>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        customSheet_id: null,
        customer_id: null
    }),
    methods: {
        setCustomSheetId(id) {
            this.customSheet_id = Number(id);
            this.$forceUpdate();
        },
        updateRoute(id) {
            this.$router.push('/customsheet/' + id);
        }
    },

    props: {

    },
    mounted() {
        this.customSheet_id = null;
        //If customsheet ID 0 then no customsheet, used for linking with customer ID set
        //Only preset customer ID if customSheet is 0
        if (isNaN(Number(this.$route.params.id))); //Do Nothing
        else if (Number(this.$route.params.id) !== 0) {
            this.setCustomSheetId(Number(this.$route.params.id));
        }
        if (!isNaN(Number(this.$route.params.cus))) {
            this.customer_id = Number(this.$route.params.cus);
        }
    },
    computed: {
        store() {
            return this.$root.$data.store;
        },
        idSet() {
            return (this.customSheet_id === null && this.customer_id === null) ? false : true; 
        }

    },
    watch: {
        // Handle changing between customer view and no customer selected
        '$route'(to, from) {
            if (isNaN(Number(to.params.id))) {
                this.customSheet_id = null
            } else {
                this.setCustomSheetId(Number(to.params.id));
            }

            // if (!isNaN(Number(to.params.cus))) {
            //     this.customer_id = Number(to.params.cus);
            // }
        },
    }
};
</script>