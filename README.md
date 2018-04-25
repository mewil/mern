# The MERN Stack Boilerplate

## Setup

1. [Get Docker](https://docs.docker.com/engine/getstarted/step_one/#/step-1-get-docker)
2. [Get Docker Compose](https://docs.docker.com/compose/install/)
4. Clone this repo: `git clone https://github.com/mewil/mern`
4. Change directory to the deploy repo: `cd mern/deploy/`
5. Start whatever environment you want
    - Development
        - `docker-compose -f development.yml up`
        - **Your git repo will be linked to the development environment, so your local changes will be reflected with a container restart**
    - Production (More env data required)
        - `docker-compose -f production.yml up`
        - **NOTE: This takes care of setting up NGINX AND LetsEncrypt with the appropriate hosts and autorenewal**
6. Access `http://localhost:3000` and start developing!

## Useful Commands

#### Seeing container output
This will start the necessary containers and hook you into their output. In addition to being able to see what is happening, you can stop the containers easily by just Ctrl-Cing out of them.

`DEBUG=* docker-compose -f development.yml up -d`

#### Working in backend
When working exclusively on backend, you don't want to wait for Webpack to reload the frontend on each save, especially when you haven't changed anything there.

`APIWORK=true docker-compose -f development.yml up -d`

