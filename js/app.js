var MapApplication = function() {
	// member function
	self = this;

	var map;

	var	localLocation = {lat: -37.810432, lng: 144.96616};

	self.locations = ko.observableArray([
		{name: 'Museum', coord: {lat: -37.669012, lng: 144.841027}},
		{name: 'Ariport', coord: {lat: -37.669012, lng: 144.841027}}
	]);


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

	// return {
	// 
	// }
}

ko.applyBindings(new MapApplication());

