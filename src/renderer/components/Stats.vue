<template>
    <v-flex xs12 md3>
        <transition name="component-fade" appear>          
        <v-card class="">

        </v-card>
        </transition>       
    </v-flex>
</template>

<script>
export default {
  data: () => ({
      stats: null
  }),
  methods: {
    getStats() {
      this.$http
        .get(this.store.serverURL + "/jobs/stats")
        .then(response => {
          this.stats = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
  },

  props: {

  },
  mounted() {
      this.getStats();
  },
  computed: {
      store() {
          return this.$root.$data.store;
      }
  }   
};
</script>