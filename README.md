Peer.dev()
===========

Building the App
--------

1. Clone the repository:
    ```
    $ git clone https://github.com/peerdev/peerdev
    ```

2. Install Node (if you don't have it): http://nodejs.org/download/

3. Install MongoDB (if you don't have it): https://www.mongodb.org/

4. Install all the packages in `packages.json` via NPM:
    ```
    $ npm install
    ```

5. Install Grunt CLI globally (if you don't have it):
    ```
    $ npm install -g grunt-cli
    ```

6. Install SASS & Compass (if you don't have it, you will also need Ruby if you don't have it)
    SASS: http://sass-lang.com/install
    Compass: http://compass-style.org/install/

7. Install a MongoDB Database viewer (if you don't have it; MongoVue is a good one)

8. Install the standalone Selenium Server for Protractor **(TBD - Don't do this yet)**
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

Navigate to **http://localhost:3000**

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