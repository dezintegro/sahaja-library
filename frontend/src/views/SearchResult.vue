<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-text-field autofocus @keyup.enter="onSearch" :value="searchQuery" @change="v => searchQuery = v"
                      prepend-inner-icon="search"
                      name="searchQuery"
                      type="text">
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-skeleton-loader :loading="searchIsLoading" type="card-heading, list-item-three-line@4">
    <template v-if="searchResult.length">
        <span class="subtitle-1">Результатов: {{ searchResult.length }}</span>
        <template v-for="(lection, idx) in searchResult">
          <router-link class="lection-link" :to="{ name: 'lectionView', params: {lectionId: lection.id}, query: {highlight: searchQuery}}">
            <v-card class="mb-5 lection-cart" outlined :key="lection.id">
              <v-card-title><h3>{{ idx + 1 }}. {{ lection.title }}</h3></v-card-title>
              <v-card-subtitle>
                {{ formatLocation(lection) }}
                {{ formatDate(lection) }}
              </v-card-subtitle>
              <v-card-text v-html="lection.content_ru + '...'"></v-card-text>
            </v-card>
          </router-link>
        </template>
      </template>
      <v-layout align-center justify-center v-if="!searchResult.length">Ничего не найдено</v-layout>
    </v-skeleton-loader>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getSearchResult, getSearchIsLoading} from '@/store/main/getters';
import {dispatchSearch} from '@/store/main/actions';
import SearchHighlightMixin from '@/mixins/text-highlight-mixin';
import {Lection} from '@/store/main/state';

@Component
export default class SearchResult extends SearchHighlightMixin {
  public searchQuery: string = '';

  public created() {
    console.log('SearchResult created');
    if (this.$route.params.query) {
      this.searchQuery = this.$route.params.query;
      dispatchSearch(this.$store, {query: this.searchQuery});
    }
  }

  public updated() {
    console.log('SearchResult updated');
  }

  public onSearch() {
    if (this.searchQuery) {
      dispatchSearch(this.$store, {query: this.searchQuery});
      this.$router.push(`/search/${this.searchQuery}`);
    }
  }

  public formatLocation(lection: Lection) {
    if (lection.city && lection.country) { return `${lection.city} (${lection.country})`; }
    return lection.country || lection.city;
  }

  public formatDate(lection: Lection) {
    if (lection.date) {
      return lection.date.toLocaleDateString();
    }
  }

  get searchResult() {
    return getSearchResult(this.$store);
  }

  get searchIsLoading() {
    return getSearchIsLoading(this.$store);
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

<style>
  .lection-cart span {
    text-decoration-style: solid;
    background-color: lightgray;
  }
</style>
