import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Import Apollo provider and send request to the Apollo server.
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost'


const client = new ApolloClient({
  // http://localhost:3001/graphql
  request: operation => {
    // Get token from localstorage
    const token = localStorage.getItem("id_token");
    // return the below header
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider  client ={client}>
        <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
