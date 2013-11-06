// Stub the Meteor object
var Meteor = {

    // Boot Meteor
    startup: function (newStartupFunction) {
        Meteor.startup = newStartupFunction;
    },

    // Collection constructor
    Collection: function (collectionName) {
        Meteor.instantiationCounts[collectionName] = Meteor.instantiationCounts[collectionName] ?
            Meteor.instantiationCounts[collectionName] + 1 : 1;
    },
    instantiationCounts: {}
};

// Define methods on collections
Meteor.Collection.prototype = {
    insert: function () {},
    find: function () {},
    findOne: function () {},
    update: function () {},
    remove: function () {},
    allow: function () {},
    deny: function () {}
};

Meteor.Collection("Cameras");

describe("Camera model", function() {
    it("is only added once to the Meteor.Collection", function() {
        expect(Meteor.instantiationCounts.Cameras).toBe(1);
    });
});