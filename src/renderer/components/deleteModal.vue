<template>
    <v-dialog v-model="modalData" max-width="500px">
        <v-card>
            <v-toolbar color="white" clipped-left flat>
                <v-toolbar-title>
                    <v-icon class="mr-2">warning</v-icon> Delete {{objectName}}
                    <v-btn class="pr-0 cb-close-modal-btn" flat absolute color="grey" @click.stop="emitCloseModal()"><v-icon>close</v-icon></v-btn>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <p class="lighten-2">Are you sure you want to delete this {{objectType}}? <br>
                <span v-if="final">This action can not be undone</span></p>
            </v-card-text>
            <v-card-actions class="pt-3 pb-3 text-xs-right cb-delete-modal-actions ">
                <v-flex>
                <v-btn flat class="text-none" color="grey" @click.stop="emitCloseModal()">
                    Cancel
                </v-btn>
                <v-btn class="ml-2 text-none" color="error" @click.stop="emitDeleteId()">
                    Delete
                </v-btn>
                </v-flex>
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
        'modal',
        'final'
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