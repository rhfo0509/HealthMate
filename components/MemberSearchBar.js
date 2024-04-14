import React, { useState } from "react";
import { SearchBar } from "react-native-elements";

function MemberSearchBar({ members, setFilteredMembers }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    const filteredMembers = members.filter((member) =>
      member.displayName.includes(text)
    );
    setFilteredMembers(filteredMembers);
    setSearchText(text);
  };

  return (
    <SearchBar
      placeholder="검색할 회원을 입력하세요."
      onChangeText={handleSearch}
      value={searchText}
      lightTheme={true}
    />
  );
}

export default MemberSearchBar;
