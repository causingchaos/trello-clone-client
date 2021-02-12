<template>
  <v-card height="100vh" title elevation="3" class="ml-2 activity-row">
    <v-list three-line dense>
      <v-subheader>ACTIVITY LOG</v-subheader>
        <v-list-item class="pl-1" v-for="(activity,i) in activitiesByDate" :key="i">
          <v-list-item-icon class="mr-1">
            <v-icon color="green">mdi-account-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-html="user.user.displayName"></v-list-item-title>
            <v-list-item-subtitle v-if="activitiesByDate"
              v-html="markdownify(activity.text)"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import marked from 'marked';

export default {
  props: ['activitiesByDate', 'user'],
  methods: {
    markdownify(text) {
      return marked(text);
    },
  },
};
</script>
