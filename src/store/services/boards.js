// As per As per https://vuex.feathersjs.com/getting-started.html#service-plugins   v3
import feathersClient, {
  makeServicePlugin,
  BaseModel,
} from '../../feathers-client';

class Boards extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Boards';
  // Define default properties of user (match DB)

  static instanceDefaults() {
    return {
      name: '',
      background: '',
    };
  }
}
const servicePath = 'boards';
const boardsServicePlugin = makeServicePlugin({
  Model: Boards,
  service: feathersClient.service(servicePath),
  servicePath,
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
});

export default boardsServicePlugin;
