/*jslint node: true */
/*global module,require,describe,it*/
'use strict';

var assert = require('assert');
var mocha = require('mocha');
var expect = require('chai').expect;

var flip = require('../../../lib/rules-engine/flip');
var check = require('../../check.js');

describe('Flip.it', function() {
  it('should exist', function() {
    assert(expect(flip).to.exist);
    assert(expect(flip.it).to.exist);
  });

  function opts(triple) {
    return {
      "classification": {
        "owner": "message 32 created user bob",
        "subject": "message 32 created user bob",
        "tokens": [
          "message",
          "32",
          "created",

          "user",
          "bob",
          "."
        ],
        "verbs": [
          "created"
        ],
        "nouns": [
          "message",
          "user",
          "bob"
        ],
        "adjectives": [],
        "parts": [
          [
            "message",
            "NN"
          ],
          [
            "32",
            "CD"
          ],
          [
            "created",
            "VBN"
          ],
          [
            "user",
            "NN"
          ],
          [
            "bob",
            "NN"
          ]
        ],
        "text": "message 32 created user bob",
        "value": {
          "subject": {
            "type": "message",
            "value": "32"
          },
          "predicate": {
            "value": "created"
          },
          "object": {
            "type": "user",
            "value": "bob",
          }
        }
      },
      "triple": triple,
      "rules": {
        "subjects": {
          "user": {
            "predicates": {
              "follow": {
                "objects": [
                  "user"
                ]
              },
              "mention": {
                "objects": [
                  "content"
                ]
              },
              "create": {
                "objects": [
                  "message"
                ]
              },
              "send": {
                "objects": [
                  "message"
                ]
              },
              "receive": {
                "objects": [
                  "message"
                ]
              },
              "message": {
                "objects": [
                  "user"
                ]
              }
            }
          }
        },
        "predicates": [
          "follow",
          "mention",
          "create",
          "send",
          "receive",
          "message"
        ],
        "objects": {
          "user": {
            "predicates": {
              "follow": {
                "subjects": [
                  "user"
                ]
              },
              "message": {
                "subjects": [
                  "user"
                ]
              }
            }
          },
          "content": {
            "predicates": {
              "mention": {
                "subjects": [
                  "user"
                ]
              }
            }
          },
          "message": {
            "predicates": {
              "create": {
                "subjects": [
                  "user"
                ]
              },
              "send": {
                "subjects": [
                  "user"
                ]
              },
              "receive": {
                "subjects": [
                  "user"
                ]
              }
            }
          }
        },
        "vocabulary": {
          "follow": "follow",
          "stalk": "follow",
          "watch": "follow",
          "creat": "create",
          "made": "create",
          "wrote": "create",
          "send": "send",
          "sent": "send",
          "mail": "send",
          "retriev": "receive",
          "receiv": "receive",
          "reciev": "receive",
          "got": "receive",
          "messag": "message",
          "msg": "message",
          "contact": "message"
        }
      }
    };

  }
  it('should flip different', function() {
    var triple = {
      subject: {
        type: 'user',
        value: 'Bob'
      },
      predicate: {
        value: 'message'
      },
      object: {
        type: 'user',
        value: 'Bob'
      }
    };

    var originalSubject = triple.subject;
    var originalObject = triple.object;
    var flippedTriple = flip.it(opts(triple));

    expect(flippedTriple.object).to.equal(originalSubject);
    expect(flippedTriple.subject).to.equal(originalObject);
  });
});
