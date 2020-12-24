/**
 * This file is just an example.
 * You can delete it!
 */

import { tellraw } from 'sandstone/commands';
import { MCFunction } from 'sandstone/core';

import marked from 'marked';
import ld from 'lodash';

const input = 
`*hmm*
\`\`\`ts
test()
\`\`\``;

const lexed = marked.lexer(input) as any[];

let output: Array<string|any> = [''];

const unset = new RegExp(`(?:${['paragraph', 'text'].join(')|(?:')})`);

let process: { [index: number] : string[] } = {};

function parseType (out: any, type: string, i: number) {
  let add: [ any, any ];

  switch (type) {
    case 'strong': { add = [ 'bold', true ] } break;
    case 'em': { add = [ 'italic', true ] } break;
    case 'code': {
      add = [ false, false ];

      if (process[i]) process[i] = [ ...process[i], 'code' ];
      else process[i] = [ 'code' ];
    } break;
    default: { add = [ false, false ] }
  }
  
  if (add[0]) out[add[0]] = add[1];
}

for (const [i, _entry] of lexed.entries()) {
  let entry = ld.cloneDeep(_entry);

  let out: any = { text: entry.text }

  if (!unset.test(entry.type)) parseType(out, entry.type, i);

  delete entry.type;
  delete entry.raw;
  delete entry.text;
  const entries = entry.tokens;
  delete entry.tokens;

  if (Object.keys(entry).length !== 0) {
    if (out._lexprops) out._lexprops = { ...out._lexprops, ...entry };
    else out._lexprops = entry;
  }

  if (!entries) output.push(out);
  else {
    function tokens (entries: any[]) {
      for (const _entry of entries) {
        let entry = _entry;

        out.text = entry.text;

        if (!unset.test(entry.type)) parseType(out, entry.type, i);

        delete entry.type;
        delete entry.raw;
        delete entry.text;
        const entries = entry.tokens;
        delete entry.tokens;

        if (Object.keys(entry).length !== 0) {
          if (out._lexprops) out._lexprops = [ ...out._lexprops, ...entry ];
          else out._lexprops = entry;
        }
        
        if (!entries) output.push(out);
        else tokens(entries);
      }
    }
    tokens(entries);
  }
}

if (Object.keys(process).length !== 0) {
  for (const [i, flags] of Object.entries(process)) {
    for (const flag of flags) {
      switch (flag) {
        case 'code': {
          output[parseInt(i)+1].text = `\`${output[parseInt(i)+1].text}\``
        }
      }
    }
  }
}

console.log(`Raw:\n${input}`);
console.log('\nLexed:', JSON.stringify(lexed, null, 2))
console.log('\nText:', output);