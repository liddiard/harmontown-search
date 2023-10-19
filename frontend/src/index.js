import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.scss'
import reportWebVitals from './reportWebVitals'
import Root from './routes/root'
import EpisodeList from './routes/episodeList'
import Search from './components/Search'
import About from './routes/about'
import NotFound from './routes/404'
import ErrorPage from './error-page'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Search />
      },
      {
        path: '/episode/:epNumber',
        element: <Search />
      },
      {
        path: '/episode-list',
        element: <EpisodeList />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
