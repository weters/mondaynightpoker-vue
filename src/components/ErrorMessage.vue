<template>
  <div class="container">
    <div class="error">
      <p>{{ formattedMessage }}</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ErrorMessage",
        props: {
            message: {
                type: [String, Error],
                required: true,
            },
        },
        computed: {
            formattedMessage() {
                return typeof (this.message) === 'object' && this.message.message ? this.message.message : this.message
            },
        },
    }
</script>

<style lang="scss" scoped>
    div.error {
        p {
            margin:       0;
            border-left:  3px solid $negative;
            padding:      $space-2 0 $space-2 $space-4;
            color:        $ink;
            font-size:    $fs-sm;
            line-height:  $lh-snug;

            &::before {
                content:        'ERROR';
                display:        block;
                margin-bottom:  $space-1;
                color:          $negative;
                font-weight:    $fw-bold;
                font-size:      $fs-2xs;
                letter-spacing: $tracking-caps;
            }
        }
    }
</style>