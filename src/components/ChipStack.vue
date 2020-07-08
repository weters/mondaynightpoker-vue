<template>
    <div :class="{'chip-stack': true, 'is-zero': amount === 0}">
        <transition-group tag="div" class="chips" name="stack">
            <div class="stack" v-for="stack in stacks" :key="stack.color">
                <div>
                <transition-group tag="div" name="chip">
                    <span class="chip" v-for="i in stack.count" :key="i" :class="stack.color"></span>
                </transition-group>
                </div>
            </div>
        </transition-group>
        <div class="amount">
            {{formatAmount(amount)}}
        </div>
    </div>
</template>

<script>
    import balance from "../mixins/balance"
    export default {
        name: "ChipStack",
        mixins: [balance],
        props: {
            amount: {
                type: Number,
                required: true,
            },
        },
        methods: {
            getStack(stacks, amount, size, color) {
                const count = Math.floor(amount / size)
                const rem = amount % size

                if (count > 0) {
                    stacks.push({ color, count })
                }

                return rem
            }
        },
        computed: {
            stacks() {
                const stacks = []
                let rem = this.getStack(stacks, this.amount, 10000, 'black')
                rem = this.getStack(stacks, rem, 2500, 'green')
                rem = this.getStack(stacks, rem, 1000, 'blue')
                rem = this.getStack(stacks, rem, 500, 'red')
                rem = this.getStack(stacks, rem, 100, 'white')
                this.getStack(stacks, rem, 25, 'pink')

                return stacks
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';
    div.chip-stack {
        --offset: 3px;
        --size: 14px;

        @media(min-width: 600px) {
            --offset: 4px;
            --size: 20px;
        }

        width: min-content;
    }
    div.chips {
        justify-content: center;
        display: flex;
        height: calc(var(--size) + var(--offset) * 4);

        .stack {
            width: var(--size);
            & > div {
                position: relative;
            }
            &:not(:last-child) {
                margin-right: $spacing-small;
            }

            span.chip {
                border: 2px dotted white;
                &.white { background-color: #F5F5F5; border-color: #3F51B5; }
                &.red { background-color: #f44336; }
                &.blue { background-color: #3F51B5; }
                &.gray { background-color: #607D8B; }
                &.green { background-color: #4CAF50; }
                &.orange { background-color: #FF9800; }
                &.pink { background-color: #BA68C8; }
                &.black { background-color: #272727; }

                top: 0;
                left: 0;
                position: absolute;
                box-shadow: 2px 1px 0 rgba(black, 0.2);
                border-radius: 100%;
                display: block;
                height: var(--size);
                width: var(--size);

                @for $i from 2 through 4 {
                    &:nth-child(#{$i}) {
                        top: calc(var(--offset) * #{$i - 1});
                    }
                }
            }

            span.chip-enter-active, span.chip-leave-active {
                transition: all 500ms;
            }

            span.chip-enter, span.chip-leave-to {
                top: 0 !important; /* hate important, but use it to override the nth-child */
                opacity: 0;
            }
        }
    }

    .amount {
        font-weight: bold;
        text-align: center;

        @at-root .is-zero & {
            visibility: hidden;
            width: 0;
        }
    }


    .stack {
        transition: all 500ms;
    }

    .stack-leave-active {
        position: absolute;
    }

    .stack-enter, .stack-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
</style>