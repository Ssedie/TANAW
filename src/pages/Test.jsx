import React, { useEffect, useState } from 'react';

function Test() {
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState([]);

  function onKeywordChange(event) {
    setKeyword(event.target.value);
  }

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []); // fetch only once

  return (
    <div>
      Test: 
      <input 
        type="text" 
        value={keyword} 
        onChange={onKeywordChange}
      />

      <h3>Keyword: {keyword}</h3>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Test;
