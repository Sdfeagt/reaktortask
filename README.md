# BIRDNEST ASSIGNMENT

This is my implementation of the Reaktor pre-assignment for developer trainee position. This program uses mainly React, Express, Axios and Sass. Other libraries, such as Xml-js are used as well.

![Alt text](logo192.png)


## Breakdown

The project is separated into two separate modules, called frontend and backend. The latter is responsible for retrieving the data from Reaktor server and parsing it into JSON formats if necessary. Backend also keeps track of distance from the nest, when the drone has left the zone and whether it is currently within it.

Frontend gets the data from backend using a GET request. Then it finds the drone that is currently violating the no-fly zone and displays the required information on top of the page. Below that is a list of all drones that have violated the zone within last 10 minutes. Sass was used to style the website.

Some extra, not required information is also displayed, such as last update in the database and whether the drone is currently violating the zone.

## Edge cases

The program works as expected for the great majority of the cases. However, it may have some issues with finding the violators on the edge of the zone.

## Installation

If you wish to run this program on your device, it's possible to do so. After downloading the repository, go into "backend" folder and run:

```powershell
npm install
```
Followed by

```powershell
npm run dev
```

To run the program. Bear in mind that this code relies on data provided by Reaktor, and if the company decided to shut down the servers for this assigment, the app will not work as planned.

This program was deployed to the internet. You may see it here : [Link](https://birdnest-9t8t.onrender.com/)


## License

[GNU](https://choosealicense.com/licenses/gpl-3.0/)
