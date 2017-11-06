var MapApplication = function() {
	// member function

	self = this;
	var map;
	var	localLocation = {lat: -37.810432, lng: 144.96616};

	self.locations = ko.observableArray();

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
		var marker = new google.maps.Marker({
			position: obj.coord,
			map: map
		});
	}

	var url = 'https://api.foursquare.com/v2/venues/explore?client_id=K2JWQRQEIQT2M5HTJGBW3TQXNSOU1EI3SAPO0DDMNLMT24DD&client_secret=FXX3ZZXCVCJUYILHGIB2CSTKVDK51XXLOL4WOZUFFKN52AYE&ll=51.513144,-0.124396&radius=2520&time=any&v=20150409&m=swarm&limit=5&sortByDistance=1&offset=0';

	fetch(url).then(function(response) {
		return response.json();
	}).then(function(data) {
		console.log(data.response.groups[0].items)
		for (var i=0; i<data.response.groups[0].items.length; i++) {
			self.locations.push(data.response.groups[0].items[i].venue);
		}
	});

	console.log(self.locations());

	// return {
		// myname: self.myname
	// }
}

ko.applyBindings(new MapApplication());

