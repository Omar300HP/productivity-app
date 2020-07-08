# react-project-bootstrap

Initializing React project with minimum required dependencies and statics.

# dependencies and includes

"axios"
"classnames"
"date-fns"
"js-cookie"
"node-sass"
"primeicons"
"primereact"
"react"
"react-dom"
"react-router-dom"
"react-scripts"
"react-select"
"react-transition-group"
"reactstrap"

1. npm i -g npm-check-updates
2. ncu -u
3. npm install

4. Check if FontAwesome is up-to-date

- 4.1 Update the fontawesome.css file from [here](https://cdnjs.com/libraries/font-awesome)
- 4.2 Download and Install the 3 fonts in /src/styles/fonts/ from [here](https://fontawesome.com/download)

5. Check if Bootstrap is up-to-date

- 5.1 Update the bootstrap.css or bootstrap-rtl.css file from [here](https://getbootstrap.com) or [here(rtl)](https://rtlcss.com/cdn/css-frameworks/bootstrap/index.html)
- 5.2 Choose between bootstrap or the rtl version according to your website, edit in /public/index.html

6. Go to public/manifest.json to change your application settings in Chrome Mobile

7. Go to public/index.html to change your application meta data in Chrome Web

8. If on windows machine or in case a sass url error occured: npm install resolve-url-loader, go to index.js and set removeCR: true

# project structure

1. /src/components: contains global components:
   a. loader spinner
   b. header
   c. sidebar
   d. routes
   e. apis
   f. current date and time

2. /src/context: contains context used in your application, you will have to set your context provider in App.js

3. /src/custom-hooks: contains all custom hooks used in your application:
   a. useTryndaForm is a form validator and handler
   b. useCollection is a data fetcher returning a collection of docs
   c. useDoc is a data fetcher returning a single doc
   d. useSmartScroll is a DOM handler for the native scrollbar

4. /src/images: contains all images used in your application

5. /src/routes/: conatains all routes used in your application, we use react-router-dom and initiate it in App.js
   every route include at least 2 files; RouteComponent.js and RouteComponent.scss, you can add an additional folder of
   /components/ included in this route, but the style of these components will be included in their parent sass file.

6. /src/styles/: contains all your fonts in /fonts/ and your global styles as follow:
   a. color-palette.scss defines your color palette
   b. fonts.scss defines your fonts
   c. rtl.scss make the project direction as rtl and defines any classes used specifically in the rtl view
   d. styles.scss defines the global components styles
   e. templates.scss defines the global ui elements styles and any global property such as border-radius and
   button onHover animation
   f. react_select_custom.js defines custom styling for all react-select components
