# The Millipede Guide

![Docs](https://github.com/millipede-guide/millipede-guide-docs/workflows/Test/badge.svg)
![Build](https://github.com/millipede-guide/millipede-guide-web/workflows/Build/badge.svg)

## Project Goals

- A guide to the natural wonders of the world
- Use of source control tools (Git) for a document-driven, open-source, collaborative guide "book"
- Extremely fast loading web pages to allow for slow wireless connections
- Minimalist document layout for maximum readability on small screens in harsh conditions
- Minimise UI animations (etc) to keep power use low and avoid draining battery
- Simple, timeless, fact-based data without prose, opinions, advice, descriptions or variables.
- Modern web browser user interface
- Continuous integration
- Serverless and downloadable for offline use

## Development

### Git

Clone the project then make sure you run:

    git submodule init
    
More info: https://git-scm.com/book/en/v2/Git-Tools-Submodules    

### Docker

    docker-compose start
    ./docker-bash.sh

### Install

    npm install
    
(Then may need to restart Docker Compose.)
    
### First run or if docs have changed

    npm run docs

### Export for production deployment

    npm run build
    npm run export
    
Static files are found in `./out` directory.
