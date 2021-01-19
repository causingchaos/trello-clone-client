// As per As per https://vuex.feathersjs.com/getting-started.html#service-plugins   v3
import feathersClient, {
  makeServicePlugin,
  BaseModel,
} from '../../feathers-client';

class User extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User';
  // Define default properties of user (match DB)

  static instanceDefaults() {
    return {
      username: '',
      password: '',
      displayName: '',
      imageUrl: '',
    };
  }
}
const servicePath = 'users';
const userServicePlugin = makeServicePlugin({
  Model: User,
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

export default userServicePlugin;
