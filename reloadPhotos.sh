test -d public/photos && echo '' || mkdir -p public/photos
test -f out/photos/index.json && mv out/photos/index.json public/photos/ || echo "{}" > public/photos/index.json
test -d out/photos/orig && mv out/photos/orig/* public/photos/orig/ || echo ''
test -d out/photos/lg && mv out/photos/lg/* public/photos/lg/ || echo ''
test -d out/photos/sm && mv out/photos/sm/* public/photos/sm/ || echo ''
