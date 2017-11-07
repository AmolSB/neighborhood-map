var MapApplication = function() {
	// member function

	self = this;
	var map;
	var	localLocation = {lat: 51.513144, lng: -0.124396};
	self.topPicks = ko.observableArray();
	self.restaurants = ko.observableArray();
	self.shops = ko.observableArray();

	var configureBindingHandlers = function() {
		ko.bindingHandlers.mapPanel = {
			init: function(element, valueAccessor) {
				map = new google.maps.Map(element, {
					center: localLocation,
					zoom: 10
				});
			}
		}
	}();

	self.showMarker = function(obj) {
 		var placeLatLng = new google.maps.LatLng(obj.location.lat, obj.location.lng);
		console.log(placeLatLng);
		var marker = new google.maps.Marker({
			position: placeLatLng,
			map: map
		});
	}

	var topPicksURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=2520&time=any&v=20150409&m=swarm&section=topPicks&limit=5&sortByDistance=1&offset=0';
	var restaurantsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=2520&time=any&v=20150409&m=swarm&section=food&limit=5&sortByDistance=1&offset=0';
	var shopsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=2520&time=any&v=20150409&m=swarm&section=shops&limit=5&sortByDistance=1&offset=0';

	fetch(topPicksURL).then(function(response) {
		return response.json();
	}).then(function(data) {
		addItems(data, self.topPicks);
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

	// return {
		// myname: self.myname
	// }
}

ko.applyBindings(new MapApplication());

