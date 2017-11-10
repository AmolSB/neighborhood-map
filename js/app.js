var MapApplication = function() {
	// member function

	self = this;
	var map;
	var	localLocation = {lat: 48.8566, lng: 2.3522};
	self.topPicks = ko.observableArray();
	self.restaurants = ko.observableArray();
	self.shops = ko.observableArray();
	self.nameSearch = ko.observable();
	self.topPicksMarkers = ko.observableArray();
	self.restaurantsMarkers = ko.observableArray();
	self.shopsMarkers = ko.observableArray();
	var marker = new google.maps.Marker();
	var flag = false;
	self.allLocations = ko.observableArray();
	var infowindow = new google.maps.InfoWindow({
			pixelOffset: new google.maps.Size(0, -20)
	});

	var configureBindingHandlers = function() {
		ko.bindingHandlers.mapPanel = {
			init: function(element, valueAccessor) {
				map = new google.maps.Map(element, {
					center: localLocation,
					zoom: 13,
					mapTypeControl: true,
					mapTypeControlOptions: {
      				  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
       				  position: google.maps.ControlPosition.TOP_RIGHT
    				},
				});
			}
		}
	}();

	var showAllMarkers = function() {
		for(var i=0; i<self.topPicksMarkers().length; i++) {
			self.topPicksMarkers()[i].setVisible(true);
		}
	}

	var showInfoWindow = function(obj) {
		var infoWindowLocation = new google.maps.LatLng(obj.location.lat, obj.location.lng);
		console.log(infoWindowLocation);
		infowindow.setPosition(infoWindowLocation);
		infowindow.setOptions({content: `<div class="infowindow">
			<h6>${obj.name}</h6>
			<p>${obj.categories[0].name}</p>
			<p>${obj.hours.status}</p>
			<p>${obj.location.address}</p>
			<a href="${obj.url}">Go to Website</a>
			</div>`})
		infowindow.open(map);
	}

	var showMarkerInfoWindow = function(marker) {
		for(var i=0; i<self.topPicks().length; i++) {
			if(marker.loc == self.topPicks()[i].name) {
				showInfoWindow(self.topPicks()[i])
			}
		}
	}

	self.filteredPlaces = ko.computed(function() {
		var nameSearch = self.nameSearch();
		var result = []

		if(!nameSearch) {
			showAllMarkers();
			return self.topPicks();
		}


		for(var i=0; i<self.topPicks().length; i++) {
			console.log(typeof(self.topPicksMarkers()[i]))
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

		return result;
	});

	// console.log(self.filteredPlaces());

	// self.showMarker = function(obj) {
 // 		var placeLatLng = new google.maps.LatLng(obj.location.lat, obj.location.lng);
	// 	marker = new google.maps.Marker({
	// 		position: placeLatLng,
	// 		map: map
	// 	});
	// }

	self.showMarkerAndInfoWindow = function(obj) {
		// flag = true;
		// self.showMarker(obj);
		// self.hideOtherMarkers(obj);
		getMarker(obj);
		showInfoWindow(obj);
	}

	var getMarker = function(obj) {
		for(var i=0; i<self.topPicksMarkers().length; i++) {
			if(obj.name == self.topPicksMarkers()[i].loc) {
				self.topPicksMarkers()[i].setAnimation(google.maps.Animation.DROP);
			}
		}
	}

	self.hideOtherMarkers = function(obj) {
		for(var i=0; i<self.topPicksMarkers().length; i++) {
			if(obj.name !== self.topPicksMarkers()[i].loc) {
				self.topPicksMarkers()[i].setVisible(false);
			}
		}
	}

	var getPlaceByMarker = function(obj) {
		for(var i=0; i<self.topPicks().length; i++) {
			if(obj.loc == self.topPicks()[i].name){
				return self.topPicks()[i];
			}
		}
	}

	var topPicksURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=48.8566,2.3522&radius=10000&time=any&v=20150409&m=swarm&section=topPicks&limit=10';
	var restaurantsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=48.8566,2.3522&radius=10000&time=any&v=20150409&m=swarm&section=food&limit=3';
	var shopsURL = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=48.8566,2.3522&radius=10000&time=any&v=20150409&m=swarm&section=shops&limit=3';

	fetch(topPicksURL).then(function(response) {
		return response.json();
	}).then(function(data) {
		addItems(data, self.topPicks);
		addTopPicksMarkers(data, self.topPicksMarkers);
	}).catch(function(error) {
		alert("Problem loading FourSquare API");
	});//.then(function() { 
	// 	fetch(restaurantsURL).then(function(response) {
	// 		return response.json();
	// 	}).then(function(data) {
	// 		addItems(data, self.topPicks);
	// 		addTopPicksMarkers(data, self.topPicksMarkers);
	// 	});
	// }).then(function() {
	// 	fetch(shopsURL).then(function(response) {
	// 		return response.json();
	// 	}).then(function(data) {
	// 		addItems(data, self.topPicks);
	// 		addTopPicksMarkers(data, self.topPicksMarkers);
	// 	});
	// })
	
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
					animation: google.maps.Animation.DROP,
					loc: data.response.groups[0].items[i].venue.name
				});
				marker.addListener('click', function() {
					this.setAnimation(google.maps.Animation.DROP);
					showInfoWindow(getPlaceByMarker(this));
				})
			array.push(marker);
		}
	}

	console.log(self.topPicksMarkers());
	console.log(self.topPicks());
}

ko.applyBindings(new MapApplication());



$(".button-collapse").sideNav();
