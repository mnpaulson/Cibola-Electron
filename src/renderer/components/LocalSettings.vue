<template>
        <v-flex xs12 sm6>
        <v-card>
            <v-toolbar color="indigo" dark clipped-left flat>
                <v-toolbar-title>Local Settings</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-text-field label="Server Address" v-model="serverURL" xs12></v-text-field>
                <v-text-field label="Camera Width" v-model="cameraWidth" xs6></v-text-field>
                <v-text-field label="Camera Height" v-model="cameraHeight" xs6></v-text-field>
            </v-card-text>
            <v-card-text>
                <v-btn small color="primary" @click="saveSettings">Save</v-btn>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
const { app } = require('electron');
const settings = require('electron-settings');

    export default {
        data: () => ({
            serverURL: null,
            cameraWidth: null,
            cameraHeight: null
        }),
        methods: {
            saveSettings() {
                settings.set('serverURL', this.serverURL);
                settings.set('camera.width', this.cameraWidth);
                settings.set('camera.height', this.cameraHeight);
                this.store.serverURL = settings.get('serverURL');
                this.store.camera.width = settings.get('camera.width');
                this.store.camera.height = settings.get('camera.height');
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
        },
        computed: {
            store() {
                return this.$root.$data.store;
            }
        }   
    }
</script>
