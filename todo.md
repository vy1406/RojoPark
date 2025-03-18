run the mockup server

# snippets: 
ng g service services/posts

ng g c pages/park --standalone

# aws:
- webSockets. 
- notifications

# client | functionality

- PWA
    - notifications

- messages + websockets
- implement map
- debounce on search
- fix date make it with minutes, make ios
- signup ( register with pet name ), add picture
- new park form - email / step function
- howTo. 

# client | UI
- add the carousel
- remove pictures, which were selected.

# client | OPTIMIZATION 
- bonus:
    - subscribe to comments, on each adding comments post data and show loader, currently u send the whole post.

https://github.com/ralftar/ng-mat-carousel?tab=readme-ov-file



# How To:

- Publish layers:
1. zip whatever in shared_dep_layer, call it 'shared_dep_layer'
2. run the command publish:layer

- Publish lambdas ( for example login):
1. go to handlers ... -> login
2. select all files inside login folder ( etc index.js )
3. move the folder one step up, to the level login folder ( == inside the auth folder )
4. change the auth:uploadzip to the correct file
5. npm run auth:uploadzip


# Continue:
- add user to user Table
- create service to upload with pre-signed url. 
- create a profile page where he can upload.
- generate github profile type