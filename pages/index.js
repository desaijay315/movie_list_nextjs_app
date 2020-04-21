import React, { useState } from 'react'
import SideMenu from '../components/sideMenu'
import Carousel from '../components/corousel'
import MovieList from '../components/movies/movieList'

import { getMovies, getCategories } from '../actions'

const Home = (props) => {
  const { images, movies,categories } = props

  const[filter,setFilter] = useState('all')


  const changeCategory  = category =>{
    setFilter(category);
  }

  const filterMovies = movies =>{
    if(filter === 'all'){
      return movies;
    }
    return movies.filter((m) =>{
      return m.genre && m.genre.includes(filter)
    })
  }

  return (
    <div>
      <div className="home-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <SideMenu
                changeCategory={changeCategory}
                activeCategory={filter}
                appName={"Movie DB"}
                categories={categories}
              />
            </div>
            <div className="col-lg-9">
              <Carousel images={images} />
                <h1>Displaying {filter} Movies</h1>
              <div className="row">
                <MovieList movies={filterMovies(movies) || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Home.getInitialProps = async () => {
  const movies = await getMovies()
  const images = movies.map(movie => ({
    id: `image-${movie.id}`,
    url: movie.cover,
    name: movie.name }))
  
  const categories = await getCategories();
  return {
    movies,
    images,
    categories
  }
}



// This also gets called at build time
/*export async function getStaticProps() {
  
  const movies = await getMovies()
  const images = movies.map(movie => ({
    id: `image-${movie.id}`,
    url: movie.cover,
    name: movie.name }))
  
  const categories = await getCategories();
  return {
      props:{
        movies,
        images,
        categories
    }
  }

  // Pass post data to the page via props
  //return { props: { post } }
}*/

export default Home;