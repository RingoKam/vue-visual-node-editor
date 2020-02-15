<template>
  <div :id="data.id" :class="classes">
    <div class="__port" @mouseover="startHover" @mouseout="endHover"></div>
    <span
      v-if="data.connectionCount > 0 || !data.option || !getOptionComponent(data.option)"
      class="align-middle"
    >{{ displayName }}</span>
    <component
      v-else
      :is="getOptionComponent(data.option)"
      :option="data"
      :value="value"
      @input="data.value = $event"
      :name="displayName"
    ></component>
  </div>
</template>

<script>
export default {
    props: {
        id: {
            
        }
    },
  data() {
      return {

      }
  },
  methods: {

    //i need to know the start hover and hover position of the 
    startHover() {
      this.editor.hoveredOver(this.data);
    },
    endHover() {
      this.editor.hoveredOver(undefined);
    }
  }
};
</script>
