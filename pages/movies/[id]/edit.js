import React, {useState} from 'react'
import router from 'next/router'
import MovieCreateForm from '../../../components/movieCreateForm';
import { getMovieById, updateMovie } from '../../../actions';


const EditMovie = (props) => {
    const { movie } = props; 
    
    const handleUpdateMovie = (movie) =>{
        updateMovie(movie).then((updatedMovie) => {
            router.push('/movies/[id]', `/movies/${movie.id}`)
    });
    }

    return (
      <div className="container">
        <h1>Edit the Movie</h1>
        <MovieCreateForm
          submitButton="Update"
          initialData={movie}
          handleFormSubmit={handleUpdateMovie} />
      </div>
    )
}

EditMovie.getInitialProps = async ({query}) => {
    const {id} = query;
    const movie = await getMovieById(id)
    return {
        movie
    }
}


export default EditMovie