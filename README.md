# elasticsearch-histogram
Full stack app using Ruby on Rails 5.1 to query Elasticsearch, and display results in a histogram using Angular 5 and the Plotly.js charting library


## Getting Started

These instructions allow for running the app on your local machine. 

The application is split into separate server (rails-backend) and client (angular-frontend) directories.


### Prerequisites

Make sure the following are either installed globally on your machine, or in the respective project directory:

```
Ruby v2.3.3
Rails v5.1.5
Node v8.9.4
Npm v5.6.0
Angular-cli v1.6.8
Angular v5.2.7
```


### Installing Dependencies

Install Rails dependencies:
1. From root of project, go into rails directory
2. Install dependencies from Gemfile

```
cd rails-backend
bundle install
```

Install Angular dependencies:
1. From root of project, go into angular directory
2. Install dependencies from package.json

```
cd angular-frontend
npm install
```


### Running the Server

From the top level application directory, move into the "rails-backend" subdirectory

```
cd rails-backend
```

Now start the server

```
rails server
```

Your rails server should now be running on localhost:3000


### Running the Client

From the top level application directory, move into the "angular-frontend" subdirectory

```
cd angular-frontend
```

Now start the client

```
ng serve
```

Go to localhost:4200 in a browser to test the app


## Built With

* [Angular](https://angular.io) - Javascript frontend framework
* [Ruby on Rails](http://rubyonrails.org) - Ruby server-side framework
* [Plotly.js](https://plot.ly/javascript/) - Javascript graphing library
