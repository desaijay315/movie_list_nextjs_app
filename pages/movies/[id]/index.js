import { getMovieById, deleteMovie, getMovies } from '../../../actions'
import Link from 'next/link'
import router from 'next/router'


const Movie = (props) => {

  const { movie } = props
  const handleDeleteMovie = async (id) => {

    const deleteMovieById = await deleteMovie(id);

    if(deleteMovieById){
        router.push('/');
    }
  }

  return (
    <div className="container">
       <div className="jumbotron">
        <h1 className="display-4">{ movie.name }</h1>
        <p className="lead">{ movie.description }</p>
        <hr className="my-4" />
        <p>{ movie.genre }</p>
        <button className="btn btn-primary btn-lg mr-1" href="#" role="button">Learn more</button>
        <button onClick={() => handleDeleteMovie(movie.id)} className="btn btn-danger btn-lg" href="#" role="button">Delete</button>
        <Link href="/movies/[id]/edit" as={`/movies/${movie.id}/edit`}>
            <button className="btn btn-warning btn-lg" href="#" role="button">Edit</button>
        </Link>
      </div>
      <p className="desc-text">
       { movie.longDesc }
      </p>	 
      <style jsx>{`
        .desc-text {
          font-size: 21px;
        }
      `}
      </style>
    </div>
  )
}


Movie.getInitialProps = async ({query}) => {
    const movie = await getMovieById(query.id)
  
    return { movie }
}


/*
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const movies = await getMovies()
 // const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = movies.map(movie => ({
    params: { id: movie.id },
  }))


  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const movie = await getMovieById(params.id)
  //const post = movie;

  console.log(movie)
  // Pass post data to the page via props
  return { props: { movie } }
}*/
  

export default Movie