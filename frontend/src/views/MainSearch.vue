<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
            <v-text-field autofocus @keyup.enter="onSend" v-model="searchQuery" prepend-inner-icon="search" name="searchQuery"
                          type="text">
            </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {appName} from '@/env';
import {dispatchSearch} from '@/store/main/actions';
import router from '@/router';

@Component
export default class MainSearch extends Vue {
  public searchQuery: string = '';
  public appName = appName;

  public onSend() {
    // dispatchSearch(this.$store, {query: this.searchQuery});
    router.push({name: 'searchResult', params: {query: this.searchQuery}});
  }
}
</script>

<style scoped>

</style>
