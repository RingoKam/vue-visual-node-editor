<template>
    <div class="GraphNode"
        :style="GraphNodeStyle"
        @mousedown.stop="startDrag($event)"
        @mousemove.stop="followDrag($event)"
        @mouseup.stop="stopDrag($event)">
        TEST
    </div>  
</template>

<script>
export default {
    props: {
        id: String,
        x: Number,
        y: Number,
        width: Number, 
        height: Number
    },
    data() {
        return {
            isDragging: false
        }
    },
    computed: {
        GraphNodeStyle() {
            return {
                top:  `${this.x || 10}px`,
                left: `${this.y || 100}px`,
            }
        }
    },
    methods: {
        startDrag(event) {
            //Get the exact point our DOM will get trigger
            const { clientX, clientY } = (event.type === "mousedown") ? event : event.touches[0];
            window.console.log(clientY, clientX);
            // this.$on(window, "mousemove", this.followDrag, { passive: false });
            // this.$on(window, "mouseup", this.stopDrag);
            this.isDragging = true;
        },
        followDrag(event) {
            if(this.isDragging && event.type === "mousedown") {
                const { clientX, clientY } = event;
                // window.console.log("drag", event);
                this.$emit("update:x", clientX);
                this.$emit("update:y", clientY);
            }
        },
        stopDrag(event) {
            window.console.log("stop drag", event);
            this.isDragging = false;
        }
    }
}
</script>

<style>
    .GraphNode {
        position: absolute;
        box-sizing: border-box;
        cursor: move;
    }
</style>