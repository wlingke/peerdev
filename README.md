Peer.dev()
===========

Building the App
--------
1. Clone the repository:
    ```
    $ git clone https://github.com/peerdev/peerdev
    ```

2. Install Node: http://nodejs.org/download/

2. Install MongoDB: https://www.mongodb.org/

3. Install all the packages in `packages.json` via NPM:
    ```
    $ npm install
    ```

4. Install Grunt CLI globally:
    ```
    $ npm install -g grunt-cli
    ```

5. Install SASS & Compass. (You will also need Ruby if it isn't already installed)
    SASS: http://sass-lang.com/install
    Compass: http://compass-style.org/install/  

6. Install the standalone Selenium Server for Protractor **(TBD - Don't do this yet)**
    ```
    $ node ./node_modules/protractor/bin/webdriver-manager update
    ```
    (Optional) Setting up Webstorm/Pycharm for E2E debugging: https://github.com/angular/protractor/blob/master/docs/debugging.md

Starting the App
---------
Before starting the app, you need to have MongoDB running.
```
$ mongod //or whatever you need to do to start mongodb
```

Runs compass to compile SASS, starts Grunt Watch for compiling SASS on file changes, and starts the development server.
```
$ grunt
```

#####Misc commands:#####
Only run the development server
```
$ node start.js
```

Run compass to compile SASS
```
$ grunt compass
```

Starts Grunt Watch for compiling SASS on file changes
```
$ grunt watch:css
```