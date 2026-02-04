import Array "mo:core/Array";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Painto State
  let paintings = Map.empty<Text, Painting>();

  include MixinStorage();

  // Include user authentication/authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type and storage
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Painting and rating types
  type Painting = {
    id : Text;
    title : Text;
    author : Principal;
    created : Time.Time;
    image : Storage.ExternalBlob;
  };

  // Painting Comparison Module
  module Painting {
    public func compare(painting1 : Painting, painting2 : Painting) : Order.Order {
      painting1.title.compare(painting2.title);
    };

    public func compareByDateDescending(painting1 : Painting, painting2 : Painting) : Order.Order {
      let difference = painting2.created - painting1.created;
      if (difference > 0) { #greater } else if (difference < 0) {
        #less
      } else { #equal };
    };
  };

  // Ratings
  let ratings = Map.empty<Text, Map.Map<Principal, Nat>>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Gallery query - public access for all users including guests
  public query func getGallery() : async [Painting] {
    paintings.values().toArray().sort(Painting.compareByDateDescending);
  };

  // Complete painting with access control check - only authenticated users
  public shared ({ caller }) func completePainting(image : Storage.ExternalBlob, title : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create paintings");
    };
    if (title.size() == 0) {
      Runtime.trap("Please choose a title for your new painting");
    };
    let id = Time.now().toText();
    let painting : Painting = {
      id;
      title;
      image;
      author = caller;
      created = Time.now();
    };
    paintings.add(id, painting);
    id;
  };

  // Rate a painting with access control check - only authenticated users
  public shared ({ caller }) func rate(id : Text, points : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can rate paintings");
    };
    assert (points >= 1 and points <= 10);

    let painting = paintings.get(id);
    if (painting == null) { Runtime.trap("Painting does not exist") };

    let existingRatings = switch (ratings.get(id)) {
      case (?r) { r };
      case (null) { Map.empty<Principal, Nat>() };
    };

    let newRating = { points };

    existingRatings.add(caller, newRating.points);
    ratings.add(id, existingRatings);
  };

  public type RatingEntry = {
    user : Principal;
    points : Nat;
  };

  // Get ratings - public access for all users including guests
  public query ({ caller }) func getRatings(paintingId : Text) : async [RatingEntry] {
    switch (ratings.get(paintingId)) {
      case (null) { [] };
      case (?map) {
        map.toArray().map(
          func((user, points)) {
            { user; points };
          }
        );
      };
    };
  };
};
