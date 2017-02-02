//'use strict';
var markersArray = [];
var markersData = [

    {
        title: 'Wollongong, NSW, Australia',
        location: {
            lat: -34.425072,
            lng: 150.893143
        },
        name: 'Wollongong',
        url: 'https://en.wikipedia.org/wiki/Wollongong'
    },
    {
        title: 'Mildura, VIC, Australia',
        location: {
            lat: -34.206841,
            lng: 142.136490
        },
        name: 'Mildura',
        url: 'http://www.mildura.com/'
    },
    {
        title: 'Ziyou Today, Greenvale',
        location: {
            lat: -37.649967,
            lng: 144.880600
        },
        name: 'Greenvale',
        url: 'https://en.wikipedia.org/wiki/Greenvale,_Victoria'
    },
    {
        title: 'Coffs Harbour NSW 2450',
        location: {
            lat: -30.296276,
            lng: 153.114136
        },
        name: 'Coffs Harbour',
        url: 'http://www.australia.com/en/places/nsw/coffs-harbour.html'
    },
    {
        title: 'Orange, NSW, Australia',
        location: {
            lat: -33.283577,
            lng: 149.101273
        },
        name: 'Orange',
        url: 'http://www.visitnsw.com/destinations/country-nsw/orange-area/orange/attractions'
    },
    {
        title: 'Albury, NSW, Australia',
        location: {
            lat: -36.080780,
            lng: 146.916473
        },
        name: 'Albury',
        url: 'http://www.alburywodongaaustralia.com.au/info/'
    },
    {
        title: 'Brisbane, Queensland, Australia',
        location: {
            lat: -27.3821409,
            lng: 152.9932045
        },
        name: 'Brisbane',
        url: 'https://www.brisbane.qld.gov.au/'
    },
    {
        title: 'Terrey Hills, NSW, Australia',
        location: {
            lat: -33.683212,
            lng: 151.224396
        },
        name: 'Terrey Hills',
        url: 'https://en.wikipedia.org/wiki/Terrey_Hills,_New_South_Wales'
    },
];


//To get the map
function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {
            lat: -28.024,
            lng: 140.887
        }
    });
    //loctions for marker.


    var Infowindow = new google.maps.InfoWindow();
    //Create markers.
    for (var i = 0; i < markersData.length; i++) {
        var marker = new google.maps.Marker({
            map: map,
            position: markersData[i].location,
            title: markersData[i].title,
            name: markersData[i].name,
            lat: markersData[i].location.lat,
            lng: markersData[i].location.lng,
            url: markersData[i].url,
            animation: google.maps.Animation.DROP,
            id: i
        });

        //Push marker to location  array 
        markersData[i].marker = marker;
        markersArray.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            displayInfoWindow(this, Infowindow);
            toggleBounce(this);
            getweather(this);
            getfoursquare(this);
        });
        
    }

}

function googleerror() {
    $('#map').text("oops! error occured..")
}

var Places = function(locData) {
    this.title = ko.observable(locData.title); 
    this.marker = ko.observable(locData.marker);
};

//Create places list and  search filter using knockout. 
var ViewModel = function() {
    var self = this;
    self.currentFilter = ko.observable('');
    this.places = ko.observableArray([]);
    this.marker = ko.observable();

    markersData.forEach(function(locItem) {
        self.places.push(new Places(locItem));
    });


    self.showMarker = function(currentIndex) {
       google.maps.event.trigger(currentIndex.marker, 'click');
    };

    self.filterItem = ko.computed(function() {
        var search = self.currentFilter().toLowerCase();
        if (!search) {
            return self.places();
        } else {
            return ko.utils.arrayFilter(self.places(), function(item) {
                var result = item.title().toLowerCase().indexOf(search) !== -1;
                if(result)
                    item.marker().setVisible(result);
                return result;
            });
        }
    }, self);

};

ko.applyBindings(new ViewModel());

function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
}

//infowindow function.
function displayInfoWindow(marker, infowindow) {

    var currentinfo = '<div><h3>' + marker.title + '</h3><a href=" ' + marker.url + ' ">' + marker.url + '</a></div>';
    infowindow.setContent(currentinfo);
    infowindow.open(map, marker);

}

//function to get the weather api.
function getweather(marker) {
    var current = marker.name;
    var weatherHeader = $('#weather');
    var weatherElem = $('#weather-detail');
    weatherElem.text("");

    var weatherUrl = 'http://api.wunderground.com/api/e68b093ff62aab8d/conditions/q/Australia/ ' + current + '.json';
    $.getJSON(weatherUrl, function(data) {
        weatherHeader.text('Weather of ' + current);
        var element = data.current_observation;
        weatherElem.append('<li>Temperature: ' + element.temp_f + 'Â° F</li>' + '<li><img style="width:  40px" src="' + element.icon_url + '">  ' + element.icon + '</li>');
    }).error(function(e) {
        weatherHeader.text('Weather Could Not be Loaded');
    });
}
//function to get the foursquare api.
function getfoursquare(marker) {

    var lat = marker.lat;
    var lng = marker.lng;
    var clientSecret = "XQWSO1DLZRWP10CMUIAGG2KAZK0IAQXYZMLLZ4RM3NQVOIXE";
    var clientId = "MPQ0VNPAJELISWWU2SKTM5PWB3PAJE5WNADVDWTPWRGAPQBE";
    var foursqHeader = $('#foursquare');
    var foursqElem = $('#foursq-detail');
    foursqElem.text("");

    var foursqUrl = 'https://api.foursquare.com/v2/venues/search?&ll=' + lat + ',' + lng + '&query=food&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20170111';
    $.getJSON(foursqUrl, function(data) {
        foursqHeader.text("Food Court ");
        var articles = data.response.venues;
        for (var i = 0; i < 4; i++) {
            var article = articles[i];
            foursqElem.append('<li> Name: ' + article.name + '. </li><li> Address : ' + article.location.formattedAddress + '.</li><br/>');
        }

    }).error(function(e) {
        foursqHeader.text('Could Not be Loaded');
    });
}
