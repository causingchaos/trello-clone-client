// As per As per https://vuex.feathersjs.com/getting-started.html#service-plugins   v3
import feathersClient, {
  makeServicePlugin,
  BaseModel,
} from '../../feathers-client';

class Activity extends BaseModel {
  static modelName = 'Activity';

  static instanceDefaults() {
    return {
      text: '',
      boardId: '',
      created_at: new Date(Date.now()),
    };
  }
}

const servicePath = 'activities';

const activityServicePlugin = makeServicePlugin({
  Model: Activity,
  service: feathersClient.service(servicePath),
  servicePath,
});

export default activityServicePlugin;
