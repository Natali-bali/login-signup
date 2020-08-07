<template>
  <div id="signup">
    <div class="signup-form">
      <form @submit.prevent="onSubmit">

        <div class="input" :class = "{invalid: $v.userName.$error}">
          <label for="userName">Name</label>
          <input
                  type="text"
                  id="userName"
                  @blur = "$v.userName.$touch()"
                  v-model="userName">
          <p v-if = "$v.userName.$dirty">        
            <span class="error" v-if = "!$v.userName.minLength">Name should be valid</span>        
            <span class="error" v-if = "!$v.userName.required">Name is required.</span>        
          </p>
        </div>

        <div class="input" :class = "{invalid: $v.email.$error}">
          <label for="email">Mail</label>
          <input
                  type="email"
                  id="email"
                  @blur = "$v.email.$touch()" 
                  v-model.lazy="email">
          <p v-if = "$v.email.$dirty">          
            <span class = "error" v-if = "!$v.email.email">Please enter valid email</span>       
            <span class="error" v-if = "!$v.email.required">Email is required.</span>
          </p>
        </div>

        <div class="input" :class = "{invalid: $v.age.$error}">
          <label for="age">Your Age</label>
          <input
                  type="number"
                  id="age"
                  v-model.number="age"
                  @blur = "$v.age.$touch()">
          <p v-if = "$v.age.$dirty">          
              <span class="error" v-if="!$v.age.between">Minimum age 18 years.</span>
              <span class="error" v-if="!$v.age.required">Age is required</span>
          </p>
        </div>

        <div class="input" :class = "{invalid: $v.password.$error}">
          <label for="password">Password</label>
          <input
                  type="password"
                  id="password"
                  @blur = "$v.password.$touch()"
                  v-model="password">
          <p v-if = "$v.password.$dirty">            
            <span class="error" v-if="!$v.password.minLength">Password must have at least {{ $v.password.$params.minLength.min }} letters.</span>     
            <span class="error" v-if="!$v.password.required">Password is required.</span>
          </p>
        </div>

        <div class="input" :class = "{invalid: $v.confirmPassword.$error}">
          <label for="confirm-password">Confirm Password</label>
          <input
                  type="password"
                  id="confirm-password"
                  @blur = "$v.confirmPassword.$touch()"
                  v-model="confirmPassword">
          <p v-if = "$v.confirmPassword.$dirty">            
            <span class="error" v-if="!$v.confirmPassword.sameAsPassword">Passwords must match</span>     
            <span class="error" v-if="!$v.password.required">Password is required.</span>
          </p>      
        </div>
        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country">
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
            <option value="russia">Russia</option>
          </select>
        </div>
        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list">
            <div
                    class="input"
                    v-for="(hobbyInput, index) in hobbyInputs"
                    :key="hobbyInput.id">
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                      type="text"
                      :id="hobbyInput.id"
                      v-model="hobbyInput.value">
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
            </div>
          </div>
        </div>
        <div class="input inline">
          <input type="checkbox" id="terms" v-model="terms">
          <label for="terms">Accept Terms of Use</label>
        </div>
        <div class="submit">
          <button type="submit" :disabled="$v.$invalid">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {required, minLength, between, email, numeric,  sameAs} from 'vuelidate/lib/validators'

export default {
    data () {
      return {
        userName: '',
        email: '',
        age: null,
        password: '',
        confirmPassword: '',
        country: 'usa',
        hobbyInputs: [],
        terms: false
      }
    },
    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        }
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          userName: this.userName,
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(hobby => hobby.value),
          terms: this.terms
        }
        console.log(formData);
        this.$store.dispatch('signup', formData);
    }
    },
    validations: {
       userName: {
        required,
        minLength: minLength(2)
      },
      age: {
        between: between(18, 110),
        required
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        sameAsPassword: sameAs('password'),
        required
      },

    }
  }
</script>

<style scoped>
  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }
  .invalid input{
    border: 1px solid red;
  }
  .input.invalid label {
    color: red
  }
  .error {
    color: rgb(236, 63, 63);
    font-size: 70%;
  }
  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>