<template>
    <v-flex xs12 sm12>
        <v-card color="blue" v-cloak @drop.prevent="addFile" @dragover.prevent>
			<v-layout  mt-2>
				<v-flex d-flex class="xs6">
					<v-btn outline dark @click="emitCapture">
					<v-icon>camera_alt</v-icon>
					</v-btn>
				</v-flex>
				<v-flex d-flex class="xs6">
					<v-btn @click="fileSelect" outline dark style="border-style: dashed">
					<v-icon>file_upload</v-icon>
					</v-btn>
				</v-flex>
			</v-layout>
			<input ref="fileInput" id="fileInput" type="file" style="display: none" @change="addFile($event)">
        </v-card>
    </v-flex>
</template>


<script>
const sharp = require('sharp')

export default {
	data: () => ({
		file: null,
		img: null,
		final: {path: null, image: null, id: null, note:null},
		ready: false,
		imageQuality: 75
	}),
	watch: {
	},
	methods: {
		addFile(e) {
			var buffer;
			let droppedFile;
			let selectedFile;
			console.log(e);
			if (e.dataTransfer) droppedFile = e.dataTransfer.files[0];
			else if (e.target) droppedFile = e.target.files[0];

			
			if (!droppedFile && !selectedFile) return;
			if (droppedFile) this.img = droppedFile;

			console.log(this.img);
			
			var fileReader = new FileReader();

			fileReader.addEventListener("load", () => {
				buffer = fileReader.result;
				this.processFile(buffer);
			}, false);

			fileReader.readAsDataURL(this.img);
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
					this.emitFile();
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
	computed: {}
};
</script>
