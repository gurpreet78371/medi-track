import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
} from "react-map-gl";
import Head from "next/head";

const links = [
  { name: "Inventory", address: "/wholesaler/", active: false },
  { name: "Order", address: "#", active: true },
  { name: "Orders", address: "/wholesaler/orders", active: false },
  { name: "Receive", address: "/wholesaler/receive", active: false },
  { name: "Profile", address: "/wholesaler/profile", active: false },
];

export default function userList({ usersInfo }) {
  const [userData, setUserData] = useState(usersInfo);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrie, setSearchTrie] = useState();
  const [viewState, setViewState] = useState({
    longitude: 76.78532,
    latitude: 30.76728,
    zoom: 4,
  });
  const [mode, setMode] = useState(0);
  const mapboxToken =
    "pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA";

  const getData = (e) => {
    console.log(e.target.value);
    setSelectedUser(null);
    if (e.target.value == "All") {
      setUserData(usersInfo);
    } else {
      let data = [];
      for (let user in usersInfo) {
        if (usersInfo[user].role == e.target.value) {
          data.push(usersInfo[user]);
        }
      }
      setUserData(data);
    }
  };

  // we start with the TrieNode
  const TrieNode = function (key) {
    // the "key" value will be the character in sequence
    this.key = key;

    // we keep a reference to parent
    this.parent = null;

    // we have hash of children
    this.children = {};

    // check to see if the node is at the end
    this.end = false;

    this.index=[];

    this.getWord = function () {
      let output = [];
      let node = this;

      while (node !== null) {
        output.unshift(node.key);
        node = node.parent;
      }

      return output.join("");
    };

    this.getIndex=function(){
        return this.index;
    }
  };

  const Trie = function () {
    this.root = new TrieNode(null);

    this.insert = function (word,index) {
      let node = this.root;

      // for every character in the word
      for (let i = 0; i < word.length; i++) {
        // check to see if character node exists in children.
        if (!node.children[word[i]]) {
          // if it doesn't exist, we then create it.
          node.children[word[i]] = new TrieNode(word[i]);

          // we also assign the parent to the child node.
          node.children[word[i]].parent = node;
        }

        // proceed to the next depth in the trie.
        node = node.children[word[i]];

        // finally, we check to see if it's the last word.
        if (i == word.length - 1) {
          // if it is, we set the end flag to true.
          node.end = true;
          node.index.push(index);
        }
      }
    };

    // check if it contains a whole word.
    this.contains = function (word) {
      let node = this.root;

      // for every character in the word
      for (let i = 0; i < word.length; i++) {
        // check to see if character node exists in children.
        if (node.children[word[i]]) {
          // if it exists, proceed to the next depth of the trie.
          node = node.children[word[i]];
        } else {
          // doesn't exist, return false since it's not a valid word.
          return false;
        }
      }

      // we finished going through all the words, but is it a whole word?
      return node.end;
    };

    // returns every word with given prefix
    this.find = function (prefix) {
      let node = this.root;
      let output = [];

      // for every character in the prefix
      for (let i = 0; i < prefix.length; i++) {
        // make sure prefix actually has words
        if (node.children[prefix[i]]) {
          node = node.children[prefix[i]];
        } else {
          // there's none. just return it.
          return output;
        }
      }

      // recursively find all words in the node
      output=findAllWords(node, output);

      return output;
    };

    // recursive function to find all words in the given node.
    const findAllWords = (node, arr) => {
      // base case, if node is at a word, push to output
      if (node.end) {
        arr=arr.concat(arr,node.getIndex());
      }

      // iterate through each children, call recursive findAllWords
      for (let child in node.children) {
        arr=findAllWords(node.children[child], arr);
      }
      return arr;
    };

    // removes a word from the trie.
    this.remove = function (word) {
      let root = this.root;

      if (!word) return;

      // recursively finds and removes a word
      const removeWord = (node, word) => {
        // check if current node contains the word
        if (node.end && node.getWord() === word) {
          // check and see if node has children
          let hasChildren = Object.keys(node.children).length > 0;

          // if has children we only want to un-flag the end node that marks the end of a word.
          // this way we do not remove words that contain/include supplied word
          if (hasChildren) {
            node.end = false;
          } else {
            // remove word by getting parent and setting children to empty dictionary
            node.parent.children = {};
          }

          return true;
        }

        // recursively remove word from all children
        for (let key in node.children) {
          removeWord(node.children[key], word);
        }

        return false;
      };

      // call remove word on root node
      removeWord(root, word);
    };
  };

  useEffect(() => {
    let trie = new Trie();
    for (let user in usersInfo) {
      trie.insert(usersInfo[user].name.toLowerCase(),user);
    }
    setSearchTrie(trie);
  },[]);

  useEffect(()=>{
      if(searchQuery.length==0){
          setUserData(usersInfo);
      }
      else{
        const result=searchTrie.find(searchQuery.toLowerCase());
        console.log(result);
        let users=[];
        for(let index of result){
            users.push(usersInfo[index]);
        }
        setUserData(users);
      }
  },[searchQuery])
  return (
    <div className="body">
      <NavBar links={links} />
      <Head>
        <title>Order</title>
      </Head>
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          <div className="table-responsive custom-table-responsive">
            <div className="filter-box">
              <h3 className="mb-4 mt-0">Choose Manufacturer:</h3>
              <div className="flex justify-between">
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode((mode + 1) % 2);
                  }}
                >
                  {mode == 0 ? (
                    <div>Switch to Map View</div>
                  ) : (
                    <div>Switch to Table View</div>
                  )}
                </button>
                <div>
                  <form>
                    <input
                      type="text"
                      placeholder="Search Manufacturer"
                      className="p-2"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    ></input>
                    <button className="px-3 py-3 bg-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="11"
                        fill="currentColor"
                        className="bi bi-search"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            {mode == 0 ? (
              <div className="mt-3">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">Location</th>
                      <th scope="col">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((userobj, index) => {
                      return (
                        <>
                          <tr className="spacer">
                            <td colSpan={100}></td>
                          </tr>
                          <tr key={userobj.ethAddress}>
                            <td>{index + 1}</td>
                            <td>
                              <Link href={`/wholesaler/${userobj.ethAddress}`}>
                                {userobj.name}
                              </Link>
                            </td>
                            <td>{userobj.ethAddress}</td>
                            <td>{userobj.address}</td>
                            <td>{userobj.role}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                {userData.length == 0 ? <p>No User Available</p> : <p></p>}
              </div>
            ) : (
              <div className="my-4">
                <Map
                  {...viewState}
                  onMove={(evt) => setViewState(evt.viewState)}
                  style={{ height: 550, width: 1190 }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={mapboxToken}
                >
                  {userData.map((userobj) => {
                    const coordinates = userobj.location.split(",");
                    return (
                      <Marker
                        key={userobj.ethAddress}
                        longitude={coordinates[0]}
                        latitude={coordinates[1]}
                      >
                        <img
                          src={`/${userobj.icon}.png`}
                          style={{
                            height: 30,
                            width: 30,
                          }}
                          onClick={async (e) => {
                            e.preventDefault();
                            setSelectedUser(userobj);
                          }}
                        ></img>
                      </Marker>
                    );
                  })}
                  {selectedUser ? (
                    <Popup
                      longitude={selectedUser.location.split(",")[0]}
                      latitude={selectedUser.location.split(",")[1]}
                      closeOnClick={false}
                      onClose={() => {
                        setSelectedUser(null);
                      }}
                      focusAfterOpen={false}
                    >
                      <div>
                        <h2>{selectedUser.name}</h2>
                        <h6>{selectedUser.role}</h6>
                        <p>{selectedUser.address}</p>
                        <button className="bg-red-500 text-white p-2 rounded">
                          <Link href={`/wholesaler/${selectedUser.ethAddress}`}>
                            Order
                          </Link>
                        </button>
                      </div>
                    </Popup>
                  ) : null}
                  <GeolocateControl />
                  <NavigationControl />
                </Map>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const users = await supplychain.methods.getUsers().call();
  let usersInfo = [];
  for (let user in users) {
    const userInfo = await supplychain.methods
      .getUserInfo(users[parseInt(user)])
      .call();
    let rolestr;
    let icon;
    if (userInfo[4] == 1) {
      rolestr = "Manufacturer";
      icon = "factory-icon";
    } else {
      continue;
    }
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${
        userInfo[1].split(",")[0]
      },${
        userInfo[1].split(",")[1]
      }.json?access_token=pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA`
    );
    const address = await res.json();
    userInfo.address =
      address.features.length != 0
        ? address.features[0].place_name
        : "Nameless Place";
    let userobj = {
      name: userInfo[0],
      location: userInfo[1],
      address: userInfo.address,
      ethAddress: userInfo[2],
      role: rolestr,
      icon: icon,
    };
    usersInfo.push(userobj);
  }
  return {
    props: {
      usersInfo,
    },
  };
}
