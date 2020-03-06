<template>
    <div class="cns-canvas">
        
    </div>
</template>

<script>
export default {
    props: {
        eventBus: {
            type: Object
        }
    },
    provide() {
        eventBus: this.eventBus
    },
    subscriptions: function() {
        return {
            
        }
    }
}
</script>

<style>

</style>