
import React from 'react';

export default function LoginPage() {
  return (
    <div class="LPage">
      <div class = "row">
          <label for="username">Username</label>
          <input type="text" name="Username" id="username"></input>
          
      </div>
      <div class = "row">
          <label for="CreatePassword">Create Password</label>
          <input type="text" name="CreatePassword" id="CreatePassword"></input>
        </div>
        <div class = "row">
          <label for="ConfirmPassword">Confirm Password</label>
          <input type="text" name="ConfirmPassword" id="ConfirmPassword"></input>
        </div>
        <div class = "row">
                <button onclick="login()">Signup</button>
        </div>
    </div>


  

         

  );
}


