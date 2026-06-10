declare module 'wink-pos-tagger' {
  interface WinkToken {
    value: string;
    tag: 'word' | 'number' | 'punctuation' | 'currency' | string;
    pos: string;
    lemma?: string;
    normal?: string;
  }

  interface WinkTagger {
    tagSentence(sentence: string): WinkToken[];
  }

  export default function winkPosTagger(): WinkTagger;
}
