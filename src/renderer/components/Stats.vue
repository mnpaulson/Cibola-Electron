<template>
    <transition name="component-fade" appear v-if="stats.monthJobs.length > 0">          
        <!-- <v-layout> -->
        <v-flex xs12 md6>
            <v-flex xs12 md6 pt-0>
                    <v-card
                        class="mx-auto text-xs-center"
                        dark
                    >
                        <v-card-text class="headline">
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            ${{stats.monthTotals[11].toLocaleString()}}
                        </v-sheet>
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            <v-icon class="padding-bottom-3px pr-1">work</v-icon>{{stats.monthJobs[11].toLocaleString()}}
                        </v-sheet>
                        </v-card-text>

                        <v-card-text>
                        <div class="display-1 font-weight-thin">{{stats.monthNames[11]}}</div>
                        </v-card-text>
                    </v-card>
            </v-flex>
            <v-flex xs12 md6 class="padding-top-8px">
                    <v-card
                        class="mx-auto text-xs-center"
                        dark
                    >
                        <v-card-text class="headline">
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            ${{stats.monthTotals[10].toLocaleString()}}
                        </v-sheet>
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            <v-icon class="padding-bottom-3px pr-1">work</v-icon>{{stats.monthJobs[10].toLocaleString()}}
                        </v-sheet>
                        </v-card-text>

                        <v-card-text>
                        <div class="display-1 font-weight-thin">{{stats.monthNames[10]}}</div>
                        </v-card-text>
                    </v-card>
            </v-flex>
            <v-flex xs12 md6 class="padding-top-8px">
                    <v-card
                        class="mx-auto text-xs-center"
                        dark
                    >
                        <v-card-text class="headline">
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            ${{currentQuarter.toLocaleString()}}
                        </v-sheet>
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            <v-icon class="padding-bottom-3px pr-1">work</v-icon>{{currentQuarterJobs.toLocaleString()}}
                        </v-sheet>
                        </v-card-text>

                        <v-card-text>
                        <div class="display-1 font-weight-thin">Quarter</div>
                        </v-card-text>
                    </v-card>
            </v-flex>
            <v-flex xs12 md6 class="padding-top-8px">
                    <v-card
                        class="mx-auto text-xs-center"
                        dark
                    >
                        <v-card-text class="headline">
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            ${{previousQuarter.toLocaleString()}}
                        </v-sheet>
                        <v-sheet color="rgba(0, 0, 0, .12)">
                            <v-icon class="padding-bottom-3px pr-1">work</v-icon>{{previousQuarterJobs.toLocaleString()}}
                        </v-sheet>
                        </v-card-text>

                        <v-card-text>
                        <div class="display-1 font-weight-thin">Prev Quarter</div>
                        </v-card-text>
                    </v-card>
            </v-flex>
        </v-flex>
        <!-- </v-layout> -->
    </transition>       
</template>

<script>
export default {
  data: () => ({
      stats: {
          monthTotals: [],
          monthNames: [],
          monthJobs: []
      }
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
      },
      currentQuarter() {
          var total = 0;
          for (var i = 11; i > 9; i--) {
            var m = this.stats.monthNames[i];
            var quarterEnds = ['July', 'April', 'January', 'October']
            total += this.stats.monthTotals[i];
            if (quarterEnds.includes(m)) {
                i = 0;
            }
          }
          return total;
      },
      previousQuarter() {
        var total = 0;
        var previous = false;
        for (var i = 11; i > 6; i--) {
            var m = this.stats.monthNames[i];
            var quarterEnds = ['July', 'April', 'January', 'October']
            total += this.stats.monthTotals[i];
            if (quarterEnds.includes(m)) {
                if (previous) {
                    i = 0;
                } else {
                    previous = true;
                }
            }
        }
        return total;
      },
      currentQuarterJobs() {
        var total = 0;
          for (var i = 11; i > 9; i--) {
            var m = this.stats.monthNames[i];
            var quarterEnds = ['July', 'April', 'January', 'October']
            total += this.stats.monthJobs[i];

            if (quarterEnds.includes(m)) {
                i = 0;
            }
          }
          return total;
      },
      previousQuarterJobs() {
        var total = 0;
        var previous = false;
        for (var i = 11; i > 6; i--) {
            var m = this.stats.monthNames[i];
            var quarterEnds = ['July', 'April', 'January', 'October']
            total += this.stats.monthJobs[i];
            if (quarterEnds.includes(m)) {
                if (previous) {
                    i = 0;
                } else {
                    previous = true;
                }
            }
        }
        return total;
      }
  }   
};
</script>