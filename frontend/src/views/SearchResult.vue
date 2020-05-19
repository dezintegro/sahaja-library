<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-text-field autofocus @keyup.enter="onSearch" v-model="searchQuery" prepend-inner-icon="search"
                      name="searchQuery"
                      type="text">
        </v-text-field>
      </v-flex>
    </v-layout>
    <template v-if="searchResult.length">
      <template v-for="lection in searchResult">
        <router-link class="lection-link" :to="{ name: 'lectionView', params: {lectionId: lection.id}, query: {highlight: searchQuery}}">
          <v-card class="mb-5 lection-cart" outlined :key="lection.id">
            <v-card-title><h3>{{ lection.title }}</h3></v-card-title>
            <v-card-subtitle> {{ lection.city }} {{ lection.year }}</v-card-subtitle>
            <v-card-text v-html="highlightSearch(lection.content_ru, searchQuery)"></v-card-text>
          </v-card>
        </router-link>
      </template>
    </template>
    <v-layout align-center justify-center v-else>Ничего не найдено</v-layout>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getSearchResult} from '@/store/main/getters';
import {dispatchSearch} from '@/store/main/actions';
import SearchHighlightMixin from '@/mixins/text-highlight-mixin';

@Component
export default class SearchResult extends SearchHighlightMixin {
  public searchQuery: string = '';

  public created() {
    if (this.$route.params.query) {
      this.searchQuery = this.$route.params.query;
      dispatchSearch(this.$store, {query: this.searchQuery});
    }
  }

  public onSearch() {
    if (this.searchQuery) {
      dispatchSearch(this.$store, {query: this.searchQuery});
      this.$router.push(`/search/${this.searchQuery}`);
    }
  }

  get searchResult() {
    return getSearchResult(this.$store);
  }
}
</script>

<style scoped>
  .lection-cart {
    border-radius: 10px;
  }

  .lection-cart:hover {
    color: mediumaquamarine;
  }

  .lection-link {
    text-decoration: none;
  }
</style>
