showcase
========
Getting Started
---------------
1. Install `node.js`
2. Clone this repo

    ```bash
    $> git clone git@github.com:cinema6/showcase.git
    ```
3. Connect to the Reelcontent VPN
4. Install Dependencies

   ```bash
   npm install
   ```

Common Tasks
------------
### Run Unit Tests
```bash
npm test
```

### Run Unit Tests with Auto-Rerun
```bash
npm run tdd
```

### Start a Development Server
```bash
npm start
```

Best Practices
--------------
1. Always use [`redux-actions`](https://github.com/acdlite/redux-actions) to create actions

    **NO**:

    ```javascript
    const DO_STUFF = 'DO_STUFF';
    export function doStuff(payload) {
        return {
            type: DO_STUFF,
            payload: payload
        };
    }
    ```
    
    **YES**:
    
    ```javascript
    import { createAction } from 'redux-actions';
    
    const DO_STUFF = 'DO_STUFF';
    export const doStuff = createAction(DO_STUFF);
    ```

Included Redux Middleware
-------------------------
Redux middleware changes the way the `store`'s `dispatch()` method functions, so it's important to understand all the middleware being used so that you are able to follow the flow of the application.

`showcase` uses the following redux middleware:

### 1. [`fsa-thunk`](https://github.com/cinema6/showcase/blob/master/src/middleware/fsa_thunk.js)
This middleware allows you to pass a `Function` (or thunk) to `dispatch()` that it will call execute. Your `Function` will be invoked with two arguments: `dispatch` (`Function`, so that you can dispatch other actions) and `getState` (`Function` so that you can use the store's `state` in your logic.)

To create a thunk, you must wrap your action creator `Function` in `createThunk()`. Your action creator `Function` should return a `Function` (the thunk.)

**Most importantly**, the `return` value of your thunk `Function` will become the `return` value of `dispatch()`. This is very important as it allows the chaining of `Promise`es.

Example:

```javascript
import { createThunk } from 'src/middleware/fsa_thunk';

export const doStuff = createThunk(function() { // The action creator
    return function thunk(dispatch, getState) { // The thunk
        return dispatch(doAsyncStuff())
            .then(dispatch(doMoreAsyncStuff());
    };
});

store.dispatch(doStuff()).then(() => console.log('Stuff is done!'));
```

### 2. [`redux-promise-middleware`](https://github.com/pburtchaell/redux-promise-middleware)
This middleware will `dispatch()` actions that track the state of a `Promise` when the `Promise` is provided as the `payload` of a [Flux Standard Action (FSA)](https://github.com/acdlite/flux-standard-action).

**Important**: When you dispatch an FSA whose `payload` is a `Promise`, an action with the `type` you provided will *never* actually be `dispatch()`ed. Instead, three new actions will be dispatched for you:

1. *YOUR_TYPE*_PENDING: `dispatch()`ed immediately
2. *YOUR_TYPE*_FULFILLED: `dispatch()`ed when the `Promise` is fulfilled, with the `Promise`'s fulfillment value as its `payload`
3. *YOUR_TYPE*_REJECTED: `dispatch()`ed when the `Promise` is rejected, with the `Promise`'s rejection reason as its `payload`

For example:

```javascript
function doSomethingAsync() {
    return new Promise(resolve => {
        setTimeout(() => resolve('Done after 1 sec.'), 1000);
    });
}

export const DO_SOMETHING = 'DO_SOMETHING';
function doSomething() {
    return {
        type: DO_SOMETHING,
        payload: doSomethingAsync() // this returns a Promise
    };
}

store.dispatch(doSomething()); // A DO_SOMETHING_PENDING action is immediately dispatch()ed

// After one second, DO_SOMETHING_FULFILLED is dispatched
```

Where this can get interesting is when you remember that `dispatch()` can return a `Promise`:

```javascript
import { getStuff } from '../actions/get_stuff'; // action creator that will cause dispatch() to return a Promise

export const DO_SOMETHING = 'DO_SOMETHING';
function doSomething() {
    // Return a Function thanks to redux-thunk.
    return function thunk(dispatch) {
        // dispatch the DO_SOMETHING action
        dispatch({
            type: DO_SOMETHING,
            payload: dispatch(getStuff()) // Dispatch getStuff() action: this returns a Promise
        });
    };
}

store.dispatch(doSomething()); // A DO_SOMETHING_PENDING action is immediately dispatch()ed

// DO_SOMETHING_FULFILLED is dispatch()ed as soon as the Promise returned by
// dispatch(getStuff()) is fulfilled.
```

### 3. [`src/middleware/promisify`](https://github.com/cinema6/showcase/blob/master/src/middleware/promisify.js)
This middleware ensures that `dispatch()` **always** returns a `Promise` so you can `dispatch().then()` with confidence.

Additionally, it will make sure the `Promise` it returns is *rejected* if it recieves a [Flux Standard Action (FSA)](https://github.com/acdlite/flux-standard-action) representing an `error`.

Example:

```javascript

export const DO_SOMETHING = 'DO_SOMETHING';
function doSomething() {
    return {
        type: DO_SOMETHING,
        payload: { foo: 'bar' }
    };
}

// This action would not normally cause dispatch() to return a `Promise`, but now it does!
store.dispatch(doSomething()).then(() => console.log('YAY!'));
```

Utility Documentation
---------------------
### db

#### createDbActions({ `type`: `String`, `endpoint`: `String`, `[key]`: `String`  });
These action creators, along with the db reducer will automatically keep the app's cache of entities in-sync and maintain a single source of truth. The location of the cache is `state.db`.

This function accepts three named parameters:

1. `type`: The type of entity (e.g. `campaign`, `card`, `experience`, etc.)
2. `endpoint`: The plural endpoint for the collection (e.g. `/api/content/cards`)
3. `key` (optional): The name of the unique identifying property for each object. Defaults to `id`.

The function will return an `Object` with 5 action creator `Function`s:

1. `list()`: Gets all entities
2. `get({ id })`: Gets a single entity by id
3. `create({ data })`: Creates an entity with the provided `data`
4. `update({ data })`: Updates an existing entity with the provided `data`
5. `remove({ id })`: Deletes the entity with the provided id

Each action creator `Function` (`list`, `get`, `create`, `update`, `remove`) also includes three properties:

1. `START`: The name of the action dispatched when the operation starts
2. `SUCCESS`: The name of the action dispatched when the operation succeeds
3. `FAILURE`: The name of the action dispatched when the operation fails

Each `SUCCESS` action's `payload` will be an `Array` containing the ids of the items operated on. This is true even for operations that operate on a *single* item; the single item's `id` will be the sole member of the `Array`.

Example:

```javascript
const experience = createDbActions({
    type: 'experience',
    endpoint: '/api/content/experiences'
});

store.dispatch(experience.get({ id: 'e-jfruwe9ryf478' })); // Get a single item
```

#### createDbReducer(reducerMap)
Creates the reducer for `state.db`. [**This app already has a db reducer.**](https://github.com/cinema6/showcase/blob/master/src/reducers/db/index.js)

The keys of the `reducerMap` `Object` should match up with an entity `type`. The value should be a reducer `Function` that can be used to add custom behavior to the entity cache.

Example:

```javascript
export default createDbReducer({
    experience: (state, action) => {
        switch (action.type) {
        case 'MY_CUSTOM_ACTION':
            return { /* the new state of the cache */ };
        default:
            return state;
        }
    }
});
```

### page

#### createPageReducer(reducerMap)
Creates the reducer that will manage the transient state of page components. Each key of the `reducerMap` should be the `path` (unique identifier) of a page component. Each value should be a reducer function for that page. [**This app already has a page reducer.**](https://github.com/cinema6/showcase/blob/master/src/reducers/page/index.js)

When a page component is rendered, its corresponding reducer will be called with a `state` of `undefined` to get the initial page state. Subsequently, the reducer will be called with every dispatched action until the page component is destroyed. **A page's reducer is not called if the page is not on the screen.**

#### pagify({ `path`: `String` })

Injects the `page` state from redux as a prop into the component it wraps. The `path` named property should correspond to the name of a configured page reducer.

Example:

Page reducer:

```javascript
createPageReducer({
    myPage: (state = { name: 'RC' }, action) => { // <--- Same name as path in pageify()
        switch (state.action) {
        // Handle other actions
        default:
            return state;
        }
    }
});
```

Component:

```javascript
class MyPage extends Component {
    render() {
        const { page } = this.props;
        
        return <div>My name is {page.name}!</div>;
    }
}

export default pagify({
    path: 'myPage' // <----- Same name as key in pageReducer
})(MyPage);
```
