declare module 'wink-pos-tagger' {
  interface WinkToken {
    value: string;
    /** Token kind, e.g. 'word', 'number', 'punctuation', 'currency'. */
    tag: string;
    pos: string;
    lemma?: string;
    normal?: string;
  }

  interface WinkTagger {
    tagSentence(sentence: string): WinkToken[];
  }

  export default function winkPosTagger(): WinkTagger;
}
