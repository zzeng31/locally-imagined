import React from "react";
import { Grid, InputBase } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../styles";
import { Search } from "@material-ui/icons";
import "./SearchBar.css";
/**
 * SearchBar
 * @return {object} JSX
 */
const SearchBar = (props) => {
  const classes = styles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // useEffect(() => {
  //   props.setCurPath("/");
  // }, []);

  const enterHandler = (event) => {
    if (event.key === "Enter") {
      // props.setFilter([]);
      if (!props.filterQuery && !search) {
        window.location.reload(false);
        return;
      }
      props.getPosts(props.filterQuery);
    }
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase());
    props.setSearch(event.target.value.toLowerCase());
  };

  return (
    <div className="search-bar">
      <span className="search-bar-icon">
        <Search />
      </span>
      <InputBase
        className="search-bar-input"
        placeholder="Search Marketplace"
        onChange={handleSearchChange}
        onClick={() => {
          setOpen(true);
        }}
        onKeyDown={enterHandler}
        type="search"
        name="search"
      />
    </div>
  );
};
export default SearchBar;
