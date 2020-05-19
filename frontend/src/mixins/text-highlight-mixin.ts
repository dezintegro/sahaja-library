import {Component, Vue} from 'vue-property-decorator';

@Component
export default class SearchHighlightMixin extends Vue {
  // public highlightedCount = 0;

  public highlightSearch(text: string, needle: string) {
    if (!needle) {
      return text;
    }
    let idx = 0;
    return text.replace(
      new RegExp(needle, 'gi'),
      (match) => {
        // this.highlightedCount++;
        return `<span class="highlightText" id="highlight${idx++}">${match}</span>`;
      },
    );
  }

  public getHighlightAnchor(idx: number) {
    return `#highlight${idx}`;
  }
}
