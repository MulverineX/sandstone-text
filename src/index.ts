import { tellraw } from 'sandstone/commands';
import { MCFunction } from 'sandstone/core';
import { createObjective } from "sandstone/variables";

import marked from 'marked';
import ld from 'lodash';

const input = 
`*hmm*
\`\`\`ts
test()
\`\`\``;

const lexed = marked.lexer(input) as any[];

const unset = new RegExp(`(?:${['paragraph', 'text'].join(')|(?:')})`);

enum text_type { raw, single, multiple };

type obj = { [index: string] : string|number|obj|Array<string|number|obj> };

class Text {
  /**
   * Text type
   */
  public type: text_type = 0;

  /**
   * Get JSON
   */
  public output() {
    switch (this.type) {
      case 0: return this.lex[0].text as string;
      case 1: return this.get_inner(this.get_props()) as obj|obj[];
      case 2: return this.get_children() as obj[];
    }
  }

  private lex: any;

  private text: string = '';

  private get_props() {
    let lex = ld.cloneDeep(this.lex);

    delete lex.type;
    delete lex.raw;
    delete lex.text;
    delete lex.tokens;

    return (lex);
  }

  private get_inner(props: any) {
    const inner = new Text(this.lex[0].tokens);
    
    const inner_out = inner.output() as any;

    if (typeof inner === 'string') return { ...props, text: inner_out };
    else if (!Array.isArray(inner)) return { ...props, ...inner_out };
    else return inner.get_children();
  }

  private get_children() {
    let out: any[] = [];
    for (const lex of this.lex) {
      out.push((new Text([lex])).output());
    }
    return out;
  }

  constructor (lexed: any, parent: any = undefined) {
    this.lex = lexed;

    if (lexed.length === 1) {
      if (lexed[0].type !== 'text') this.type = 1;
    }
    else this.type = 2;
  }
}

const output = new Text(lexed);

console.log(`Raw:\n${input}`);
console.log('\nLexed:', JSON.stringify(lexed, null, 2))
console.log('\nText:', output.output());

createObjective('md.testing', 'dummy');