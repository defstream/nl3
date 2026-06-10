import readline from 'node:readline';
import nl3 from '../dist/index.js';

const GATE = 3;

const ITEMS = [
  { name: 'key', start: 0 },
  { name: 'torch', start: 1 },
  { name: 'sword', start: 2 },
];

const NOUNS = {
  key: 'item',
  sword: 'item',
  torch: 'item',
  troll: 'foe',
  gate: 'exit',
};

function categoryOf(noun) {
  return NOUNS[noun];
}

class Game {
  constructor() {
    this.rooms = [
      {
        name: 'Cell',
        desc: 'A damp stone cell. A rusty door leads east.',
        exits: { east: 1 },
      },
      {
        name: 'Corridor',
        desc: 'A torchlit corridor. Passages run north and east, and back west to your cell.',
        exits: { west: 0, north: 2, east: GATE },
      },
      {
        name: 'Armory',
        desc: 'An old armory. Weapon racks line the walls. The corridor is south.',
        exits: { south: 1 },
      },
      {
        name: 'Gate',
        desc: 'The great castle gate - your way out. The corridor lies west.',
        exits: { west: 1 },
      },
    ];
    this.here = 0;
    this.items = {};
    for (const item of ITEMS) {
      this.items[item.name] = { where: 'room', room: item.start };
    }
    this.trollAlive = true;
    this.won = false;
  }

  has(item) {
    return this.items[item]?.where === 'inventory';
  }

  static isItem(noun) {
    return ITEMS.some((i) => i.name === noun);
  }

  describe() {
    const room = this.rooms[this.here];
    console.log(`\n== ${room.name} ==`);
    console.log(room.desc);

    const hereItems = Object.entries(this.items)
      .filter(([_, loc]) => loc.where === 'room' && loc.room === this.here)
      .map(([name]) => name);

    if (hereItems.length > 0) {
      console.log(`You see: ${hereItems.join(', ')}.`);
    }

    if (this.here === GATE && this.trollAlive) {
      console.log('A hulking TROLL blocks the gate, snarling.');
    }

    const exits = Object.keys(room.exits).sort();
    console.log(`Exits: ${exits.join(', ')}.`);
  }

  go(dir) {
    const dest = this.rooms[this.here].exits[dir];
    if (dest !== undefined) {
      this.here = dest;
      this.describe();
    } else {
      console.log(`You can't go ${dir}.`);
    }
  }

  inventory() {
    const held = Object.entries(this.items)
      .filter(([_, loc]) => loc.where === 'inventory')
      .map(([name]) => name);

    if (held.length === 0) {
      console.log('You are empty-handed.');
    } else {
      console.log(`You are carrying: ${held.join(', ')}.`);
    }
  }

  act(verb, noun) {
    switch (verb) {
      case 'take': {
        if (Game.isItem(noun)) {
          const loc = this.items[noun];
          if (loc.where === 'room' && loc.room === this.here) {
            loc.where = 'inventory';
            console.log(`You take the ${noun}.`);
          } else if (loc.where === 'inventory') {
            console.log(`You already have the ${noun}.`);
          } else {
            console.log(`There is no ${noun} here.`);
          }
        } else {
          console.log("You can't carry that.");
        }
        break;
      }
      case 'drop': {
        if (Game.isItem(noun) && this.has(noun)) {
          this.items[noun] = { where: 'room', room: this.here };
          console.log(`You drop the ${noun}.`);
        } else if (Game.isItem(noun)) {
          console.log(`You aren't carrying a ${noun}.`);
        } else {
          console.log("You aren't carrying that.");
        }
        break;
      }
      case 'attack': {
        if (this.here !== GATE || !this.trollAlive) {
          console.log('There is nothing here to attack.');
        } else if (this.has('sword')) {
          this.trollAlive = false;
          console.log(
            'You swing the sword. The troll roars and flees into the dark!',
          );
        } else {
          console.log(
            'The troll shrugs off your bare fists. You need a weapon.',
          );
        }
        break;
      }
      case 'open': {
        if (this.here !== GATE) {
          console.log(`There is no ${noun} here.`);
        } else if (this.trollAlive) {
          console.log(
            "The troll blocks the gate. You'll have to deal with it first.",
          );
        } else if (this.has('key')) {
          console.log(
            'You turn the key. The gate groans open and daylight pours in...',
          );
          this.won = true;
        } else {
          console.log('The gate is locked. You need a key.');
        }
        break;
      }
      default:
        console.log("You can't do that.");
    }
  }
}

function buildParser() {
  return nl3({
    grammar: [
      'player take item',
      'player drop item',
      'player attack foe',
      'player open exit',
    ],
    vocabulary: {
      take: 'take',
      grab: 'take',
      get: 'take',
      pick: 'take',
      pickup: 'take',
      drop: 'drop',
      attack: 'attack',
      hit: 'attack',
      kill: 'attack',
      fight: 'attack',
      open: 'open',
    },
  });
}

function normalizeDirection(word) {
  switch (word) {
    case 'n':
    case 'north':
      return 'north';
    case 's':
    case 'south':
      return 'south';
    case 'e':
    case 'east':
      return 'east';
    case 'w':
    case 'west':
      return 'west';
    default:
      return null;
  }
}

function help() {
  console.log('Commands:');
  console.log('  go <dir> / n, s, e, w   move around');
  console.log('  take <item>, drop <item>');
  console.log('  attack <foe>, open <thing>');
  console.log('  look (l), inventory (i), help, quit');
}

function parseCommand(parser, verbWord, nounWord) {
  const category = categoryOf(nounWord);
  if (!category) return null;

  const command = `player ${verbWord} ${category} ${nounWord}`;
  try {
    const triple = parser.parse(command);
    const verb = triple.predicate.value;
    const noun = triple.object.value;
    if (verb && noun) {
      return { verb, noun };
    }
  } catch (e) {
    // Command doesn't fit grammar.
  }
  return null;
}

function start() {
  const parser = buildParser();
  const game = new Game();

  console.log('=== THE RUSTY GATE ===');
  console.log("Escape the keep. Type 'help' for commands.");
  game.describe();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\n> ',
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim().toLowerCase();
    if (!input) {
      rl.prompt();
      return;
    }

    const words = input.split(/\s+/);
    const first = words[0];

    // Bareword commands (non S-P-O).
    switch (first) {
      case 'quit':
      case 'exit':
      case 'q':
        console.log('You give up. Farewell.');
        rl.close();
        return;
      case 'help':
      case '?':
        help();
        rl.prompt();
        return;
      case 'look':
      case 'l':
        game.describe();
        rl.prompt();
        return;
      case 'inventory':
      case 'inv':
      case 'i':
        game.inventory();
        rl.prompt();
        return;
      case 'go': {
        const dir = normalizeDirection(words[1]);
        if (dir) {
          game.go(dir);
        } else {
          console.log('Go where?');
        }
        rl.prompt();
        return;
      }
    }

    // Bare direction.
    const dir = normalizeDirection(first);
    if (dir) {
      game.go(dir);
      rl.prompt();
      return;
    }

    // Structured commands.
    if (words[1]) {
      const cmd = parseCommand(parser, first, words[1]);
      if (cmd) {
        game.act(cmd.verb, cmd.noun);
      } else {
        console.log("You can't do that.");
      }
    } else {
      console.log(`${first} what?`);
    }

    if (game.won) {
      console.log('\n*** You have escaped. YOU WIN! ***');
      rl.close();
      return;
    }

    rl.prompt();
  });
}

start();
