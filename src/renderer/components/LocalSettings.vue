<template>
        <v-flex xs12 sm6 mt-4>
        <v-card class="pt-4">
            <v-card-text>
                <v-text-field label="Server Address" v-model="serverURL" xs12></v-text-field>
                <v-text-field label="Camera Width" v-model="cameraWidth" xs6></v-text-field>
                <v-text-field label="Camera Height" v-model="cameraHeight" xs6></v-text-field>
                <v-select :items="printerNames" label="Job Printer" v-model="jobPrinter"></v-select>
                <v-select :items="printerNames" label="Gold Credit Printer" v-model="creditPrinter"></v-select>
            </v-card-text>
            <v-card-text>
                <v-btn small color="primary" @click="saveSettings">Save</v-btn>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
const { app } = require('electron');
const { remote, BrowserWindow } = require('electron')
const settings = require('electron-settings');

    export default {
        data: () => ({
            serverURL: null,
            cameraWidth: null,
            cameraHeight: null,
            jobPrinter: null,
            creditPrinter: null,
            printers: [],
            printerNames: []
        }),
        methods: {
            saveSettings() {
                settings.set('serverURL', this.serverURL);
                settings.set('camera.width', this.cameraWidth);
                settings.set('camera.height', this.cameraHeight);
                settings.set('printers.job', this.jobPrinter);
                settings.set('printers.credit', this.creditPrinter);
                this.store.serverURL = settings.get('serverURL');
                this.store.camera.width = settings.get('camera.width');
                this.store.camera.height = settings.get('camera.height');
                this.store.printers.job = settings.get('printers.job');
                this.store.printers.credit = settings.get('printers.credit');
            }
        },
        mounted() {
            if (!settings.has('serverURL')){
                settings.set('serverURL', 'localhost');
            }

            this.serverURL = settings.get('serverURL');

            if (!settings.has('camera')) {
                settings.set('camera', {height: '1024', width: '1280'});
            }

            this.cameraWidth = settings.get('camera.width');
            this.cameraHeight = settings.get('camera.height');
            this.jobPrinter = settings.get('printers.job');
            this.creditPrinter = settings.get('printers.credit');
            
            var currentWindow = remote.getCurrentWindow()

            this.printers = currentWindow.webContents.getPrinters();
            this.printers.forEach((printer) =>{
                this.printerNames.push(printer.name);
            })
        },
        computed: {
            store() {
                return this.$root.$data.store;
            }
        }   
    }
</script>
