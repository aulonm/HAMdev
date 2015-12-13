# HAMdev
HAMdev DHIS2 Organization Manager

## Installation
install Node.js
Do: npm install -g bower (use sudo if necessary)
in git root folder do: bower install

## How-To Run Locally
	Change webapp.manifest to "http://localhost:8082"
	Open Google-Chrome with --disable-web-security (known bug)
	Start the dhis-live.jar app
	Log in to the dhis2 app with info admin:district
	Open the index file as a new Google-Chrome tab
	Use the page :)
	

## To run postgreSQL on OS X:
brew install PostgreSQL

	Start manually:

	pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start

	Stop manually:

	pg_ctl -D /usr/local/var/postgres stop -s -m fast
	
## Known Bugs
When plotting in the polygons, the way we parse the information, it does not get all the polygons from the json file. 

Need to run Google-Chrome without web-security (--disable-web-security) because of Same-Origin policy that is set by the server and browsers.
