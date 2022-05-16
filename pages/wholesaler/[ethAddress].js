import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import web3 from "../../ethereum/web3";
import Link from "next/link";
import Head from "next/head";

const links = [
  { name: "Inventory", address: "/wholesaler/", active: false },
  { name: "Order", address: "#", active: true },
  { name: "Orders", address: "/wholesaler/orders", active: false },
  { name: "Receive", address: "/wholesaler/receive", active: false },
  { name: "Profile", address: "/wholesaler/profile", active: false },
];

export default function batchList() {
  const [sellerInfo, setSellerInfo] = useState({ 0: "" });
  const [receiverAddress, setReceiverAddress] = useState();
  const [medicines, setMedicines] = useState([]);
  const [medicinesDisplay, setMedicinesDisplay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [orderPrice, setOrderPrice] = useState(0);
  const [checkOut, setCheckOut] = useState(false);
  const [paying, setPaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrie, setSearchTrie] = useState();
  const router = useRouter();
  const ethAddress = router.query.ethAddress;

  useEffect(async () => {
    setLoading(true);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    const info = await supplychain.methods.getUserInfo(account).call();
    console.log(info);
    console.log(account);
    if (info[4] != "2") {
      console.log("You are not a wholesaler");
    } else {
      console.log("You are wholesaler");
      setReceiverAddress(account);
      const info = await supplychain.methods.getUserInfo(ethAddress).call();
      setSellerInfo(info);
      const meds = await supplychain.methods.getMedicinesMan(ethAddress).call();
      console.log(meds);
      let medsInfo = [];
      for (let med in meds) {
        const medicine = Medicine(meds[med]);
        const info = await medicine.methods.getInfo().call();
        if (info[2] != 0 || info[3][1]!="0x0000000000000000000000000000000000000000") {
          continue;
        }
        info[6] = parseInt(info[6]);
        console.log(info);
        medsInfo.push({ ...info, address: meds[med] });
      }
      console.log(medsInfo);
      setMedicines(medsInfo);
      setMedicinesDisplay(medsInfo);
    }
    setLoading(false);
  }, []);

  useEffect(async () => {
    let details = [];
    for (let add of selected) {
      const medicine = Medicine(add);
      const info = await medicine.methods.getInfo().call();
      info.address = add;
      details.push(info);
    }
    setSelectedDetails(details);
  }, [selected]);

  const makePayment = async () => {
    setPaying(true);
    console.log("Making Payment")
    await supplychain.methods.placeOrder(
      orderPrice,
      ethAddress,
      receiverAddress,
      selected,
      String(new Date())
    ).send({from: receiverAddress});
    setCheckOut(false);
    setPaying(false);
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

  useEffect(()=>{
    if(medicines.length==0){
      return;
    }
    let trie = new Trie();
    for (let med in medicines) {
      trie.insert(medicines[med][0].toLowerCase(),med);
    }
    setSearchTrie(trie);
  },[medicines]);

  useEffect(()=>{
    if(searchQuery.length==0){
        setMedicinesDisplay(medicines);
    }
    else{
      const result=searchTrie.find(searchQuery.toLowerCase());
      console.log(result);
      let meds=[];
      for(let index of result){
          meds.push(medicines[index]);
      }
      setMedicinesDisplay(meds);
    }
},[searchQuery])

  return (
    <div className="body">
      <NavBar links={links} />
      <Head>
        <title>Place Order</title>
      </Head>
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          {checkOut ? (
            <div className="p-5 border rounded-lg bg-white border-gray-500 shadow-lg relative">
              <div className="flex justify-between">
                <div>
                  <h3>CheckOut</h3>
                  <p>Please confirm your order</p>
                </div>
                <h3>{orderPrice / 1000000000000} Eth</h3>
              </div>
              <p>Seller: {sellerInfo[0]}</p>
              <h2>Batches:</h2>
              {selectedDetails.map((batch) => {
                return (
                  <div className="my-2">
                    <div className="flex justify-between">
                      <div>{batch[0]}</div>
                      <p className="my-0">{batch[6] / 1000000000000} Eth</p>
                    </div>
                    <p className="my-0">{batch[1]} units</p>
                  </div>
                );
              })}
              <div className="flex">
                <button
                  className="bg-white text-red-500 p-2 rounded m-2 border border-gray-600 grow"
                  onClick={() => {
                    setCheckOut(false);
                  }}
                >
                  Go Back
                </button>
                {paying ? (
                  <button className="bg-red-500 text-white p-2 rounded m-2 grow">
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Placing Order...
                  </button>
                ) : (
                  <button
                    className="bg-red-500 text-white p-2 rounded m-2 grow"
                    onClick={makePayment}
                  >
                    Make Payement
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="table-responsive custom-table-responsive">
              <div className="flex justify-between my-2">
                <div className="mx-3">
                  <h3>Select Medicines</h3>
                  <p>Selected Items: {selected.length}</p>
                </div>

                <div className="flex mx-2">
                <span className="mx-2">
                  <form>
                    <input
                      type="text"
                      placeholder="Search Medicine"
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
                </span>
                <span>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => {
                      setCheckOut(true);
                    }}
                  >
                    Order{" "}
                    {orderPrice != 0 ? (
                      <span>({orderPrice / 1000000000000} Eth)</span>
                    ) : (
                      <div></div>
                    )}
                  </button>
                  </span>
                  <p> </p>
                </div>
              </div>
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price (in Eth)</th>
                    <th scope="col">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {medicinesDisplay.map((med, index) => {
                    return (
                      <>
                        <tr className="spacer">
                          <td colSpan={100}></td>
                        </tr>
                        <tr
                          key={med.address}
                          onClick={() => {
                            if (selected.indexOf(med.address) == -1) {
                              setOrderPrice((price) => price + med[6]);
                              setSelected((temp) => temp.concat(med.address));
                            } else {
                              let temp = [];
                              setOrderPrice((price) => price - med[6]);
                              for (let add of selected) {
                                if (add != med.address) {
                                  temp.push(add);
                                }
                              }
                              setSelected(temp);
                            }
                          }}
                        >
                          <td>{index + 1}</td>
                          <td>
                            <Link href={`/${med.address}`}>
                              <a>{med[0]}</a>
                            </Link>
                          </td>
                          <td>{med[1]}</td>
                          <td>{med[6] / 1000000000000}</td>
                          <td>
                            {selected.indexOf(med.address) != -1 ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-check-circle-fill text-green-500"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                            ) : (
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                </svg>
                              </div>
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
              {loading == true ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
              {medicinesDisplay.length == 0 && loading == false ? (
                <p>No Medicine Available</p>
              ) : (
                <p></p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
