# bash

npm run linter &&
    npm run prettier &&
    npm run contentValidate > validation-results.txt && 
    ./reloadPhotos.sh &&
    npm run contentPhotos &&
    npm run contentConvert &&
    npm run build &&
    npm run export &&
    echo "" > ./out/.nojekyll
