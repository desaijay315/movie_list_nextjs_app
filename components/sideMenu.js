import { useRouter } from 'next/router'
import Modal from './modal'
import MovieCreateForm from './movieCreateForm'
import { createMovie } from '../actions'


const SideMenu = (props) =>{
  const {categories} = props;
  const router = useRouter();

  const handleCreateMovie = (movie) => {
    createMovie(movie).then((movies) => {
      // Close modal after create
      console.log(JSON.stringify(movies))
      closeModal();
      router.push('/')
    })
  }

  const closeModal = () =>{
    return true;
  }


    return(
        <div>
          <Modal hasSubmit={false}>
            <MovieCreateForm handleFormSubmit={handleCreateMovie} />
          </Modal>
            <h1 className="my-4">Shop Name</h1>
            <div className="list-group">
              {categories.map((category,index) =>(
                <a
                onClick={()=>props.changeCategory(category.name)}
                 href="#" 
                 className={`list-group-item ${props.activeCategory === category.name ? 'active' : '' }`} 
                 key={category.id}
                 >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
    )
}


export default SideMenu;