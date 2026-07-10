<template>
  <div class="reset-password small-content">
    <form @submit.prevent="submit">
      <h2>Reset your password</h2>

      <div
        v-if="passwordChanged"
        class="password-changed"
      >
        <p>
          You have successfully changed your password. You may now proceed to <router-link to="/login">
            log in
          </router-link>.
        </p>
      </div>
      <div
        v-else-if="tokenIsValid === false"
        class="invalid-token"
      >
        <p>
          The reset password URL is no longer valid. Please click <router-link to="/forgot-password">
            here
          </router-link> to request a new one to reset your password.
        </p>
      </div>
      <div
        v-else-if="tokenIsValid"
        class="valid-token"
      >
        <transition name="error">
          <error-message
            v-if="error"
            :message="error"
          />
        </transition>

        <p>Please enter the information below to finish resetting your password.</p>

        <fancy-input
          v-model="email"
          type="text"
          label="Email Address"
          autocomplete="email"
          required
          hide-required
        />

        <input-with-confirm
          v-model="password"
          type="password"
          label="Password"
          autocomplete="off"
          placeholder="hunter2"
        />

        <div class="buttons">
          <loading v-if="loading" />
          <button
            type="submit"
            :disabled="submitDisabled"
          >
            Reset
          </button>
        </div>
      </div>
      <loading v-else />
    </form>
  </div>
</template>

<script>
import InputWithConfirm from "@/components/formelements/InputWithConfirm.vue"
import Loading from "@/components/Loading.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"
import client from "@/client"
import FancyInput from "@/components/formelements/FancyInput.vue"

export default {
    name: "ResetPassword",
    title: 'Reset Password',
    components: {FancyInput, ErrorMessage, Loading, InputWithConfirm},
    props: {
        token: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            email: '',
            password: {
                primary: '',
                confirm: '',
            },
            loading: false,
            error: null,
            tokenIsValid: null,
            passwordChanged: false,
        }
    },
    computed: {
        submitDisabled() {
            return this.loading || !this.password.primary || this.password.primary !== this.password.confirm || !this.email
        },
    },
    mounted() {
        this.loading = true
        client.checkResetPasswordToken(this.token)
            .then(() => this.tokenIsValid = true)
            .catch(() => this.tokenIsValid = false)
            .finally(() => this.loading = false)
    },
    methods: {
        submit() {
            this.error = null
            this.loading = true
            client.resetPassword(this.email, this.password.primary, this.token)
                .then(() => this.passwordChanged = true)
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        }
    }
}
</script>

<style lang="scss" scoped>
h2 {
    margin-bottom: $space-6;
}

form > .loading {
    display: flex;
    margin:  $space-6 auto;
}

p {
    color:       $ink-muted;
    line-height: $lh-loose;
}

div.buttons {
    align-items: center;
}

div.password-changed {
    border-left: 3px solid $positive;
    padding:     $space-3 0 $space-3 $space-4;

    p {
        margin: 0;
        color:  $ink;
    }
}

div.invalid-token {
    border-left: 3px solid $negative;
    padding:     $space-3 0 $space-3 $space-4;

    p {
        margin: 0;
        color:  $ink;
    }
}
</style>