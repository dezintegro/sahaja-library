<template>
  <div id="app">
    <v-app dark>
      <!--      <v-content>-->
      <!--        <v-container>-->
      <router-view/>
      <!--        </v-container>-->
      <!--      </v-content>-->
      <NotificationsManager></NotificationsManager>
    </v-app>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import NotificationsManager from '@/components/NotificationsManager.vue';


  @Component({
    components: {
      NotificationsManager,
    },
  })
  export default class App extends Vue {
  }
</script>
<style>
  .highlightText {
    background: lightgray;
    /*color: white;*/
  }

</style>
