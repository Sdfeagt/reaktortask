# BIRDNEST ASSIGNMENT

This is my implementation of the Reaktor pre-assignment for developer trainee position. This program uses mainly React, Express and Axios. Other libraries, such as Xml-js are used as well.

## Breakdown

The project is separated into two separate modules, called frontend and backend. The latter is responsible for retrieving the data from Reaktor server and parsing it into JSON formats if necessary. Backend also keeps track of distance from the nest, when the drone has left the zone and whether it is currently within it.

Frontend gets the data from backend using a GET request. Then it finds the drone that is currently violating the no-fly zone and displays the required information on top of the page. Below that is a list of all drones that have violated the zone within last 10 minutes.

Some extra, not required information is also displayed, such as last update in the database and whether the drone is currently violating the zone.

## Edge cases

The program works as expected for the great majority of the cases. However, it may have some issues with finding the violators on the edge of the zone. It may also occasionally persist the data about the violators for a few miliseconds longer than required, as the time spent in the database is check in the backend, and frontend fetches the data every half a second.


## License

[MIT](https://choosealicense.com/licenses/gpl-3.0/)
