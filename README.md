## nl3 - Natural Language Triples

[![Join the chat at https://gitter.im/defstream/nl3](https://badges.gitter.im/defstream/nl3.svg)](https://gitter.im/defstream/nl3?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<p align="center">
  <img src="https://img.shields.io/gemnasium/defstream/nl3.svg"
       alt="Gemnasium">

  <img src="https://img.shields.io/travis/defstream/nl3.svg"
       alt="build status">

   <img src="https://img.shields.io/codecov/c/github/defstream/nl3.svg"
        alt="coverage">

  <img src="https://img.shields.io/circleci/project/defstream/nl3.svg"
       alt="coverage">

   <img src="https://img.shields.io/npm/v/nl3.svg"
        alt="npm version">   
</p>

**nl3** is a natural language triple library, used for parsing triples from plain english.
Currently nl3 is best at generating triples from  simple short phrases that contain the Subject, Predicate and Object in order.

#### What is a triple?
A triple is a data structure that represents a Subject, Predicate and Object or S P O.

**More Information**
- https://en.wikipedia.org/wiki/Triplestore
- https://en.wikipedia.org/wiki/Resource_Description_Framework

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
    value: 'jack'
  },
  predicate: {
    value: 'message'
  },
  object: {
    type: 'user',
    value: 'jill'
  }
}
```

# Installation

```shell
$ npm install nl3 --save
```

# Development Scripts
Before runing any development scripts, be sure to first install the dev modules.

```shell
$ npm install nl3 --save --dev
```

#### Build Documentation
Outputs code documentation files to the `./doc/api` folder.

```shell
$ npm run doc
```

#### Static Analysis
Outputs static analysis files to the `./doc/analysis` folder.

```shell
$ npm run analyze
```

#### Test + Coverage
Outputs code coverage files to the `./doc/coverage` folder.

```shell
$ npm run test
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
* Specify valid triples in plain english ex: 'Subject Predicate Object'.
* The Subject, Predicate and Object will be will be singularized, if presented in any tense.
* @type {Array}
*/
  grammar: [
    'users message users'
  ],
/**
* Extend the vocabulary of your predicates by mapping word stems to existing predicates within your grammar.
* @type {Object}
*/
  vocabulary: {
    msg: 'message',     // user bob msgs user tom
    messag: 'message',  // user bob messaged user jill
    contact: 'message'  // user bob contacted user bill
  }
});
```

### `nl3.parse( text )`

**parameters:**
- **text**:  {String}  A string containing a S P O phrase in plain english.
**returns**: A triple containing the results of of the parsed Subject Predicate and Object.

Example

```javascript

var nl3 = require('nl3')({
  grammar: [
    'users message users'
  ],
  vocabulary: {
    contact: 'message', // user bob contacted user bill
  }
});

function print (description, triple) {
  console.log(
    description + ' =', JSON.stringify(triple, null, '  ');
  );
};

print( 'user jack contacts user jill', nl3.parse('user jack contacts user jill') );

print( 'users who message user jill', nl3.parse('users who message user jill') );

```

**returns:**

```javascript

user jack contacts user jill = {
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
users who message user jill = {
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
Support for natural random order queries, these are not in (SPO) order, such as messages that user bob created (OSP), created messages by user jill (POS), created by user jill messages (PSO), (SO) user jills messages, (OS) messages for user jill.

```javascript

  nl3.parse('users that follow user 42');
  nl3.parse('users followed by user 42');
  nl3.parse('messages from user 42');
  nl3.parse('messages by user 32');

```

### The Backlog...
- Support for misspelled subjects & objects ( nearest neighbor )
