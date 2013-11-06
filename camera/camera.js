Cameras = new Meteor.Collection("cameras");

if (Meteor.isClient) {
    // Bootstrap
    Deps.autorun(function () {
       Session.set("search-postalcode", "8000");
    });

    // Search event
    Template.search.events({
      'click input#search-button': function () {
          var postalcode = $('#search-text').val();
          if (! postalcode)
            postalcode = "8000";
          Session.set("search-postalcode", postalcode);
      }
    });

    // Cameras template
    Template.cameras.events({
        'click .remove': function () {
            Cameras.remove(this._id);
            return false;
        }
    });

    Template.cameras.postalcode = function () {
        return Cameras.findOne({"postalcode": Session.get("search-postalcode")});
    };

    Template.cameras.camera = function() {
        return Cameras.find({$and: [
            {postalcode: Session.get("search-postalcode")}
        ]}, {sort: {street: 1}});
    };

    // Create Party dialog
    var openCreateDialog = function (x, y) {
        Session.set("createCoords", {x: x, y: y});
        Session.set("createError", null);
        Session.set("showCreateDialog", true);
    };

    Template.page.showCreateDialog = function () {
        return Session.get("showCreateDialog");
    };

    Template.createDialog.events({
        'click .save': function (event, template) {
            var street = template.find(".street").value;
            var number = template.find(".number").value;
            var postalcode = template.find(".postalcode").value;
            var city = template.find(".city").value;
            var country = template.find(".country").value;
            var coords = Session.get("createCoords");

            if (street.length && number.length && postalcode.length && city.length && country.length) {
                var id = Random.id();
                Cameras.insert({
                    _id: id,
                    x: coords.x,
                    y: coords.y,
                    street: street,
                    number: number,
                    postalcode: postalcode,
                    city: city,
                    country: country
                });
                Session.set("showCreateDialog", false);
            }
            else {
                Session.set("createError",
                    "It needs some data, or why bother?");
            }
        },
        'click .cancel': function () {
            Session.set("showCreateDialog", false);
        }
    });

    Template.createDialog.error = function () {
        return Session.get("createError");
    };

    // Map display
    // Use jquery to get the position clicked relative to the map element.
    var coordsRelativeToElement = function (element, event) {
        var offset = $(element).offset();
        var x = event.pageX - offset.left;
        var y = event.pageY - offset.top;
        return { x: x, y: y };
    };

    Template.map.events({
        'dblclick .map': function (event, template) {
            if (! Meteor.userId()) // must be logged in to create events
                return;
            var coords = coordsRelativeToElement(event.currentTarget, event);
            openCreateDialog(coords.x / 500, coords.y / 500);
        }
    });

    Template.map.rendered = function () {
        var self = this;
        self.node = self.find("svg");

        if (! self.handle) {
            self.handle = Deps.autorun(function () {
                // Draw a circle for each camera
                var updateCircles = function (group) {
                    group.attr("id", function (camera) { return camera._id; })
                        .attr("cx", function (camera) { return camera.x * 500; })
                        .attr("cy", function (camera) { return camera.y * 500; })
                        .attr("r", 30)
                        .attr("class", function (camera) {
                            return "public";
                        })
                        .style('opacity', function (camera) {
                            return 0.6;
                        });
                };

                var circles = d3.select(self.node).select(".circles").selectAll("circle")
                    .data(Cameras.find().fetch(), function (camera) {
                        if (camera.x > 0 && camera.y > 0 && camera.postalcode == '8000')
                            return camera._id;
                    });

                updateCircles(circles.enter().append("circle"));
                updateCircles(circles.transition().duration(250).ease("cubic-out"));
                circles.exit().transition().duration(250).attr("r", 0).remove();
            });
        }
    };

    Template.map.destroyed = function () {
        this.handle && this.handle.stop();
    };
}
