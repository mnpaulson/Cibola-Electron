<template>
    <div>
        <div v-show="idSet">
            <custom-sheet-form :customSheet_id.sync="customSheet_id"></custom-sheet-form>
        </div>
        <v-btn v-show="!idSet" color="primary" :href="'#/customsheet/0'">
            <v-icon>add</v-icon>
            New Custom Sheet
        </v-btn>
    </div>
</template>

<script>
export default {
    data: () => ({
        customSheet_id: null,
    }),
    methods: {


    },

    props: {

    },
    mounted() {
        this.customSheet_id = null;
        //If customsheet ID 0 then no customsheet, used for linking with customer ID set
        //Only preset customer ID if customSheet is 0
        if (isNaN(Number(this.$route.params.id))); //Do Nothing
        else if (Number(this.$route.params.id) !== 0) {
            this.customSheet_id = Number(this.$route.params.id);
            this.$forceUpdate();
        }
    },
    computed: {
        store() {
            return this.$root.$data.store;
        },
        idSet() {
            return (this.customSheet_id === null) ? false : true; 
        }

    },
    watch: {
        // Handle changing between customer view and no customer selected
        '$route'(to, from) {
            console.log(to);
            // if (!to.params.id) this.customSheet_id = null;
            // else this.customSheet_id = Number(to.params.id);
            if (isNaN(Number(to.params.id))) {
                this.customSheet_id = null
            } else {
                // this.$nextTick(() => {this.customSheet_id = Number(to.params.id)});
                this.customSheet_id = Number(to.params.id);
            }
        },
    }
};
</script>