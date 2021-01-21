import feathersClient, {
  makeServicePlugin,
  BaseModel,
} from '../../feathers-client';

class List extends BaseModel {
  static modelName = 'List';

  static instanceDefaults() {
    return {
      name: '',
      order: 0,
      boardId: '',
      archived: false,
    };
  }
}

const servicePath = 'lists';
const listServicePlugin = makeServicePlugin({
  Model: List,
  service: feathersClient.service(servicePath),
  servicePath,
});

export default listServicePlugin;
