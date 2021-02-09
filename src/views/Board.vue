<template>
  <v-container fluid class="default-container">
    <v-row class="bg-green">
      <h2 v-if="board">{{board.name}}</h2>
      <v-col class="col-12">
        <v-alert v-if="cardsError" dismissible type="error"
        >{{cardsError.message}}
        </v-alert>
        <v-alert v-if="boardsError" dismissible type="error"
        >{{boardsError.message}}
        </v-alert>
        <v-alert v-if="listsError" dismissible type="error"
        >{{listsError.message}}
        </v-alert>
      </v-col>
      <!-- <pre>{{activities}}</pre> -->
    </v-row>
    <v-row>
      <v-col v-if='loadingBoard || loadingLists' class="col-8">
        <v-progress-circular
          :width="7" :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-col>
      <v-col class="col-8 d-flex flex-wrap bg-yellow" v-if='!loadingBoard && !loadingLists'>
        <v-card  class="ma-1" width="250"
          v-for="list in lists" :key="list.id"
          @dragover="setDroppingList($event, list)"
          :class="{ 'green lighten-4': droppingList == list}"
        >
          <v-row no-gutters class="d-flex flex-column">
            <v-col>
              <v-card-title>{{list.name}}</v-card-title>
            </v-col>
            <v-col v-if="cardsByListId[list.id]">
              <v-card class="ma-3" draggable="true"
                @dragstart="startDraggingCard(card)"
                @dragend="dropCard()"
                dense
                v-bind:key="card.id" v-for="card in cardsByListId[list.id]"
              >
                <v-card-title>
                  {{card.title}}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
          <v-card-actions>
            <create-card
              :listId="list.id"
              :boardId="$route.params.id"
            ></create-card>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="col-4 bg-blue">
        <v-row class="mr-1">
          <v-card elevation="3" class="ma-2 create-col">
            <v-card-title>Create List</v-card-title>
              <v-card-actions>
                <v-card-text>
                  <v-form v-model="validList" @submit.prevent="createList" @keydown.prevent.enter
                    v-if="!creatingList"
                  >
                    <v-text-field
                      v-model="list.name"
                      :rules="notEmptyRules"
                      label="Name"
                      required
                    ></v-text-field>
                    <v-btn type="submit" :disabled="!validList" color="primary">Create List</v-btn>
                  </v-form>
                  <v-progress-circular
                    v-if='creatingList'
                    :width="7" :size="50"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-card-text>
              </v-card-actions>
          </v-card>
          <v-card height="100vh" title elevation="3" class="ml-2 activity-row">
            <v-list three-line dense>
              <v-subheader>ACTIVITY LOG</v-subheader>
                <v-list-item class="pl-1" v-for="(activity,i) in activitiesByDate" :key="i">
                  <v-list-item-icon class="mr-1">
                    <v-icon color="green">mdi-account-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-html="user.user.displayName"></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="markdownify(activity.text)"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
            </v-list>
                <!--
                <v-list-item-subtitle
                  v-for="activity in activities" :key="activity.id"
                >{{activity.text}}</v-list-item-subtitle>
                <v-list-item-action>
                  <v-icon color="green">mdi-account-circle</v-icon>
                </v-list-item-action>
                -->
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.create-col{
  min-width: 200px;
}
.activity-row{
  min-width: 100%;
}
.bg-blue{
  background-color: lightblue;
}
.bg-yellow{
  background-color: lightyellow;
}
.bg-green{
  background-color: lightgreen;
}
</style>

<script>
import marked from 'marked';
import {
  mapActions, mapState, mapGetters, mapMutations,
} from 'vuex';

import CreateCard from './CreateCard.vue';

