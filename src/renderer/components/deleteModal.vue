<template>
    <v-dialog v-model="modalData" max-width="500px">
        <v-card>
            <v-toolbar color="error" dark clipped-left flat>
                <v-toolbar-title>
                    <v-icon>warning</v-icon> Delete {{objectName}}
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                Are you sure you want to delete this {{objectType}}? <br>
                <br>
                This action is not reversable
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" @click.stop="emitDeleteId()">
                    <v-icon>delete</v-icon>
                    Delete
                </v-btn>
                <v-btn color="primary" right absolute @click.stop="emitCloseModal()">
                    <v-icon>cancel</v-icon>
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    data: () => ({
        modalData: false
    }),
    props: [
        'objectName',
        'objectType',
        'modal'
    ],
    methods: {
        emitDeleteId() {
            this.$emit('delete');
        },
        emitCloseModal() {
            this.modalData = false;
            this.$emit('close');
        }
    },
    watch: {
        modal: {
            immediate: true,
            handler(val, oldVal) {
                this.modalData = val;
            }
        },
        modalData(val) {
            if (!val) this.emitCloseModal();
        }
    }
}
</script>