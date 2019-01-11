<template>
    <div>
      <v-flex xs12 sm2>
        <v-card>
            <v-toolbar color="indigo" dark clipped-left flat>
                <v-toolbar-title>Version: 0.0.8</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              {{message}}
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click.stop="checkForUpdates()">
                    Check for Updates
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-flex>

      <v-dialog v-model="updateDialog" max-width="500px">
        <v-card>
          <v-toolbar color="success" dark clipped-left flat>
              <v-toolbar-title><v-icon>warning</v-icon>Update Avaliable</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              An update is avaliable, download and install update?
          </v-card-text>
          <v-card-actions>
              <v-btn color="error"  @click.stop="update()">
                  <v-icon>delete</v-icon>
                  Update
              </v-btn>                    
              <v-btn color="primary" right absolute @click.stop="jobDeleteDialog=false">
                  <v-icon>cancel</v-icon>
                  Cancel
                  </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="noUpdateDialog" max-width="500px">
        <v-card>
          <v-toolbar color="primary" dark clipped-left flat>
              <v-toolbar-title><v-icon>warning</v-icon>No Update Avaliable</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              There are currently no updates avaliable
          </v-card-text>
          <v-card-actions>                  
              <v-btn color="primary" right absolute @click.stop="noUpdateDialog=false">
                  <v-icon>cancel</v-icon>
                  Okay
                  </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
const { app, ipcRenderer } = require('electron');

export default {
  data: () => ({
    updateDialog: false,
    noUpdateDialog: false,
    message: null
  }),
  methods: {
    checkForUpdates() {
      ipcRenderer.send('update-control', 'checkForUpdates')
    },
    update() {
      ipcRenderer.send('update-control', 'update')
    }
  },
  created() {
    ipcRenderer.on('update-control', (event, arg) => {
      console.log(arg) // prints "pong"
      if(arg == 'No update avaliable') noUpdateDialog = true;
      if(arg == 'Update Avaliable') updateDialog = true;
    })
    ipcRenderer.on('update-message', (event, arg) => {
      this.message = arg;
    })
  }
}
</script>