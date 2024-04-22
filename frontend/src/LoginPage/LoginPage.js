
import React from 'react';

export default function LoginPage() {
  return (
    <div class="LPage">
      <div class = "row">
          <label for="username">Username</label>
          <input type="text" name="Username" id="username"></input>
          
      </div>
      <div class = "row">
          <label for="password">Password</label>
          <input type="text" name="Password" id="password"></input>
        </div>
        <div class = "row">
                <button onclick="login()">Login</button>
        </div>
    </div>


  

         

  );
}


