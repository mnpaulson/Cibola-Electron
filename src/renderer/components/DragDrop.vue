<template>
    <v-flex xs12 sm12>
        <v-card color="blue" v-cloak @drop.prevent="addFile" @dragover.prevent>
			<v-layout  mt-2>
				<v-flex d-flex class="xs6">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" @click="captureDialog = !captureDialog" outline dark style="width:100%">
								<v-icon>camera_alt</v-icon>
							</v-btn>
						</template>
						<span>Capture image from webcam</span>
					</v-tooltip>
				</v-flex>
				<v-flex d-flex class="xs6">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" @click="fileSelect" outline dark style="border-style: dashed; width:100%">
								<v-icon>file_upload</v-icon>
							</v-btn>
						</template>
						<span>Drag image file here</span>
					</v-tooltip>
				</v-flex>
			</v-layout>
			<input ref="fileInput" multiple id="fileInput" type="file" style="display: none" @change="addFile($event)">
        </v-card>
		<v-dialog v-model="captureDialog" transition="dialog-transition" fullscreen >
            <v-card>
                <div class="capture-cont">
                    <video ref="videoDisplay" id="videoDisplay" autoplay playsinline :width="store.camera.width" :height="store.camera.height"></video>
                    <canvas v-show="false" ref="img" id="img" :width="store.camera.width" :height="store.camera.height"></canvas>
                </div>
                <v-layout row wrap>
                    	<v-flex xs2></v-flex>
                    	<v-flex d-flex xs4>
                        	<v-btn outline color="primary" @click="saveImage()">Capture</v-btn>
						</v-flex>
                    	<v-flex d-flex xs4>
	                        <v-btn outline color="error" @click="captureDialog = !captureDialog">discard</v-btn>
						</v-flex>
                    	<v-flex xs2></v-flex>
                </v-layout>
                <v-layout row wrap justify-center=true>
                    <v-flex xs4 mr-1>
                        <v-card-title class="justify-center mb-0 pb-0">Camera Select</v-card-title>
						<v-select
							:items="deviceList"
							label="Category"
							v-model="videoDeviceId"
						></v-select>
					</v-flex>
                    <v-flex xs4>
                        <v-card-title class="justify-center">Image Quality</v-card-title>
                        <v-slider
                            v-model="imageQuality"
                            :step="5"
                            thumb-color="blue"
                            thumb-label="always"
                        ></v-slider>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
    </v-flex>
</template>


<script>
const sharp = require('sharp');
const settings = require('electron-settings');


export default {
	data: () => ({
		file: null,
		img: null,
		final: {path: null, image: null, id: null, note:null},
		ready: false,
		imageQuality: 75,
		captureDialog: false,
		deviceList: [],
		videoDeviceId: null,
		video: {},
		videoDisplay: {}
	}),
	watch: {
		videoDeviceId(d) {
			settings.set('cameraDevice', d);
			this.toggleVideo();
		}
	},
	methods: {
		addFile(e) {
			var buffer;
			let i = 0;
			let droppedFiles;
			let selectedFile;
			console.log(e);
			//If dropped file
			if (e.hasOwnProperty('dataTransfer')) droppedFiles = e.dataTransfer.files;
			//If selected file
			else if (e.target) droppedFiles = e.target.files;

			if (!droppedFiles.length > 0 && !selectedFile.length > 0) return;

			var fileReader = new FileReader();

			fileReader.addEventListener("load", () => {
				buffer = fileReader.result;
				this.processFile(buffer);
				i++;
				if (i < droppedFiles.length) fileReader.readAsDataURL(droppedFiles[i]);
			}, false);

			fileReader.readAsDataURL(droppedFiles[i]);

		},
		processFile(buffer) {
			var meta = buffer.substr(0, buffer.indexOf(',') + 1);
			let imgBuffer = Buffer.from(buffer.substr(buffer.indexOf(',') + 1), 'base64');
			sharp(imgBuffer)
				// .png()
				.jpeg({
					quality: this.imageQuality
				})
				.toBuffer()
				.then(data => {
					this.final = {
						image: meta + data.toString("base64"),
						note: null,
						id: null
					};
					console.log(this.final);
					this.emitFile();
				});
		},
		saveImage() {
                this.img = this.$refs.img;
				var context = img.getContext('2d');
				context.drawImage(this.videoDisplay, 0, 0, this.store.camera.width, this.store.camera.height);
                var buffer = this.img.toDataURL("image/png");
                var meta = buffer.substr(0, buffer.indexOf(',') + 1);
                let imgBuffer = Buffer.from(buffer.substr(buffer.indexOf(',') + 1), 'base64');
                sharp(imgBuffer)
                    .jpeg({quality: this.imageQuality})
                    .toBuffer()
                    .then(data => {
                        this.final = {
                            image: meta + data.toString("base64"),
                            note: null,
                            id: null
                        };
						console.log(this.final);
						this.emitFile();
                    });
                this.img = null;
                this.captureDialog = false;
		},
		toggleVideo() {
			if (this.videoDisplay.srcObject != null) {
				let tracks = this.videoDisplay.srcObject.getTracks();
				for (let i = 0; i < tracks.length; i++) {
					tracks[i].stop();
				}
			}
			console.log(this.videoDeviceId);
			//This one works with at leat one camera
			// var constraints = {
			// 	video: { video: { deviceId: { exact: this.videoDeviceId } } }
			// };
			var constraints = {
				'audio': false,
				'video': {
					'deviceId': this.videoDeviceId
					}
        		}
			// var constraints = {video: true};

			navigator.mediaDevices.getUserMedia(constraints).then(stream => {
				try {
					this.videoDisplay.srcObject = stream;
				} catch (error) {
					this.videoDisplay.src = URL.createObjectURL(stream);
					console.log('Could not create video stream');
					this.img = "img/webcamError.png";
				}
			}).catch(handleError =>{
				console.log(handleError);
			});
		},
		emitFile() {
			this.$emit('imageUpload', this.final);

		},
		emitCapture() {
			this.$emit('capture');
		},
		fileSelect() {
			this.$refs["fileInput"].click();
		}
	},
	mounted() {
		this.videoDisplay = this.$refs.videoDisplay;


		navigator.mediaDevices.enumerateDevices().then(d => {
			for (let i = 0; i < d.length; i++) {
				if (d[i].kind == 'videoinput') this.deviceList.push({text: d[i].label, value: d[i].deviceId});
			}
			this.videoDeviceId = this.store.cameraDevice;
			console.log(this.store.cameraDevice);
		});
	},
	computed: {
		store() {
			return this.$root.$data.store;
		}
	},
	beforeDestroy() {
		if (this.videoDisplay.srcObject != null) {
			let tracks = this.videoDisplay.srcObject.getTracks();
			for (let i = 0; i < tracks.length; i++) {
				tracks[i].stop();
			}
		}
	}
};
</script>