export default {
  components: { CreateCard },
  name: 'board',
  data: () => ({
    droppingList: null,
    draggingCard: null,
    validList: false,
    board: {},
    list: {
      name: '',
      order: 0,
      archived: false,
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty'],
  }),
  mounted() {
    this.clearLists(); // Clear the lists state on component reload/page refresh
    this.getBoard(this.$route.params.id) // id of the current page were on, i.e. boards/2
      .then((response) => {
        this.board = response.data || response;
      });
    this.list.boardId = this.$route.params.id;
    this.findLists({
      query: {
        boardId: this.$route.params.id,
      },
    });
    this.findCards({
      query: {
        boardId: this.$route.params.id,
      },
    });
    this.findActivities({
      query: {
        boardId: this.$route.params.id,
      },
    });
  },
  methods: {
    ...mapMutations('lists', { clearLists: 'clearAll' }),
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('activities', { findActivities: 'find' }),
    async createList() {
      if (this.validList) {
        const list = new this.$FeathersVuex.api.List(this.list);
        list.boardId = this.$route.params.id;
        await list.save();
        this.list = { // overwrite fields
          name: '',
          order: 0,
          archived: false,
        };
        this.createActivity(`**${this.user.user.username}** created list **${list.name}**`);
      }
    },
    createActivity(text) {
      const activity = new this.$FeathersVuex.api.Activity();
      // console.log('DEBUG: activity: ', activity);
      activity.text = text;
      activity.boardId = this.$route.params.id;
      activity.save();
    },
    startDraggingCard(card) {
      // console.log('starting dragging...', card);
      this.draggingCard = card;
    },
    setDroppingList(event, list) {
      // console.log(event);
      // Note you can pass in the raw event dom object in vue by using $event
      this.droppingList = list;
      event.preventDefault();
    },
    async dropCard() {
      if (this.droppingList) {
        // do not make activity entry if they drop it on same list
        if (this.draggingCard.listId !== this.droppingList.id) {
          const fromList = this.lists.find((list) => list.id === this.draggingCard.listId);
          const toList = this.lists.find((list) => list.id === this.droppingList.id);
          this.draggingCard.listId = this.droppingList.id;
          await this.draggingCard.save(); // update card in backend
          this.createActivity(
            `**${this.user.user.username}**`
            + ` moved card **${this.draggingCard.title}**`
            + ` from **${fromList.name}** to **${toList.name}**`,
          );
        }
      }
      this.droppingList = null;
      this.draggingCard = null;
    },
    markdownify(text) {
      return marked(text);
    },
  },
  computed: {
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
      boardsError: 'errorOnGet',

    }),
    ...mapState('auth', { user: 'payload' }),
    ...mapState('lists', {
      creatingList: 'isCreatePending',
      loadingLists: 'isFindPending',
      listsError: 'errorOnFind',
    }),
    ...mapState('cards', {
      cardsError: 'errorOnFind',
    }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    ...mapGetters('activities', { findActivitiesInStore: 'find' }),
    activities() {
      // return this.getBoardInStore({ query: {} }).data;
      return this.findActivitiesInStore({
        boardId: this.$route.params.id,
      }).data;
    },
    lists() {
      // return this.getBoardInStore({ query: {} }).data;
      return this.findListsInStore({
        boardId: this.$route.params.id,
      }).data;
    },
    cards() {
      // return this.getBoardInStore({ query: {} }).data;
      return this.findCardsInStore({
        boardId: this.$route.params.id,
      }).data;
    },
    cardsByListId() {
      // console.log('DEBUG --> Boards.vue - computed -> cardsBylistId');
      // console.log('cards', this.cards);
      const result = this.cards.reduce((byId, card) => {
        const reducer = byId; // to remove linting error
        reducer[card.listId] = byId[card.listId] || [];
        reducer[card.listId].push(card);
        return reducer;
      }, {});
      // console.log(result);
      // console.log('result', result);
      // console.log('DEBUG END --> Boards.vue - computed -> cardsBylistId');
      return result;
    },
    activitiesByDate() {
      return this.activities.slice().reverse();
    },
  },
};
</script>
