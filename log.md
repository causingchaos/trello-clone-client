Install log

$npx @vue/cli create client
$npm install -g @vue/cli
$npm install feathers-vuex --save
$npm install @feathersjs/feathers @feathersjs/socketio-client --save
$npm install socket.io-client@2.4.0   * Note feathersjs/socket-io client doesn't work with v3xx


Create a new service
feathers g service

make sure to remove the models DB table creation logic and create a new knex migration

## Extra stuff, markdown package ###
