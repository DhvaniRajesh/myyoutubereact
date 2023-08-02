import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/navSlice";
import { SEARCH_API } from "../utils/constants";
import { cacheResults } from "../utils/searchSlice";

const Head = () => {

  const [searchQuery, setSearchQuery] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchCache = useSelector(store=>store.search);
  // console.log("dispatch"+searchCache)
  
  const dispatch = useDispatch();

  useEffect(()=>{
    const timer = setTimeout(()=>{
      if(searchCache[searchQuery]){
        setSuggestions(searchCache[searchQuery]);
      }
      else{
      getSearchSuggestions()}
    },200);

    return ()=> {
      clearTimeout(timer);
    }
    //make an api call after every key press but if difference b/w 2 key press is less than 200ms then decline the api call
    // eslint-disable-next-line
  },[searchQuery]);

  
  const getSearchSuggestions = async () => {
    // console.log("Making API Call "+searchQuery);
    const data = await fetch(SEARCH_API+searchQuery);
    const json= await data.json();
    // console.log(json);
    setSuggestions(json[1]);
    dispatch(cacheResults({ [searchQuery]: json[1] })); // computed property name
  }

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  }


  return (
    <div className="grid grid-flow-col p-2 m-2 shadow-md">
      <div className="flex col-span-2">
        <img
          className="w-8 h-8 cursor-pointer"
          // onClick={()=>toggleMenuHandler()}
          onClick={toggleMenuHandler}
          alt="nav-icon"
          src="https://icons.veryicon.com/png/o/miscellaneous/linear-icon-45/hamburger-menu-4.png"
        ></img>
        <img
          className="h-8 mx-2"
          alt="logo"
          src="data:image/png;base64,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"
        ></img>
      </div>
      <div className="col-span-9">
        <div>
        <input
          className="w-3/5 h-8 px-3 py-1 border border-gray-400 rounded-l-full"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e)=>{setSearchQuery(e.target.value)}}
          onFocus={()=>{setShowSuggestions(true)}}
          onBlur={()=>{setShowSuggestions(false)}}
        ></input>
        <button className="py-1 px-3 border border-gray-400 rounded-r-full bg-gray-100">
       🔍
        </button>
        </div>
        { showSuggestions && (<div className="fixed p-2 m-1 bg-white w-5/12 shadow-lg rounded-lg">
          <ul>
            {
              suggestions.map((item,index)=>{
                return(
                  <li key={index} className="hover:bg-gray-100 p-1 "> {item}</li>
                )
              })
            }
          </ul>
        </div>)}
        
      </div>
      <div className="col-span-1">
        <img
          className="h-8"
          alt="user"
          src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
        ></img>
      </div>
    </div>
  );
};

export default Head;
