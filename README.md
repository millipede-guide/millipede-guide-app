# Millipede Guide Web GUI (React)

## Content

Place YAML content documents in `public/content`.

## Install

### Docker (optional)

    docker-compose start
    ./docker-bash.sh
    
(or install Node 12.x)

### Node Packages

    npm install
    
(Then may need to restart Docker Compose.)

### Lint

    npm run linter && npm run prettier
    
### Validate YAML content documents

    npm run contentValidate
    
### Download Photos

    npm run contentPhotos
    
### Convert content files

    npm run contentConvert
   
## Development

    npm run dev

## Production

    npm run build && npm run export
    
Static files are found in `./out` directory.

### Serve

    npm run serve
