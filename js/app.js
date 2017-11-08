var MapApplication = function() {
	// member function

	self = this;
	var map;
	var	localLocation = {lat: 51.513144, lng: -0.124396};
	self.topPicks = ko.observableArray();
	self.restaurants = ko.observableArray();
	self.shops = ko.observableArray();
	self.nameSearch = ko.observable();
	self.markers = ko.observableArray();
	self.marker = ko.observable();

	var configureBindingHandlers = function() {
		ko.bindingHandlers.mapPanel = {
			init: function(element, valueAccessor) {
				map = new google.maps.Map(element, {
					center: localLocation,
					zoom: 13
				});
			}
		}
	}();

	self.filteredPlaces = ko.computed(function() {
		var nameSearch = self.nameSearch();
		var result = []

		// var findByName = function(place) {
		// 	return Lazy(place.name.toLowerCase()).contains(nameSearch.toLowerCase());
		// }

		// if(!nameSearch) {
		// 	return self.topPicks();
		// }

		// return Lazy(self.topPicks()).filter(findByName).value();
	
		if(!nameSearch) {
			for(var i=0; i<self.topPicks().length; i++) {
				self.showMarker(self.topPicks()[i]);
			}
			return self.topPicks();
		}

		// for(var i=0; i<self.topPicks().length; i++) {
		// 	if(self.topPicks()[i].name.toLowerCase().includes(nameSearch.toLowerCase())){
		// 		result.push(self.topPicks()[i]);
		// 	}
		// }

		for(var i=0; i<self.markers().length; i++) {
			if(self.markers()[i].loc.toLowerCase().includes(nameSearch.toLowerCase())) {
				result.push(self.topPicks()[i])
				self.markers()[i].setVisible(true);
			} else {
				self.markers()[i].setMap(null);
			}
			// console.log(markers[i].getPosition().lat());
		}

		// self.markers().forEach(function(v, i) {
		// 	if(v.loc.toLowerCase().includes(nameSearch.toLowerCase())) {
		// 		result.push(self.topPicks()[i])
		// 		v.setVisible(true);
		// 	} else {
		// 		v.setVisible(false);
		// 	}
		// })

		return result;
	});

	// console.log(self.filteredPlaces());

// 	self.locationsFilter = ko.computed(function() {
//         var result = [];
//         for (var i = 0; i < this.markers.length; i++) {
//             var markerLocation = this.markers[i];
//             if (markerLocation.title.toLowerCase().includes(this.searchOption()
//                     .toLowerCase())) {
//                 result.push(markerLocation);
//                 this.markers[i].setVisible(true);
//             } else {
//                 this.markers[i].setVisible(false);
//             }
//         }
//         return result;
// }, this)

	self.showMarker = function(obj) {
 		var placeLatLng = new google.maps.LatLng(obj.location.lat, obj.location.lng);
		var marker = new google.maps.Marker({
			position: placeLatLng,
			map: map
		});

	}

	self.hideMarker = function(obj) {
		var placeLatLng = new google.maps.LatLng(obj.location.lat, obj.location.lng);
		var marker = new google.maps.Marker({
			position: placeLatLng,
			map: null
		});
	}

	self.hideOtherMarkers = function(obj) {
		for(var i=0; i<self.topPicks().length; i++) {
			if(self.topPicks()[i].name !== obj.name) {
				self.hideMarker(self.topPicks()[i]);
			}	
		}
		console.log("hola")
	}


	var topPicksURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=25000&time=any&v=20150409&m=swarm&section=topPicks&limit=6';
	var restaurantsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=25000&time=any&v=20150409&m=swarm&section=food&limit=8';
	var shopsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=25000&time=any&v=20150409&m=swarm&section=shops&limit=8';

	fetch(topPicksURL).then(function(response) {
		return response.json();
	}).then(function(data) {
		addItems(data, self.topPicks);
		addMarkers(data, self.markers());

	});

	fetch(restaurantsURL).then(function(response) {
		return response.json();
	}).then(function(data) {
		addItems(data, self.restaurants);
	});

	fetch(shopsURL).then(function(response) {
		return response.json();
	}).then(function(data) {
		addItems(data, self.shops);
	});

	var addItems = function(data, array) {
		for (var i=0; i<data.response.groups[0].items.length; i++) {
			array.push(data.response.groups[0].items[i].venue);
		}
	}

	var addMarkers = function(data, array) {
		for(var i=0; i<data.response.groups[0].items.length; i++) {
			self.marker = new google.maps.Marker({
				position: {lat: data.response.groups[0].items[i].venue.location.lat, lng: data.response.groups[0].items[i].venue.location.lng},
				map: map,
				loc: self.topPicks()[i].name
			});
			array.push(self.marker);
		}
	}

	console.log(self.markers());
	console.log(self.topPicks())
	// return {
		// myname: self.myname
	// }
}

ko.applyBindings(new MapApplication());

