<template>
    <v-toolbar color="indigo" dark fixed app clipped-left>
    <v-btn icon @click.stop="browserBack()">
      <v-icon>arrow_back</v-icon>
    </v-btn>
      <v-toolbar-title>{{ store.toolbarText }}</v-toolbar-title>
    </v-toolbar>
</template>

<script>

  export default {
    data: () => ({
        titleText: ""
    }),
    props: {

    },
    methods: {
        browserBack() {
            window.history.back();
        }

    },
    mounted() {

    },
    watch: {
        '$route' (to, from) {
            this.store.setToolbarText(to.name.charAt(0).toUpperCase() + to.name.slice(1));
        }
    },
    computed: {
      store() {
          return this.$root.$data.store;
      }
    }   
  }
</script>