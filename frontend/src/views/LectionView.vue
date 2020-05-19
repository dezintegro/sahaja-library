<template>
  <v-content>
    <v-container>
      <v-card outlined v-if="lection">
        <v-card-title class="display-1">{{ lection.title }}</v-card-title>
        <v-card-subtitle> {{ lection.city }} {{ lection.year }}</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text @mouseup="getSelectionText" class="body-1 mt-1"
                     v-html="highlightSearch(lection.content_ru, String($route.query.highlight))">
        </v-card-text>
      </v-card>
    </v-container>
    <v-layout column class="fab-container">
      <v-btn fab @click="prevHighlight">
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
      <v-btn fab @click="nextHighlight">
        <v-icon>keyboard_arrow_down</v-icon>
      </v-btn>
    </v-layout>
  </v-content>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {appName} from '@/env';
  import {getCurrentLection} from '@/store/main/getters';
  import {dispatchGetLection} from '@/store/main/actions';
  import SearchHighlightMixin from '@/mixins/text-highlight-mixin';

  @Component
  export default class LectionView extends SearchHighlightMixin {
    public appName = appName;
    public highlightIdx = -1;

    public created() {
      const lection = getCurrentLection(this.$store);
      const lectionId = Number(this.$route.params.lectionId);
      if (!lection || lection.id !== lectionId) {
        dispatchGetLection(this.$store, {lectionId});
      }
    }

    get lection() {
      return getCurrentLection(this.$store);
    }

    public nextHighlight() {
      this.$vuetify.goTo(this.getHighlightAnchor(++this.highlightIdx), {offset: 20});
    }

    public prevHighlight() {
      if (this.highlightIdx > 0) {
        this.$vuetify.goTo(this.getHighlightAnchor(--this.highlightIdx), {offset: 20});
      }
    }

    getSelectionText() {
      console.log(window!.getSelection()!.toString());
    }

  }
</script>

<style scoped>
  .fab-container {
    position: fixed;
    bottom: 10px;
    right: 20px;
  }

  .fab-container > .v-btn--fab {
    margin-bottom: 5px;
  }
</style>
