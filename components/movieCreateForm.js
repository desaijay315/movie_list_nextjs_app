import React, {useState} from 'react';

const initialState = {
    name: '',
    description: '',
    rating: 0,
    genre:[],
    longDesc:'',
    image: '',
    cover:''
}

const MovieCreateForm = (props) => {
    // console.log(props.initialData);

    //check if the edit data is present or not
    const defaultData = props.initialData ? {...props.initialData} : initialState

    const [formData, setFormData] = useState(defaultData);

    const {
        name,
        description,
        rating,
        genre,
        longDesc,
        image,
        cover
      } = formData;

    const onChange = e =>{
        if(e.target.name === 'genre'){
            const  {options} = e.target
            const  optionsLength = options.length
            let value = []
            for(let i=0; i < optionsLength; i++){
                if(options[i].selected){
                    value.push(options[i].value)
                }   
            }
            // console.log(value);
            setFormData({ ...formData, genre: value.toString() });
        }else{
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    const submitForm = () => {
        props.handleFormSubmit({...formData})
    }

    return (
      <form onSubmit={e => onSubmit(e)}>
          { JSON.stringify(formData)}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" aria-describedby="emailHelp" placeholder="Lord of the Rings" name="name" onChange={e => onChange(e)} value={name}/>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input type="text" className="form-control" id="description" placeholder="Somewhere in Middle-earth..." name="description" onChange={e => onChange(e)} value={description}/>
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <input type="number" max="5" min="0" className="form-control" id="rating" placeholder="3" name="rating" onChange={e => onChange(e)} value={rating}/>
          <small id="emailHelp" className="form-text text-muted">Max: 5, Min: 0 </small>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input type="text" className="form-control" id="image" placeholder="http://....." name="image" onChange={e => onChange(e)} value={image}/>
        </div>
        <div className="form-group">
          <label htmlFor="cover">Cover</label>
          <input type="text" className="form-control" id="cover" placeholder="http://......" name="cover" onChange={e => onChange(e)} value={cover}/>
        </div>
        <div className="form-group">
          <label htmlFor="longDesc">Long Description</label>
          <textarea className="form-control" id="longDesc" rows="3" name="longDesc" onChange={e => onChange(e)} value={longDesc}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
          onChange={e => onChange(e)}
          multiple
          className="form-control"
          id="genre"
          name="genre"
          value={[genre]}>
          <option>drama</option>
          <option>music</option>
          <option>adventure</option>
          <option>historical</option>
          <option>action</option>
        </select>
        </div>
        <button onClick={submitForm} type="button" className="btn btn-primary">{props.submitButton ? 'Update': 'Create' }</button>
      </form>
    )
}
  
export default MovieCreateForm