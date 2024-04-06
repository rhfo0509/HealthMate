import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import PostCard from "../components/PostCard";
import { getPosts } from "../lib/posts";

function FeedScreen() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 포스트목록을 조회한 후 posts 상태에 담기
    const fn = async () => {
      const _posts = await getPosts();
      setPosts(_posts);
    }
    fn();
  }, []);

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const renderItem = ({item}) => (
  <PostCard 
    createdAt={item.createdAt}
    description={item.description}
    id={item.id}
    user={item.user}
    photoURL={item.photoURL}
  />
)

export default FeedScreen;
