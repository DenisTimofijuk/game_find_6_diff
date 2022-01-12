# Find 10 differences
This is a simple and relaxing game to find 10 differences between two images.  
It has no database, so no data will be collected. That means that there will be no contest between players.  
No time preasure.   
Helper will be initiated if program will indicate that player is stuck.  
Play some background music, have some animations.  
Canvas is the main driver here.

## TODO
we can create backend api to get img data url, then we will draw image on fron end.
https://stackoverflow.com/questions/44698967/requesting-blob-images-and-transforming-to-base64-with-fetch-api

## The approach
Since there is no database, dynamick file loading will be implemented. We would like to avoid of downloading everything to user's computer. That means that user will have to solve current task to be able to move to the fallowing one. File names will be encoded. By doing some wierd background magic it will decode next task filename.
# New project setup
1. Create project:
``` npx create-snowpack-app reaction-time --template @snowpack/app-template-blank-typescript ```
2. Add webpack:
``` npm install --save-dev snowpack-plugin-webpack5 ```
3. Add jquery:
``` npm install --save-dev jquery ```
4. Add jquery types:
``` npm i --save-dev @types/jquery ```
5. Add jquery-ui:
``` npm i --save-dev jquery-ui ```
6. Add jquery-ui types:
``` npm install --save-dev @types/jqueryui ```
7. Define old browser support:
WebPack will support old browsers when adding code below in **package.json**
```
 "browserslist": [
    "defaults"
  ]
```
[browserslist](https://github.com/browserslist/browserslist)  
[discussions/1569](https://github.com/snowpackjs/snowpack/discussions/1569)