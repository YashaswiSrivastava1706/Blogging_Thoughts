// index.js

// Import necessary modules
const express = require('express');
const app = express();
const PORT = 3000;

// Body parser middleware to parse JSON requests
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Import the Post model
const Post = require('./models/post');

// Use bodyParser middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Define the file path for storing posts data
const postsFilePath = path.join(__dirname, 'data', 'posts.json');

// Read all posts
app.get('/api/posts', (req, res) => {
  // Read posts data from the file
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  // Send the posts as a JSON response
  res.json(posts);
});

// Read a single post by ID
app.get('/api/posts/:id', (req, res) => {
  
  // Extract the post ID from the request parameters
  const postId = req.params.id;
  // Read posts data from the file
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  // Find the post with the specified ID
  const post = posts.find(p => p.id == postId);
  // Check if the post exists and send the response accordingly
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Create a new post
app.post('/api/posts', (req, res) => {
  // Extract data from the request body
  const { title, content, author } = req.body;
  // Create a new Post object
  const newPost = new Post(title, content, author);
  // Read posts data from the file
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  // Assign a unique ID to the new post
  newPost.id = posts.length + 1;
  // Add the new post to the posts array
  posts.push(newPost);
  // Write the updated posts data back to the file
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  // Send the new post as a JSON response
  res.json(newPost);
});

// Update an existing post
app.put('/api/posts/:id', (req, res) => {
  // Extract post ID and data from the request
  const postId = req.params.id;
  const { title, content, author } = req.body;
  // Read posts data from the file
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  // Find the index of the post with the specified ID
  const index = posts.findIndex(p => p.id == postId);
  // Check if the post exists and update it
  if (index !== -1) {
    posts[index] = { id: postId, title, content, author, timestamp: new Date() };
    // Write the updated posts data back to the file
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
    // Send the updated post as a JSON response
    res.json(posts[index]);
  } else {
    // If the post is not found, send a 404 response
    res.status(404).json({ error: 'Post not found' });
  }
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  // Extract post ID from the request
  const postId = req.params.id;
  // Read posts data from the file
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  // Filter out the post with the specified ID
  const updatedPosts = [...posts.slice(0,indexToRemove),...posts.slice(indexToRemove + 1)];
  // Write the updated posts data back to the file
  fs.writeFileSync(postsFilePath, JSON.stringify(updatedPosts, null, 2));
  // Send a success message as a JSON response
  res.json({ message: 'Post deleted successfully' });
});

// Search posts by author
app.post('/api/posts/search', (req, res) => {
    // Extract author name from the request body
    const authorName = req.body.author;
    // Read posts data from the file
    const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
    // Filter posts by the specified author
    const authorPosts = posts.filter(p => p.author == authorName);
    // Send the filtered posts as a JSON response
    res.json(authorPosts);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
