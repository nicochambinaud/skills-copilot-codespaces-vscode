// Create web server
// Create server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const queryString = require('querystring');

const server = http.createServer((req, res) => {
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    const parsedUrl = url.parse(req.url, true);
    const parsedQuery = parsedUrl.query;
    const parsedPath = parsedUrl.pathname;

    if (parsedPath === '/addComment' && req.method === 'POST') {
        let body = '';

        req.on('data', data => {
            body += data;
        });

        req.on('end', () => {
            const comment = queryString.parse(body).comment;
            fs.appendFile('./comments.txt', `${comment}\n`, 'utf8', (err) => {
                if (err) {
                    res.statusCode = 400;
                    res.end('Failed to save the comment');
                } else {
                    res.statusCode = 201;
                    res.end('Comment saved');
                }
            });
        });
    } else if (parsedPath === '/getComments') {
        fs.readFile('./comments.txt', 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Failed to read the comments');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(data);
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/');
});
// Run the server
// $ node comments.js
// Output
// Server is running on http://localhost:3000/
// Test the server
// Open a web browser and visit http://localhost:3000/addComment. You should see Not Found.
// Open a terminal and run the following command to add a comment:
// $ curl -X POST -d "comment=Hello, world" http://localhost:3000/addComment
// You should see Comment saved.
// Open a web browser and visit http://localhost:3000/getComments. You should see Hello, world.
// Open a terminal and run the following command to add another comment:
// $ curl -X POST -d