<template>
  <div class="profile small-content">
    <div>
      <h2>Manage my profile</h2>

      <form
        class="inner"
        @submit.prevent="saveDisplayName"
      >
        <h3>Change your display name</h3>

        <transition name="error">
          <error-message
            v-if="error"
            :message="error"
          />
        </transition>

        <div
          v-if="success"
          class="success"
        >
          <p>Your changes have been saved successfully.</p>
        </div>

        <p>
          Your display name is how other users will see you online. Only your display name is visible. It does
          not
          need to be unique.
        </p>

        <fancy-input
          v-model="displayName"
          type="text"
          label="Display Name"
          required
          :disabled="loading"
        />

        <div class="buttons">
          <button :disabled="loading">
            Save Changes
          </button>
        </div>
      </form>

      <form
        class="inner"
        @submit.prevent="changePassword"
      >
        <h3>Change password</h3>

        <transition name="error">
          <error-message
            v-if="password.error"
            :message="password.error"
          />
        </transition>

        <div
          v-if="password.success"
          class="success"
        >
          <p>Your password has been updated.</p>
        </div>

        <fancy-input
          v-model="password.old"
          type="password"
          label="Old Password"
          required
          :disabled="loading"
        />

        <input-with-confirm
          v-model="password.new"
          label="New Password"
          autocomplete="off"
          type="password"
        />

        <div class="buttons">
          <button :disabled="!password.new.primary || password.new.primary !== password.new.confirm">
            Change Password
          </button>
        </div>
      </form>

      <loading v-if="loading" />

      <section class="danger-zone">
        <h3>Danger Zone</h3>

        <h4>Delete Your Account*</h4>

        <p>
          Deleting your account is irreversible. You may create a new account in the future, but all your current
          information will be lost.
        </p>

        <form
          v-if="confirmDelete"
          @submit.prevent="deleteAccount"
        >
          <p class="confirm">
            Are you sure you want to delete your account? Type your email address to confirm.
          </p>
          <fancy-input
            v-model="deleteConfirmEmail"
            label="Email"
            type="text"
            autocomplete="off"
            required
          />

          <div class="buttons">
            <button
              type="button"
              class="secondary"
              @click="confirmDelete = false; deleteConfirmEmail = ''"
            >
              Cancel
            </button>
            <button
              type="button"
              class="destructive"
              :disabled="!canDeleteAccount"
            >
              Delete Your Account
            </button>
          </div>
        </form>
        <div
          v-else
          class="delete-your-account"
        >
          <button
            type="button"
            class="destructive"
            @click="confirmDelete=true"
          >
            Delete Your Account
          </button>
        </div>

        <p class="note">
          *In order to keep table balances consistent, we maintain the user record but replace your
          email, display name, and password with a random string.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "pinia"
import client from "../client"
import {useRootStore} from "@/store"
import Loading from "./Loading.vue"
import ErrorMessage from "./ErrorMessage.vue"
import FancyInput from "@/components/formelements/FancyInput.vue"
import InputWithConfirm from "@/components/formelements/InputWithConfirm.vue"

export default {
    name: "Profile",
    components: {InputWithConfirm, FancyInput, ErrorMessage, Loading},
    title: 'My Profile',
    data() {
        return {
            displayName: useRootStore().user.player.displayName,
            loading: false,
            error: null,
            success: false,

            confirmDelete: false,
            deleteConfirmEmail: '',

            password: {
                error: '',
                success: false,
                old: '',
                new: {}
            }
        }
    },
    computed: {
        ...mapState(useRootStore, ['user']),
        canDeleteAccount() {
            return this.user.player.email === this.deleteConfirmEmail
        },
    },
    methods: {
        ...mapActions(useRootStore, ['setUserPlayer', 'setNotification', 'setError']),
        playerUpdated() {
            client.validateJWT(this.user.jwt)
                .then(player => this.setUserPlayer(player))
                .catch(err => this.error = err)
        },
        saveDisplayName() {
            this.loading = true
            this.error = null
            client.updatePlayer(this.user.player.id, {
                    displayName: this.displayName,
                })
                .then(() => {
                    this.success = true
                    this.playerUpdated()
                })
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
        changePassword() {
            this.loading = true
            this.password.error = null
            client.updatePlayer(this.user.player.id, {
                oldPassword: this.password.old,
                newPassword: this.password.new.primary,
            })
            .then(() => {
                this.password.success = true
                this.password.new = {}
                this.password.old = ''
                this.playerUpdated()
                document.activeElement.blur()
            })
            .catch(err => this.password.error = err)
            .finally(() => this.loading = false)
        },
        deleteAccount() {
            client.deleteAccount(this.user.player.id)
                .then(() => {
                    this.setNotification('Your account has been deleted')
                    this.$router.push('/login')
                })
                .catch(err => this.setError(err))
        },
    },
}
</script>

<style lang="scss" scoped>
h2 {
    margin-bottom: $space-5;
}

form.inner {
    padding-bottom: $space-6;
    margin-bottom:  $space-6;
    border-bottom:  1px solid $hairline;

    h3 {
        margin-bottom: $space-4;
    }
}

div.success {
    color:         $positive;
    font-weight:   $fw-medium;
    margin-bottom: $space-4;
}

p.confirm {
    color: $negative;
}

div.delete-your-account {
    margin-bottom: $space-5;
}

div.buttons {
    margin-bottom: $space-5;
}

.danger-zone {
    h3 {
        color: $negative;
    }

    h4 {
        margin-bottom: $space-2;
        font-size:     $fs-base;
    }

    p.note {
        margin-top: $space-5;
    }
}
</style>