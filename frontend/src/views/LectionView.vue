<template>
  <v-content tabindex="-1" @keyup.enter="nextHighlight" @keyup.left="prevHighlight">
          <vue-scroll-progress-bar height="0.5rem"/>
    <v-container>
      <v-card outlined v-if="lection">
        <v-card-title class="display-1">{{ lection.title }}</v-card-title>
        <v-card-subtitle> {{ lection.city }} {{ lection.year }}</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text class="lection-text" @mouseup="getSelectionText"
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
      console.log(document.onkeydown)
      document.onkeydown = this.onKeyDown
      const lection = getCurrentLection(this.$store);
      const lectionId = Number(this.$route.params.lectionId);
      if (!lection || lection.id !== lectionId) {
        dispatchGetLection(this.$store, {lectionId});
      }
    }

    public destroyed() {
      console.log('Destoryed')
      document.onkeydown = null
    }

    public onKeyDown(e){
      if (e.code === "ArrowRight") {
        console.log(e.code)
        this.nextHighlight()
      }
      if (e.code === "ArrowLeft") {
        this.prevHighlight()
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

  .lection-text {
    color: black;
    font-size: large;
    padding: 20px 30px;
  }
</style>
