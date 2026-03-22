import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

import Authorization "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";



actor {
  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    fee : Nat;
  };

  type Post = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    createdAt : Time.Time;
    published : Bool;
  };

  type Inquiry = {
    id : Nat;
    serviceType : Nat;
    visitorName : Text;
    dob : Text;
    tob : Text;
    question : Text;
    pastLifeNotes : Text;
    handPictureBlob : ?Storage.ExternalBlob;
    palmPhotos : [?Storage.ExternalBlob];
    relationshipPerson2Name : ?Text;
    relationshipPerson2Dob : ?Text;
    relationshipPerson2Tob : ?Text;
    submittedAt : Time.Time;
    birthCountry : ?Text;
    birthCity : ?Text;
    birthState : ?Text;
    seedNumber : ?Nat;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  // ── Vedic Numerology User type ──────────────────────────────────────────
  type NumerologyUser = {
    username : Text;
    passwordHash : Text;
    sectionLevel : Nat;
  };

  module Post {
    public func compareByCreatedAt(post1 : Post, post2 : Post) : Order.Order {
      Int.compare(post1.createdAt, post2.createdAt);
    };
  };

  let posts = Map.empty<Nat, Post>();
  let inquiries = Map.empty<Nat, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let numerologyUsers = Map.empty<Text, NumerologyUser>();
  var nextPostId = 1;
  var nextInquiryId = 1;
  let accessControlState = Authorization.initState();

  let services = List.fromArray<Service>([
    { id = 1; name = "One Question"; description = "Ask any one question about your personal life, career, etc."; fee = 500 },
    {
      id = 2;
      name = "Matchmaking";
      description = "Kundali Milan with Numerology/Astrology (no Manglik Yog)";
      fee = 1500;
    },
    {
      id = 3;
      name = "Muhurat";
      description = "Find the best time for important events like marriage, starting a business, etc.";
      fee = 1500;
    },
    { id = 4; name = "Professional Advice"; description = "Get guidance on professional growth and career choices."; fee = 1100 },
    { id = 5; name = "Personal Phone Consultation"; description = "Personal phone consultation for in-depth analysis and advice."; fee = 2500 },
  ]);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── User Profile Functions ──────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not Authorization.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not Authorization.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Admin Check ───────────────────────────────────────────────────────────────

  public query ({ caller }) func checkAdmin() : async Bool {
    Authorization.isAdmin(accessControlState, caller);
  };

  // ── Services ────────────────────────────────────────────────────────────────

  public query func getServices() : async [Service] {
    services.toArray();
  };

  // ── Blog Posts ────────────────────────────────────────────────────────────

  public query func getAllPosts() : async [Post] {
    posts.values().toArray().sort(Post.compareByCreatedAt).filter(func(post : Post) : Bool { post.published });
  };

  public query ({ caller }) func getAllPostsAdmin() : async [Post] {
    if (not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this endpoint");
    };
    posts.values().toArray().sort(Post.compareByCreatedAt);
  };

  public shared ({ caller }) func createPost(title : Text, content : Text, author : Text) : async Nat {
    if (not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };
    let post : Post = {
      id = nextPostId;
      title;
      content;
      author;
      createdAt = Time.now();
      published = false;
    };
    posts.add(nextPostId, post);
    nextPostId += 1;
    post.id;
  };

  public shared ({ caller }) func updatePost(id : Nat, title : Text, content : Text) : async () {
    if (not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        let updatedPost = { post with title; content };
        posts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };
    posts.remove(id);
  };

  public shared ({ caller }) func publishPost(id : Nat, published : Bool) : async () {
    if (not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can publish posts");
    };
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        let updatedPost = { post with published };
        posts.add(id, updatedPost);
      };
    };
  };

  // ── Inquiries ──────────────────────────────────────────────────────────────

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this endpoint");
    };
    inquiries.values().toArray();
  };

  public shared ({ caller }) func submitInquiry(
    serviceType : Nat,
    visitorName : Text,
    dob : Text,
    tob : Text,
    question : Text,
    pastLifeNotes : Text,
    handPictureBlob : ?Storage.ExternalBlob,
    palmPhotos : [?Storage.ExternalBlob],
    relationshipPerson2Name : ?Text,
    relationshipPerson2Dob : ?Text,
    relationshipPerson2Tob : ?Text,
    birthCountry : ?Text,
    birthCity : ?Text,
    birthState : ?Text,
    seedNumber : ?Nat,
  ) : async Nat {
    let inquiry : Inquiry = {
      id = nextInquiryId;
      serviceType;
      visitorName;
      dob;
      tob;
      question;
      pastLifeNotes;
      handPictureBlob;
      palmPhotos;
      relationshipPerson2Name;
      relationshipPerson2Dob;
      relationshipPerson2Tob;
      submittedAt = Time.now();
      birthCountry;
      birthCity;
      birthState;
      seedNumber;
    };
    inquiries.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
    inquiry.id;
  };

  public shared ({ caller }) func deleteInquiry(id : Nat) : async () {
    if (not Authorization.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete inquiries");
    };
    inquiries.remove(id);
  };

  // ── Vedic Numerology User Management ────────────────────────────────

  let ADMIN_USER = "vikaskharb00007@gmail.com";
  let ADMIN_PASS = "Vikas00007@admin";

  public query func login(username : Text, password : Text) : async Nat {
    switch (numerologyUsers.get(username)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        if (user.passwordHash == password) { user.sectionLevel }
        else { Runtime.trap("Incorrect password") };
      };
    };
  };

  public shared func createUser(adminUsername : Text, adminPassword : Text, username : Text, password : Text, sectionLevel : Nat) : async () {
    if (adminUsername != ADMIN_USER or adminPassword != ADMIN_PASS) {
      Runtime.trap("Admin credentials required");
    };
    if (numerologyUsers.containsKey(username)) {
      Runtime.trap("User already exists");
    };
    let newUser : NumerologyUser = { username; passwordHash = password; sectionLevel };
    numerologyUsers.add(username, newUser);
  };

  public query func listUsers(adminUsername : Text, adminPassword : Text) : async [NumerologyUser] {
    if (adminUsername != ADMIN_USER or adminPassword != ADMIN_PASS) {
      Runtime.trap("Not Authorized");
    };
    numerologyUsers.values().toArray();
  };

  public shared func deleteUser(adminUsername : Text, adminPassword : Text, username : Text) : async () {
    if (adminUsername != ADMIN_USER or adminPassword != ADMIN_PASS) {
      Runtime.trap("Not Authorized");
    };
    if (numerologyUsers.containsKey(username)) {
      numerologyUsers.remove(username);
    };
  };
};
