## nl3 - Natural Language Triples

**nl3** is a natural language triple library, used for parsing triples from plain english.
Currently nl3 is best at generating triples from  simple short phrases that contain the Subject, Predicate and Object in order.

#### TLDR;

```javascript
var nl3 = require('nl3')({
/**
* Specifies valid triples in plain english ex: 'Subject Predicate Object'.
* All values will be singularized.
* @type {Array}
*/
  grammar: [
    'users message users'
  ],
/**
* Extend your vocabulary by mapping word stems to existing predicates.
* @type {Object}
*/
  vocabulary: {
    msg: 'message',     // user bob msgs user tom
    messag: 'message',  // user bob messaged user jill
    contact: 'message'  // user bob contacted user bill
  }
});
```

The client returned is able to parse these queries.

```javascript
nl3.parse('user jack msg user jill');
nl3.parse('user jack msgs user jill');
nl3.parse('user jack messaged user jill');
nl3.parse('user jack contacted user jill');
nl3.parse('user jack contacts user jill');
```

All of which will have the same output.

```javascript
{
  subject: {
    type: 'user',
    value: 'bob'
  },
  predicate: {
    value: 'receive'
  },
  object: {
    type: 'message',
    value: '42'
  }
}
```

**More Information**
- https://en.wikipedia.org/wiki/Triplestore
- https://en.wikipedia.org/wiki/Resource_Description_Framework

# Installation

```shell
$ npm install nl3 --save
```

# API

### `nl3(options)`

Create an nl3 instance.

**parameters:**
- **options**            {Object}    The options for the nl3 client.
- **options.grammar**    {Array}     An array of valid grammar in the format of 'S P O'.
- **options.vocabulary** {Array}     An object mapping the phonetic root of an object to a predicate.


**returns**: a new instance of the nl3 client.

Example

```javascript
var nl3 = require('nl3')({
/**
* Specifies valid triples in plain english ex: 'Subject Predicate Object'.
* All values will be singularized.
* @type {Array}
*/
  grammar: [
    'users message users'
  ],
/**
* Extend the vocabulary of your predicates by mapping phonetic roots to your existing grammar.
* @type {Object}
*/
  vocabulary: {
    msg: 'message',     // user bob msgs user tom
    messag: 'message',  // user bob messaged user jill
    contact: 'message'  // user bob conctacted user bill
  }
});
```

### `nl3.parse( query )`

**parameters:**
- **query**:  {String}  A string containing a query in plain english.
**returns**: A triple containing the results of of the parsed Subject Predicate and Object.

Example

```javascript
var nl3 = require('nl3')({
  grammar: [
    'users message users'
  ],
  vocabulary: {
    contact: 'message', // user bob conctacted user bill
  }
});

console.log(
  'user jack contacts user jill',
  nl3.parse('user jack contacts user jill')
);

console.log(
  'users who message user jill',
  nl3.parse('users who message user jill')
);

```

Returns

```javascript
user jack contacts user jill,
{
  "subject": {
    "type": "user",
    "value": "jack"
  },
  "predicate": {
    "value": "message"
  },
  "object": {
    "type": "user",
    "value": "jill"
  }
}
users who message user jill,
{
  "subject": {
    "type": "user"
  },
  "predicate": {
    "value": "message"
  },
  "object": {
    "type": "user",
    "value": "jill"
  }
}
```

### vNext
Support for natural random order queries, these are not in (SPO) order, such as messages that user bob created (OSP), created messages by user jill (POS), created by user jill messages (PSO), (SO) user jills messages, (OS) messages for user jill'
```javascript
  nl3.parse('users that follow user 42')
  nl3.parse('users followed by user 42')
  nl3.parse('messages from user 42')
  nl3.parse('messages by user 32')
```

### The Backlog...
- Support for misspelled subjects & objects ( nearest neighbor )
