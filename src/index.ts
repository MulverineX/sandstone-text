import { tellraw } from 'sandstone/commands';
import { MCFunction } from 'sandstone/core';
import { createObjective } from "sandstone/variables";

import marked from 'marked';
import ld from 'lodash';

/*const input = 
`*hmm*
\`\`\`ts
test()
\`\`\``;

const lexed = marked.lexer(input) as any[];*/

//console.log('\nData:', JSON.stringify(lexed, null, 2))
//console.log('\nText:', output.output());

createObjective('md.testing', 'dummy');