<template>
  <div :class="{'chip-stack': true, 'is-zero': amount === 0}">
    <transition-group
      tag="div"
      class="chips"
      name="stack"
    >
      <div
        v-for="stack in stacks"
        :key="stack.color"
        class="stack"
      >
        <div>
          <transition-group
            tag="div"
            name="chip"
          >
            <span
              v-for="i in stack.count"
              :key="i"
              class="chip"
              :class="stack.color"
            />
          </transition-group>
        </div>
      </div>
    </transition-group>
    <div class="amount">
      {{ formatAmount(amount) }}
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
    }
</script>

<style lang="scss" scoped>
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
                border: 2px dotted rgba(#fff, 0.85);
                &.white { background-color: #F5F3EE; border-color: $primary; }
                &.red { background-color: $suit-red; }
                &.blue { background-color: #3F51B5; }
                &.gray { background-color: #607D8B; }
                &.green { background-color: $positive; }
                &.orange { background-color: $warning; }
                &.pink { background-color: #C879D6; }
                &.black { background-color: #232522; }

                top: 0;
                left: 0;
                position: absolute;
                box-shadow: 2px 1px 0 rgba(#000, 0.25);
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
                transition: top $dur-slow $ease-spring, opacity $dur-slow $ease-spring;
            }

            span.chip-enter-from, span.chip-leave-to {
                top: 0 !important; /* hate important, but use it to override the nth-child */
                opacity: 0;
            }
        }
    }

    .amount {
        @include numeric;
        font-weight: $fw-bold;
        text-align: center;

        @at-root .is-zero & {
            visibility: hidden;
            width: 0;
        }
    }


    .stack {
        transition: transform $dur-slow $ease-spring, opacity $dur-slow $ease-spring;
    }

    .stack-leave-active {
        position: absolute;
    }

    .stack-enter-from, .stack-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    @media (prefers-reduced-motion: reduce) {
        div.chips .stack span.chip-enter-active,
        div.chips .stack span.chip-leave-active,
        .stack {
            transition: opacity $dur-fast linear;
        }

        .stack-enter-from, .stack-leave-to {
            transform: none;
        }
    }
</style>