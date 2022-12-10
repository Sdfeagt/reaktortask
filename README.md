# BIRDNEST ASSIGNMENT

This is my implementation of the Reaktor [pre-assignment](https://assignments.reaktor.com/birdnest/) for developer trainee position. This program uses mainly React, Express, Axios and Sass. Other libraries, such as Xml-js are used as well.

This program is deployed to the internet using [render](https://render.com/). You may see it here: [Link](https://birdnest-9t8t.onrender.com/)


![Alt text](/frontend/public/logo192.png)
*Picture of a drone annoying a geese created using DALL·E*

## Breakdown

The project is separated into two separate modules, called "frontend" and "backend". The latter was created using node.js. It is responsible for retrieving the data from Reaktor server and parsing it into JSON format if necessary. "Backend" also keeps track of drone's distance from the nest, whether the drone has left the zone and if it is currently within it.

Frontend was created using React library. It gets the data from backend using a GET request. Then it finds the drone that is closest to the nest and is currently violating the no-fly zone. Information about the closest drone and pilot is displayed  on top of the page. Below that is a list of all pilots that have violated the zone within the last 10 minutes. Sass was used to style the website. [Everblush](https://github.com/Everblush) was used as a color scheme.

Some extra, not required information is also displayed, such as last update in the database and whether the drone is currently violating the zone.

## Installation

If you wish to run this program on your device, it's possible to do so. After downloading the repository, go into "backend" folder and run:

```powershell
npm install
```
Followed by

```powershell
npm run dev
```

To run the program. Bear in mind that this code relies on data provided by Reaktor, and if the company decides to shut down the servers for this assigment, the app will not work as planned.


## License

[GNU](https://choosealicense.com/licenses/gpl-3.0/)
