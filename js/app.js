var MapApplication = function() {
	// member function

	self = this;
	var map;
	var	localLocation = {lat: 51.513144, lng: -0.124396};
	self.topPicks = ko.observableArray();
	self.restaurants = ko.observableArray();
	self.shops = ko.observableArray();
	self.nameSearch = ko.observable();
	self.topPicksMarkers = ko.observableArray();
	self.restaurantsMarkers = ko.observableArray();
	self.shopsMarkers = ko.observableArray();
	var marker;
	var flag = false;
	self.allLocations = ko.observableArray();

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

	var showAllMarkers = function() {
		for(var i=0; i<self.topPicksMarkers().length; i++) {
			self.topPicksMarkers()[i].setVisible(true);
		}
	}

	self.filteredPlaces = ko.computed(function() {
		var nameSearch = self.nameSearch();
		var result = []

		if(!nameSearch) {
			showAllMarkers();
			// for(var i=0; i<self.topPicksMarkers().length; i++) {
			// 	result.push(self.topPicksMarkers()[i].loc);
			// }
			return self.topPicks();
			// return result;
		}

		// for(var i=0; i<self.topPicks().length; i++) {
		// 	if(self.topPicks()[i].name.toLowerCase().includes(nameSearch.toLowerCase())){
		// 		result.push(self.topPicks()[i]);
		// 	}
		// }

		for(var i=0; i<self.topPicks().length; i++) {
			// var place = self.topPicksMarkers()[i];
			if(self.topPicks()[i].name.toLowerCase().includes(nameSearch.toLowerCase())) {
				result.push(self.topPicks()[i])
				// result.push(place.loc);
				self.topPicksMarkers()[i].setVisible(true);
			} else {
				self.topPicksMarkers()[i].setVisible(false);
			}
			// console.log(markers[i].getPosition().lat());
		}

		// self.topPicksMarkers().forEach(function(v, i) {
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

	self.doSomething = function(obj) {
		flag = true;
		self.showMarker(obj);
		self.hideOtherMarkers(obj);
	}

	// self.hideMarker = function(obj) {
	// 	var placeLatLng = new google.maps.LatLng(obj.location.lat, obj.location.lng);
	// 	var marker = new google.maps.Marker({
	// 		position: placeLatLng,
	// 		map: null
	// 	});
	// }

	self.hideOtherMarkers = function(obj) {
		for(var i=0; i<self.restaurantsMarkers().length; i++) {
			if(obj.name !== self.restaurantsMarkers()[i].loc) {
				self.restaurantsMarkers()[i].setVisible(false);
			}
		}

		for(var j=0; j<self.topPicksMarkers().length; j++) {
			self.topPicksMarkers()[j].setVisible(false);
		}
	}

	// self.combineLocations = function() {
	// 	for(var i=0; i<self.topPicksMarkers().length; i++) {
	// 		self.allLocations.push(self.topPicksMarkers()[i]);
	// 	}
	// }

	// self.combineLocations();

	// console.log(self.allLocations());


	var topPicksURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=25000&time=any&v=20150409&m=swarm&section=topPicks&limit=4';
	var restaurantsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=25000&time=any&v=20150409&m=swarm&section=food&limit=3';
	var shopsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=25000&time=any&v=20150409&m=swarm&section=shops&limit=3';

	fetch(topPicksURL).then(function(response) {
		return response.json();
	}).then(function(data) {
		addItems(data, self.topPicks);
		addTopPicksMarkers(data, self.topPicksMarkers);
	}).then(function() { 
		fetch(restaurantsURL).then(function(response) {
			return response.json();
		}).then(function(data) {
			addItems(data, self.topPicks);
			addTopPicksMarkers(data, self.topPicksMarkers);
		});
	}).then(function() {
		fetch(shopsURL).then(function(response) {
			return response.json();
		}).then(function(data) {
			addItems(data, self.topPicks);
			addTopPicksMarkers(data, self.topPicksMarkers);
		});
	});

	// fetch(restaurantsURL).then(function(response) {
	// 	return response.json();
	// }).then(function(data) {
	// 	addItems(data, self.restaurants);
	// 	addRestaurantsMarkers(data, self.restaurantsMarkers);
	// });

	// fetch(shopsURL).then(function(response) {
	// 	return response.json();
	// }).then(function(data) {
	// 	addItems(data, self.shops);
	// });

	var addItems = function(data, array) {
		for (var i=0; i<data.response.groups[0].items.length; i++) {
			array.push(data.response.groups[0].items[i].venue);
		}
	}

	var addTopPicksMarkers = function(data, array) {
		for(var i=0; i<data.response.groups[0].items.length; i++) {
				marker = new google.maps.Marker({
				position: {lat: data.response.groups[0].items[i].venue.location.lat, lng: data.response.groups[0].items[i].venue.location.lng},
				map: map,
				loc: self.topPicks()[i].name,
				title: 'top pick'
			});
			array.push(marker);
		}
	}

	var addRestaurantsMarkers = function(data, array) {
		for(var i=0; i<data.response.groups[0].items.length; i++) {
				marker = new google.maps.Marker({
				position: {lat: data.response.groups[0].items[i].venue.location.lat, lng: data.response.groups[0].items[i].venue.location.lng},
				loc: self.restaurants()[i].name,
				title: 'restaurant'
			});
			array.push(marker);
		}
	}

	console.log(self.topPicksMarkers());
	console.log(self.topPicks())
	// return {
		// myname: self.myname
	// }
}

ko.applyBindings(new MapApplication());

