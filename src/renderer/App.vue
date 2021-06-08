<template>
  <v-app id="inspire">
    <!-- <toolbar></toolbar> -->
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
      dark
      clipped
      :mini-variant=navmini
      width="200"
      class="blue lighten-2"
    >
      <v-list dense class="cdb-app-drawer" style="padding-top: 0px">
        <v-list-tile style="background-color: #2196f3; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); cursor:pointer" dark >
            <v-list-tile-action @click.stop="browserBack()">
                <v-icon large>arrow_back</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title style="color: white">Back</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'home' }" :exact="true">
            <v-list-tile-action>
                <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'jobs'}">
          <v-list-tile-action>
            <v-icon>work</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Jobs</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'Gold Credits' }">
          <v-list-tile-action>
            <v-icon>credit_card</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Gold Credits</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
          <v-list-tile :to="{ name: 'customsheets' }">
          <v-list-tile-action>
            <v-icon>list_alt</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Custom Sheets</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'customers' }">
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Customers</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-list-tile :to="{ name: 'employee' }">
          <v-list-tile-action>
            <v-icon>folder</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Employee</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile> -->
        <v-list-tile :to="{ name: 'admin' }">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Admin</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="cursor:pointer" @click=toggleNavmini>
          <v-list-tile-action>
            <v-icon v-if=navmini>chevron_right</v-icon>
            <v-icon v-if=!navmini>chevron_left</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Collapse Navbar</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content style="padding-top: 0px;">
      <v-container fluid grid-list-md pt-2 pl-3>
          <alert></alert>                                
          <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const { app } = require('electron');
const settings = require('electron-settings');



  export default {
    data: () => ({
      drawer: null,
      navmini: true
    }),
    props: {
      source: String
    },
    methods: {
        browserBack() {
            window.history.back();
        },
        toggleNavmini() {
          this.navmini = !this.navmini;
        }
    },
    created() {

      //Local Setting Stuff
      if (!settings.has('serverURL')){
          settings.set('serverURL', 'localhost');
      }
      
      this.store.serverURL = settings.get('serverURL');

      if (!settings.has('camera')) {
          settings.set('camera', {height: '1024', width: '1280'});
      }

      if(!settings.has('printers')) {
          settings.set('printers', {job: '', credit: '', custom: ''});
      }

      this.store.camera.width = settings.get('camera.width');
      this.store.camera.height = settings.get('camera.height');
      this.store.printers.job = settings.get('printers.job');
      this.store.printers.credit = settings.get('printers.credit');
      this.store.printers.custom = settings.get('printers.custom');

    },
    computed: {
      store() {
          return this.$root.$data.store;
      }
    }   
  }
</script>


<style lang="scss">
</style>

