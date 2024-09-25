import Bool "mo:base/Bool";
import Func "mo:base/Func";

import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Blob "mo:base/Blob";

actor {
  // User type definition
  type User = {
    email: Text;
    passwordHash: Hash.Hash;
  };

  // Stable variable to store users
  stable var users : [(Text, User)] = [];

  // Helper function to hash passwords
  func hashPassword(password: Text) : Hash.Hash {
    Text.hash(password)
  };

  // Function to register a new user
  public func register(email: Text, password: Text) : async Result.Result<Text, Text> {
    // Input validation
    if (not Text.contains(email, #text "@")) {
      return #err("Invalid email format");
    };
    if (Text.size(password) < 8) {
      return #err("Password must be at least 8 characters long");
    };

    // Check if user already exists
    let existingUser = Array.find(users, func((_, user) : (Text, User)) : Bool { user.email == email });
    switch (existingUser) {
      case (?_) { return #err("User already exists") };
      case null {
        let passwordHash = hashPassword(password);
        let newUser : User = { email = email; passwordHash = passwordHash };
        users := Array.append(users, [(email, newUser)]);
        #ok("User registered successfully")
      };
    };
  };

  // Function to authenticate a user
  public query func login(email: Text, password: Text) : async Result.Result<Text, Text> {
    let user = Array.find(users, func((_, user) : (Text, User)) : Bool { user.email == email });
    switch (user) {
      case (?foundUser) {
        let passwordHash = hashPassword(password);
        if (foundUser.1.passwordHash == passwordHash) {
          #ok("Login successful")
        } else {
          #err("Invalid credentials")
        }
      };
      case null { #err("User not found") };
    };
  };

  // System functions for upgrades
  system func preupgrade() {
    // No need to do anything as we're using a stable variable
  };

  system func postupgrade() {
    // No need to do anything as we're using a stable variable
  };
}
