# Image Resizer
### A project submission from **scratch** to udacity using the famous Typescript, Node JS, Express, and Jasmine
### mainly Sharp is used as image proccessor .
#### You may lossely compress and resize your images fast and easy
#### Accepted image formats: ( jpg, jpeg, png )
to install the packages use 
```
npm install
```
To build the project ( convert Typescipt to normal JS )
```
npm run build
```

to run tests use 
```
npm run jasmine
```

To build and run tests use 
```
npm run test
```

To run styling script (Prettier) 
```
npm run prettier
```

To run error check script (ESLint) 
```
npm run lint
```

To start the Developement server 
```
npm run start
```

To start the server after the build use
```
node dist/server.js
```
A request sample to test 
```
http:\/\/localhost:3000/api/image?image=image-0&width=400&height=400&ext=jpg
```