<template>
    <v-flex xs12 md3>
        <transition name="component-fade" appear>          
        <v-card class="">
            <!-- <v-toolbar color="indigo" dark clipped-left flat>
                <v-toolbar-title>Recent Jobs</v-toolbar-title>
            </v-toolbar> -->
        <v-card-title  class="headline mt-0">Recent Jobs</v-card-title>
        <v-list dense>
            <template v-for="(job, index) in jobs">
                <v-list-tile
                ripple
                :key="job.id + '-key'"
                :href="'#/job/' + job.id"
                avatar
                >
                <v-list-tile-avatar>
                    <img v-if="job.job_images[0]" :src="'http://127.0.0.1:8080' + job.job_images[0].image">
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>
                            Customer: {{job.customer.fname}} {{job.customer.lname}} Employee: {{employeeList[job.employee_id - 1]}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary">Job #{{ job.id }} Date: {{job.created_at}}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>Est: ${{ job.estimate }}</v-list-tile-sub-title>
                </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index + 1 < jobs.length" :key="job.id"></v-divider>
            </template>
        </v-list>
        </v-card>
        </transition>       
    </v-flex>
</template>

<script>
export default {
  data: () => ({
    jobs: [],
    employeeList: []
  }),
  methods: {
    getJobList() {
      this.$http
        .get(this.store.serverURL + "/jobs/recentJobsList")
        .then(response => {
          this.jobs = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    setId(val) {
      this.id = Number(val);
    },

    getEmployees() {
    this.$http.get(this.store.serverURL +  '/employees/active')
        .then((response) => {
            response.data.forEach(element => {
              this.employeeList.push(element.name);
            });
            // this.employeeList = response.data;
            this.getJobList();
        })
        .catch((error) => {
            console.log(error);
        });
    },
  },

  props: {
    id: Number
  },
  mounted() {
    // this.getJobList();
    this.getEmployees();
  },
  computed: {
      store() {
          return this.$root.$data.store;
      }
  }   
};
</script>