<template>
  <div>
    <div class="display-1 mb-4" @click="employee = !employee">
      <v-icon v-if="!employee" large class="mr-2">keyboard_arrow_right</v-icon>
      <v-icon v-if="employee" large class="mr-2">keyboard_arrow_down</v-icon>
      Employee Settings
    </div>
    <employee-form v-show="employee"></employee-form>
    <div class="display-1 mt-4" @click="settings = !settings">
      <v-icon v-if="!settings" large class="mr-2">keyboard_arrow_right</v-icon>
      <v-icon v-if="settings" large class="mr-2">keyboard_arrow_down</v-icon>
      Local Settings
    </div>
    <local-settings v-show="settings"></local-settings>
    <div class="display-1 mt-4" @click="values = !values">
      <v-icon v-if="!values" large class="mr-2">keyboard_arrow_right</v-icon>
      <v-icon v-if="values" large class="mr-2">keyboard_arrow_down</v-icon>
      Custom Values
    </div>
    <value-config v-show="values"></value-config>
  </div>
</template>

<script>

  export default {
    data: () => ({
      employee: false,
      settings: false,
      values: false
    }),
    props: {

    },
    methods: {

    },
    mounted() {

    },
    watch: {

    },
    computed: {

    }   
  }
</script>
