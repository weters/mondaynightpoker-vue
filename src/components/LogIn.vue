<template>
  <div class="log-in small-content hide-required">
    <form @submit.prevent="submit">
      <h2>Log in to Monday Night Poker</h2>

      <loading v-if="loading" />

      <transition name="error">
        <error-message
          v-if="error"
          :message="error"
        />
      </transition>

      <fancy-input
        v-model="email"
        type="text"
        label="Email Address"
        autocomplete="email"
        required
        hide-required
      />
      <fancy-input
        v-model="password"
        type="password"
        label="Password"
        autocomplete="current-password"
        required
        hide-required
      />

      <div class="buttons">
        <button
          type="submit"
          :disabled="submitDisabled"
        >
          Log In
        </button>
      </div>

      <div class="help">
        <p>
          Don't have an account?
          <router-link to="/signup">
            Sign up
          </router-link>
        </p>
        <p>
          Forgot password?
          <router-link to="/forgot-password">
            Reset your password
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import {mapActions} from "pinia"
import client from "@/client"
import {useRootStore} from "@/store"
import Loading from "@/components/Loading.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"
import FancyInput from "@/components/formelements/FancyInput.vue"

export default {
    name: "LogIn",
    title: 'Log In',
    components: {FancyInput, ErrorMessage, Loading},
    data() {
        return {
            email: null,
            password: null,
            loading: false,
            error: null,
        }
    },
    computed: {
        submitDisabled() {
            return this.loading
        },
    },
    mounted() {
        this.clearUser()
    },
    methods: {
        ...mapActions(useRootStore, ['clearUser', 'setUser']),
        submit() {
            this.error = null
            this.loading = true
            client.logIn(this.email, this.password)
                .then(res => {
                    this.setUser(res)

                    const redirect = this.$route.query.redirect || '/my-tables'
                    this.$router.push(redirect)
                })
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
    },
}
</script>

<style lang="scss" scoped>
form .loading {
    position: absolute;
    bottom:   $spacing-small;
    right:    $spacing-small;
}

div.help {
    font-size:   0.8em;
    border-top:  1px solid $border-color;
    color:       $text-color-light;
    padding-top: $spacing;
    margin-top:  $spacing;

    p {
        margin: 0;
    }

    p:not(:first-child) {
        margin-top: $spacing-medium;
    }
}

div.forgot-password {
    font-size:  0.8em;
    margin-top: $spacing;
}
</style>
