import React, {Component, Fragment} from 'react';
import Link from 'next/link'


const MovieList = (props) => {
        const {movies} = props;

        const shorten = (text, maxLength) =>{
            if(text && text.length > maxLength){
                return text.substr(0,maxLength) + '...'
            }
            return text
        }
        return(
            <Fragment>
                {movies.map((movie) =>
                    (
                        <div className="col-lg-4 col-md-6 mb-4" key={movie.id}>
                            <div className="card h-100">
                            <Link href="/movies/[id]" as={`/movies/${movie.id}`}>
                                <a><img className="card-img-top" src={movie.image} alt="" /></a>
                            </Link>
                                <div className="card-body">
                                <h4 className="card-title">
                                <Link href="/movies/[id]" as={`/movies/${movie.id}`}>
                                    <a>{movie.name}</a>
                                </Link>
                                </h4>
                    <div className="movie-genre">{movie.genre}</div>
                    <h5>{movie.releaseYear}</h5>
                    <p className="card-text">{shorten(movie.description , 200)}</p>
                                </div>
                                <div className="card-footer">
                    <small className="text-muted">{movie.rating}</small>
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            </Fragment>
        )
}



export default MovieList;