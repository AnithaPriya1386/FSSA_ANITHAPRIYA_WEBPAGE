document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Posts';
    backButton.style.display = 'none'; // Initially hide the back button

    async function fetchPosts() {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await response.json();
        return posts;
    }

    async function fetchComments(postId) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = await response.json();
        return comments;
    }

    async function displayPosts() {
        const posts = await fetchPosts();
        // Group posts by user
        const postsByUser = {};
        posts.forEach(post => {
            if (!postsByUser[post.userId]) {
                postsByUser[post.userId] = [];
            }
            postsByUser[post.userId].push(post);
        });
        
        // Iterate through each user
        for (let userId in postsByUser) {
            const userPosts = postsByUser[userId];
            
            // Create user container
            const userContainer = document.createElement('div');
            userContainer.classList.add('user-container');
            
            // Create user header
            const userHeader = document.createElement('h2');
            userHeader.textContent = `User ${userId}`;
            userContainer.appendChild(userHeader);
            
            // Iterate through each post of the user
            for (let post of userPosts) {
                const postElement = document.createElement('div');
                postElement.classList.add('post');

                const postTitle = document.createElement('h3');
                postTitle.textContent = post.title;

                const postBody = document.createElement('p');
                postBody.textContent = post.body;

                const commentButton = document.createElement('button');
                commentButton.textContent = 'Click to see Comments';
                commentButton.addEventListener('click', async function() {
                    const comments = await fetchComments(post.id);
                    const commentsContainer = document.createElement('div');
                    commentsContainer.classList.add('comments-container');
                    comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.classList.add('comment');
                        commentElement.innerHTML = `<strong>${comment.name}:</strong> ${comment.body}`;
                        commentsContainer.appendChild(commentElement);
                    });
                    commentsContainer.appendChild(backButton); // Append back button to comments container
                    postElement.appendChild(commentsContainer);
                    // Hide the button after displaying comments
                    commentButton.style.display = 'none';
                    backButton.style.display = 'block'; // Show the back button
                });

                backButton.addEventListener('click', function() {
                    const commentsContainer = postElement.querySelector('.comments-container');
                    postElement.removeChild(commentsContainer); // Remove comments container
                    commentButton.style.display = 'block'; // Show the comment button
                    backButton.style.display = 'none'; // Hide the back button
                });

                postElement.appendChild(postTitle);
                postElement.appendChild(postBody);
                postElement.appendChild(commentButton);

                userContainer.appendChild(postElement);
            }
            
            postsContainer.appendChild(userContainer);
        }
    }

    displayPosts();
});
